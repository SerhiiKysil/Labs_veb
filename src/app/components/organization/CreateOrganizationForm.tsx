import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from "../../context/UserContext";
import ImageUpload from "../../utils/ImageUpload"
import '@/app/globals.css';

const CLOUDINARY_UPLOAD_PRESET = 'motyv_images';
const CLOUDINARY_CLOUD_NAME = 'dntd9wvtq';

interface OrganizationRequestDto {
  name: string;
  description: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  websiteUrl: string | null;
  contactEmail: string;
  creatorEmail: string;
}

const CreateOrganizationForm: React.FC = () => {
  const { userCurrent } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logoUrl: '',
    bannerUrl: '',
    websiteUrl: '',
    contactEmail: '',
    creatorEmail: userCurrent?.email || '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    if (!CLOUDINARY_UPLOAD_PRESET || !CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary configuration is missing');
    }
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
  
      const data = await response.json();
      if (!response.ok) {
        console.error('Cloudinary Error:', data);
        throw new Error(data.error?.message || 'Cloudinary upload failed');
      }
  
      return data.secure_url;
    } catch (err) {
      console.error('Upload failed:', err);
      throw err;
    }
  };
  

  const validateForm = (): boolean => {
    if (!formData.name || !formData.description || !formData.contactEmail) {
      setErrorMessage('Будь ласка, заповніть обов\'язкові поля (назва, опис та контактний email).');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contactEmail)) {
      setErrorMessage('Будь ласка, введіть коректний email.');
      return false;
    }

    return true;
  };

  const handleCreateOrganization = async () => {
    if (!userCurrent) {
      setErrorMessage('Не вдалося отримати дані користувача. Переконайтеся, що ви увійшли до системи.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Upload images sequentially if they exist
      let logoUrl: string | null = formData.logoUrl || null;
      let bannerUrl: string | null = formData.bannerUrl || null;

      if (logoFile) {
        logoUrl = await uploadToCloudinary(logoFile);
      }

      if (bannerFile) {
        bannerUrl = await uploadToCloudinary(bannerFile);
      }

      // Prepare the organization request data
      const cleanedFormData: OrganizationRequestDto = {
        ...formData,
        logoUrl,
        bannerUrl,
        websiteUrl: formData.websiteUrl || null,
        creatorEmail: userCurrent.email
      };

      // Send the request to create the organization
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organizations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedFormData),
        credentials: 'include',
      });

      if (response.ok) {
        setSuccessMessage('Організацію створено! Очікується верифікація адміністратором.');
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Не вдалося створити організацію. Спробуйте ще раз.');
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage('Сталася помилка при створенні організації. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = (field: 'logoUrl' | 'bannerUrl') => {
    return (file: File | null, url?: string) => {
      setFormData(prevData => ({
        ...prevData,
        [field]: url || '', // Use the URL if available, otherwise reset to an empty string
      }));
  
      if (field === 'logoUrl') {
        setLogoFile(file || null); // Set the file if provided, otherwise reset to null
      } else {
        setBannerFile(file || null);
      }
    };
  };
  

  return (
    <section className="bg-white text-dark-blue py-12">
      <div className="container mx-auto grid grid-cols-1 gap-8" style={{ maxWidth: '85%' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 className="text-2xl font-bold mb-6 text-center">Створити організацію</h2>
          <div className="mb-6 text-sm text-gray-600 text-center">
            Після створення організація буде перевірена адміністратором перед публікацією
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <input 
                name="name" 
                placeholder="Назва організації *" 
                value={formData.name} 
                onChange={handleChange} 
                className="border p-2 w-full rounded-[10px]" 
                required 
                maxLength={255}
              />
            </div>
            
            <div>
              <textarea 
                name="description" 
                placeholder="Опис організації *" 
                value={formData.description} 
                onChange={handleChange} 
                className="border p-2 w-full rounded-[10px] min-h-[100px]" 
                required 
                maxLength={10000}
              />
            </div>

            <div>
              <input 
                name="contactEmail" 
                placeholder="Контактний Email *" 
                type="email"
                value={formData.contactEmail} 
                onChange={handleChange} 
                className="border p-2 w-full rounded-[10px]" 
                required 
              />
            </div>

            <div>
              <ImageUpload 
                name="logoUrl"
                placeholder="Логотип"
                onImageSelect={handleImageSelect('logoUrl')}
                initialImageUrl={formData.logoUrl}
              />
            </div>

            <div>
              <ImageUpload 
                name="bannerUrl"
                placeholder="Банер"
                onImageSelect={handleImageSelect('bannerUrl')}
                initialImageUrl={formData.bannerUrl}
              />
            </div>

            <div>
              <input 
                name="websiteUrl" 
                placeholder="URL веб-сайту" 
                value={formData.websiteUrl} 
                onChange={handleChange} 
                className="border p-2 w-full rounded-[10px]" 
              />
            </div>

            <button 
              type="submit"
              onClick={handleCreateOrganization} 
              disabled={isSubmitting}
              className="bg-dark-blue text-white px-4 py-2 rounded-[32px] w-full h-[56px] text-[20px] disabled:opacity-50"
            >
              {isSubmitting ? 'Створення...' : 'Створити організацію'}
            </button>

            {errorMessage && (
              <div className="text-red-500 mt-2 text-center">{errorMessage}</div>
            )}
            {successMessage && (
              <div className="text-green-500 mt-2 text-center">{successMessage}</div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateOrganizationForm;