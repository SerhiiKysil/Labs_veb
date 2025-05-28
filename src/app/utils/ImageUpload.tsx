import React, { useState, ChangeEvent, useCallback } from 'react';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Sample existing images (you can replace these with your actual image URLs)
const EXISTING_IMAGES = [
  'https://motyv.space/images/default.jpg',
  'https://motyv.space/images/image1.jpg',
  'https://motyv.space/images/image2.jpg',
  'https://motyv.space/images/blue.jpg',
];

interface ImageUploadProps {
  onImageSelect: (file: File | null, url?: string) => void;
  initialImageUrl?: string;
  placeholder: string;
  name: string;
  existingImages?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageSelect, 
  initialImageUrl = '', 
  placeholder,
  name,
  existingImages = EXISTING_IMAGES
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl);
  const [previewUrl, setPreviewUrl] = useState<string>(initialImageUrl || "/images/default.jpg");
  const [error, setError] = useState<string | null>(null);
  console.log(imageFile);
  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setImageUrl('');
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      setError('No file selected');
      setPreviewUrl("/images/default.jpg");
      setImageFile(null);
      onImageSelect(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError('Invalid file type. Only PNG, JPEG, WebP, AVIF, and GIF are allowed.');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File is too large. Maximum size is 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setImageFile(selectedFile);
      onImageSelect(selectedFile);
    };
    reader.readAsDataURL(selectedFile);
  }, [onImageSelect]);

  const handleUrlChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setImageUrl(url);
    setImageFile(null);
    setPreviewUrl(url || "/images/default.jpg");
    onImageSelect(null, url);
  }, [onImageSelect]);

  const handleExistingImageSelect = useCallback((url: string) => {
    setPreviewUrl(url);
    setImageFile(null);
    setImageUrl(url);
    setError(null);
    onImageSelect(null, url);
  }, [onImageSelect]);

  const handleClear = useCallback(() => {
    setPreviewUrl("/images/default.jpg");
    setImageFile(null);
    setImageUrl('');
    setError(null);
    onImageSelect(null);
  }, [onImageSelect]);

  return (
    <div className="space-y-4">
      <div className="relative border p-2 w-full rounded-md flex flex-col items-center">
        <img 
          src={previewUrl} 
          alt="Preview" 
          className="w-full h-80 object-cover rounded-md" 
        />
        <input 
          type="text" 
          name={`${name}-url`} 
          placeholder="Enter image URL"
          value={imageUrl} 
          onChange={handleUrlChange} 
          className="border p-2 w-full rounded-md mt-2"
        />
        <input 
          type="file" 
          name={`${name}-file`} 
          accept="image/png, image/jpeg, image/webp, image/avif, image/gif" 
          onChange={handleFileChange} 
          className="hidden" 
          id={`file-upload-${name}`} 
        />
        <label 
          htmlFor={`file-upload-${name}`} 
          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded mt-2"
        >
          {placeholder}
        </label>
      </div>

      {/* Horizontal Scrollable Image Gallery */}
      <div className="w-full overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {existingImages.map((imageUrl) => (
            <div 
              key={imageUrl} 
              className={`flex-shrink-0 w-24 h-24 cursor-pointer rounded-md overflow-hidden 
                ${previewUrl === imageUrl ? 'border-4 border-blue-500' : 'border border-gray-300'}`}
              onClick={() => handleExistingImageSelect(imageUrl)}
            >
              <img 
                src={imageUrl} 
                alt="Existing image" 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}

      {previewUrl !== "/images/default.jpg" && (
        <button 
          type="button" 
          onClick={handleClear} 
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
        >
          Прибрати
        </button>
      )}
    </div>
  );
};

export default ImageUpload;