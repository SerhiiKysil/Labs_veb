"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useUser } from "../../context/UserContext";
import StepOne from "./assets/StepOne";
import StepTwo from "./assets/StepTwo";
import AIAutofill from "./assets/AIAutofill";
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';


const CLOUDINARY_UPLOAD_PRESET = "motyv_images";
const CLOUDINARY_CLOUD_NAME = "dntd9wvtq";

type FilterResponse = {
  categories: Array<{ id: number; name: string }>;
  types: Array<{ id: number; name: string }>;
  organizations: Array<{ id: number; name: string }>;
};

const EventForm = () => {
  const { userCurrent, token,refreshUser } = useUser();
  const router = useRouter();
  useEffect(() => {
    const updateUser = async () => {
      try {
        const lastRefresh = Cookies.get("lastRefreshUser");
        const now = Date.now();
  
        // Перевірка чи минула година (3600 * 1000 мс)
        if (!lastRefresh || now - parseInt(lastRefresh) > 3600 * 1000) {
          await refreshUser();
          Cookies.set("lastRefreshUser", now.toString(), { expires: 1 });
          console.log("Дані користувача оновлено!");
        } else {
          console.log("Оновлення не потрібне.");
        }
      } catch (error) {
        console.error("Помилка під час оновлення даних:", error);
      }
    };
  
    // Викликати одразу при завантаженні сторінки
    updateUser();
  
    // Налаштувати інтервал на 1 годину (3600 секунд)
    const intervalId = setInterval(() => {
      updateUser();
    }, 3600 * 1000); // 3600000 мілісекунд = 1 година
  
    // Очистити інтервал при розмонтуванні компонента
    return () => clearInterval(intervalId);
  }, [refreshUser]); // refreshUser у залежностях
  
  
  
  
  
  
  const [isOnlineEvent, setIsOnlineEvent] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterResponse | null>(null);
  const [formData, setFormData] = useState({
    contactEmail: "",
    projectName: "",
    types: [] as Array<{ id: number; name: string }>,
    categories: [] as Array<{ id: number; name: string }>,
    organization: {
      id: -1,
      name: "",
    },
    projectDescription: "",
    startDateTime: "",
    endDateTime: "",
    country: "",
    region: "",
    city: "",
    adress: "",
    projectLanguage: "",
    banner_url: "",
    participationFeeType: 1,
    participationFee: 0,
    registrationLink: "",
    registrationDeadline: "",
    privateOpp: false,
    infoPack: "",
  });

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showTypesDropdown, setShowTypesDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  console.log(errorMessage, successMessage);
  const typesDropdownRef = useRef<HTMLDivElement>(null);
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);
  const predefinedLanguages = [
    "Українська",
    "Англійська",
    "Німецька",
    "Польська",
    "Французька",
    "Кримськотатарська",
    "Іспанська",
    "Чеська",
    "Словенська",
    "Словацька",
  ];
  const countries = [
    "Україна",
    "Австрія",
    "Болгарія",
    "Греція",
    "Грузія",
    "Естонія",
    "Іспанія",
    "Італія",
    "Кіпр",
    "Латвія",
    "Литва",
    "Нідерланди",
    "Німеччина",
    "Польща",
    "Португалія",
    "Румунія",
    "Словаччина",
    "США",
    "Франція",
    "Хорватія",
  ];
  const participationFeeTypes = [
    { id: 1, name: "Вільний вхід" },
    { id: 2, name: "Донат від суми" },
    { id: 3, name: "Вільний донат" },
    { id: 4, name: "Квиток" },
  ];
  const [dateErrors, setDateErrors] = useState({
    registrationDeadline: '',
    startDateTime: '',
    endDateTime: ''
  });
  const fetchEventData = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/opportunity/${id}`
      );
      const eventData = await response.json();

      // Transform the data to match form structure
      setFormData({
        contactEmail: eventData.contactEmail || "",
        projectName: eventData.projectName || "",
        types: eventData.types || [],
        categories: eventData.categories || [],
        organization: eventData.organization || { id: -1, name: "" },
        projectDescription: eventData.projectDescription || "",
        startDateTime: eventData.startDateTime || "",
        endDateTime: eventData.endDateTime || "",
        country: eventData.country || "Україна",
        region: eventData.region || "",
        city: eventData.city || "",
        adress: eventData.adress || "",
        projectLanguage: eventData.projectLanguage || "",
        banner_url: eventData.banner_url || "",
        participationFeeType: eventData.participationFeeType || 1,
        participationFee: eventData.participationFee || 0,
        registrationLink: eventData.registrationLink || "",
        registrationDeadline: eventData.registrationDeadline || "",
        privateOpp: eventData.privateOpp || false,
        infoPack: eventData.infoPack || "",
      });

      // Set online event state if country is "Онлайн"
      setIsOnlineEvent(eventData.country === "Онлайн");
    } catch (error) {
      console.error("Error fetching event data:", error);
      setErrorMessage("Помилка при завантаженні даних події");
    }
  };
  useEffect(() => {
    // Get ID from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (id) {
      setIsEditMode(true);
      setEventId(id);
      fetchEventData(id);
    }
  }, []);
  const [currentStep, setCurrentStep] = useState(1);

const handleNextStep = () => setCurrentStep(2);
const handlePrevStep = () => setCurrentStep(1);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/opportunity/filter`
        );
        const data: FilterResponse = await response.json();
        
        setFilters(data);
        
      } catch (error) {
        console.error("Failed to fetch filters:", error);
      }
    };

    fetchFilters();
  }, []);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    if (!CLOUDINARY_UPLOAD_PRESET || !CLOUDINARY_CLOUD_NAME) {
      throw new Error("Cloudinary configuration is missing");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        console.error("Cloudinary Error:", data);
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }

      return data.secure_url;
    } catch (err) {
      console.error("Upload failed:", err);
      throw err;
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        typesDropdownRef.current &&
        !typesDropdownRef.current.contains(event.target as Node)
      ) {
        setShowTypesDropdown(false);
      }
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoriesDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleImageSelect =
    (name: string) => (file: File | null, url?: string) => {
      setFormData((prevData) => ({
        ...prevData,
        [name]: url || null,
      }));
      if (file) {
        setBannerFile(file);
      } else {
        setBannerFile(null);
      }
    };

  const handleMultiSelectChange = (
    field: "types" | "categories",
    value: { id: number; name: string }
  ) => {
    setFormData((prevData) => {
      const updatedList = prevData[field].some((item) => item.id === value.id)
        ? prevData[field].filter((item) => item.id !== value.id)
        : [...prevData[field], value];

      return { ...prevData, [field]: updatedList };
    });
  };

  const removeSelectedItem = (
    field: "types" | "categories",
    value: { id: number; name: string }
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].filter((item) => item.id !== value.id),
    }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      
      // Validate dates when any date field changes
      if (['startDateTime', 'endDateTime', 'registrationDeadline'].includes(name)) {
        validateDates(
          newData.startDateTime,
          newData.endDateTime,
          newData.registrationDeadline
        );
      }
      
      return newData;
    });
  };

  const handleEditorChange = (content: string) => {
    setFormData((prevData) => ({
      ...prevData,
      projectDescription: content,
    }));
  };
  useEffect(() => {
    // Get ID from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (id) {
      setIsEditMode(true);
      setEventId(id);
      fetchEventData(id);
    }
  }, []);
  const handleParticipationFeeTypeChange = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const feeType = parseInt(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      participationFeeType: feeType,
      participationFee: feeType === 1 ? 0 : prevData.participationFee,
    }));
  };
  const handleOrganizationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOrgId = parseInt(e.target.value);
    const selectedOrg = userCurrent?.organizations.find(
      (org) => org.id === selectedOrgId
    );

    setFormData((prevData) => ({
      ...prevData,
      organization: {
        id: selectedOrgId,
        name: selectedOrg?.name || "",
      },
    }));
  };

  const validateDates = (
    startDate: string, 
    endDate: string, 
    deadlineDate: string
  ): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const deadline = new Date(deadlineDate);
    const now = new Date();
    
    let isValid = true;
    const newErrors = {
      registrationDeadline: '',
      startDateTime: '',
      endDateTime: ''
    };
  
    // Check if dates are in the past
    if (start < now) {
      newErrors.startDateTime = 'Дата початку не може бути в минулому';
      isValid = false;
    }
  
    if (deadline < now) {
      newErrors.registrationDeadline = 'Дедлайн реєстрації не може бути в минулому';
      isValid = false;
    }
  
    // Check if end date is before start date
    if (end < start) {
      newErrors.endDateTime = 'Дата завершення не може бути раніше дати початку';
      isValid = false;
    }
  
    // Check if registration deadline is after start date
    if (deadline > start) {
      newErrors.registrationDeadline = 'Дедлайн реєстрації має бути до початку події';
      isValid = false;
    }
  
    setDateErrors(newErrors);
    return isValid;
  };
  type LocationFormData = {
    country: string;
    city: string;
    region: string;
    adress: string;
  };
  
  // Modify the LocationSection prop type to be more flexible

  
  // In the EventForm component
  const updateLocationFields: React.Dispatch<React.SetStateAction<LocationFormData>> = 
    (updater) => {
      setFormData((prev) => {
        const locationData: LocationFormData = {
          country: prev.country,
          city: prev.city,
          region: prev.region,
          adress: prev.adress
        };
  
        const newLocationData = typeof updater === 'function' 
          ? updater(locationData) 
          : updater;
  
        return {
          ...prev,
          ...newLocationData
        };
      });
    };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    setIsSubmitting(true);
  
    try {
      let bannerUrl: string | null = formData.banner_url;
      if (bannerFile) {
        bannerUrl = await uploadToCloudinary(bannerFile);
      }
  
      const selectedOrganization =
        formData.organization.id !== -1
          ? formData.organization
          : userCurrent?.organizations[0] || { id: -1, name: "" };
  
      const selectedFeeType = participationFeeTypes.find(
        (type) => type.id === formData.participationFeeType
      );
  
      const payload = {
        contactEmail: "--EMAIL SKIPPED--",
        projectName: formData.projectName,
        types: formData.types,
        categories: formData.categories,
        organization: selectedOrganization,
        projectDescription: formData.projectDescription,
        startDateTime: formData.startDateTime,
        endDateTime: formData.endDateTime,
        slug: formData.projectName.toLowerCase().replace(/ /g, "-"),
        country: isOnlineEvent ? "Онлайн" : (formData.country?.trim() ? formData.country : "Україна"),
        region: isOnlineEvent
          ? "Онлайн"
          : formData.region.trim() === ""
          ? "--SKIPPED--"
          : formData.region.trim(),
        city: isOnlineEvent ? "Онлайн" : formData.city,
        adress: isOnlineEvent ? " " : formData.adress,
        projectLanguage: predefinedLanguages[0],
        banner_url: bannerUrl,
        participationFeeType: selectedFeeType ? selectedFeeType.id : null,
        participationFee:
          formData.participationFeeType === 1
            ? 0
            : formData.participationFee || 0,
        registrationLink: formData.registrationLink,
        registrationDeadline: formData.registrationDeadline,
        infoPack: "--SKIPPED--",
        privateOpp: formData.privateOpp,
        timestamp: new Date().toISOString(),
      };
  
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v2/opportunity${
        isEditMode ? `/${eventId}` : ""
      }`;
      const method = isEditMode ? "PUT" : "POST";
      console.log(payload);

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      console.log(payload);
      if (response.ok) {
        const responseText = await response.text(); // Get raw text
        let link = "";
      
        try {
          // Try to parse as JSON
          const parsed = JSON.parse(responseText);
          if (parsed.body && parsed.body.startsWith("https")) {
            link = parsed.body;
          }
        } catch {
          // Fallback in case it's not JSON
          const match = responseText.match(/https?:\/\/\S+/);
          if (match) {
            link = match[0];
          }
        }
      
        if (isEditMode) {
          setSuccessMessage("Подію успішно оновлено!");
        } else {
          setSuccessMessage(
            link
              ? `Подію успішно створено! ${link} або скопіюйте посилання з сторінки організації.`
              : "Подію успішно створено!"
          );
      
          // Reset form if not in edit mode
          setFormData({
            contactEmail: "",
            projectName: "",
            types: [],
            categories: [],
            organization: { id: -1, name: "" },
            projectDescription: "",
            startDateTime: "",
            endDateTime: "",
            country: "Україна",
            region: "",
            city: "",
            adress: "",
            projectLanguage: "",
            banner_url: "",
            participationFeeType: 1,
            participationFee: 0,
            registrationLink: "",
            registrationDeadline: "",
            privateOpp: false,
            infoPack: "",
          });
          setBannerFile(null);
        }
      } else {
        const error = await response.text();
        console.error("Error:", error);
        setErrorMessage("Помилка при збереженні події, перевірте усі поля.");
      }
      
      
      
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Помилка надсилання форми.");
    } finally {
      setIsSubmitting(false);
    }
  };



  if (!filters )
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%',fontSize: '48px',marginTop: '100px',color:'navy'}}>
        <p >Завантаження...</p>
      </div>
    );
    const handleStartDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormData((prev) => {
      const newFormData = { ...prev, startDateTime: value };
      
      if (!prev.endDateTime) {
        const startDate = new Date(value);
        startDate.setHours(startDate.getHours() + 3);
        newFormData.endDateTime = startDate.toISOString().slice(0, 16);
      }
      
      return newFormData;
    });
  };
  if (!userCurrent) {
    // Очистка кукі при застарілих даних
    Cookies.remove('organizationId');
    Cookies.remove('JSESSIONID');
    Cookies.remove('authToken');
    Cookies.remove('userId');

    // Редірект на вхід негайно
    router.push('/auth');

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          fontSize: '24px',
          marginTop: '100px',
          color: 'navy'
        }}
      >
        <p>Дані користувача застаріли. Перенаправлення...</p>
      </div>
    );
  }
return (
  <div>
<div className="mb-10 mt-5">
<div className="relative flex justify-between items-center mb-6 w-full max-w-3xl mx-auto px-6">
<div
            className="flex items-center cursor-pointer"
            onClick={() => setCurrentStep(1)}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                currentStep === 1 ? "bg-[#0B1F51] text-white" : "bg-gray-200 text-gray-400"
              }`}
            >
              1
            </div>
            <span className={currentStep === 1 ? "text-[#0B1F51] font-semibold" : "text-gray-400"}>
              Базова інформація
            </span>
          </div>
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setCurrentStep(2)}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                currentStep === 2 ? "bg-[#0B1F51] text-white" : "bg-gray-200 text-gray-400"
              }`}
            >
              2
            </div>
            <span className={currentStep === 2 ? "text-[#0B1F51] font-semibold" : "text-gray-400"}>
              Деталі події
            </span>
          </div>
        </div>
        <div className="flex justify-end w-full max-w-3xl mx-auto px-6 mb-4">
        {userCurrent?.email === "panchyshyn.an@gmail.com" &&
        <AIAutofill 
          setFormData={setFormData}
          setIsOnlineEvent={setIsOnlineEvent}
          predefinedTypes={filters.types}
          predefinedCategories={filters.categories}
        />}
        </div>
        {currentStep === 1 && <StepOne 
        formData={formData} 
        handleChange={handleChange} 
        handleEditorChange={handleEditorChange} 
        organizations={userCurrent?.organizations || []} 
        handleOrganizationChange={handleOrganizationChange} 
        dateErrors={dateErrors} 
        nextStep={handleNextStep} 
      />}
        {currentStep === 2 && <StepTwo 
        formData={formData} 
        handleChange={handleChange} 
        handleImageSelect={handleImageSelect} 
        handleParticipationFeeTypeChange={handleParticipationFeeTypeChange} 
        handleStartDateTimeChange={handleStartDateTimeChange} 
        dateErrors={dateErrors} 
        isOnlineEvent={isOnlineEvent} 
        setIsOnlineEvent={setIsOnlineEvent} 
        updateLocationFields={updateLocationFields} 
        countries={countries} 
        participationFeeTypes={participationFeeTypes} 
        filters={filters} 
        typesDropdownRef={typesDropdownRef} 
        categoriesDropdownRef={categoriesDropdownRef} 
        showTypesDropdown={showTypesDropdown} 
        showCategoriesDropdown={showCategoriesDropdown} 
        setShowTypesDropdown={setShowTypesDropdown} 
        setShowCategoriesDropdown={setShowCategoriesDropdown} 
        handleMultiSelectChange={handleMultiSelectChange} 
        removeSelectedItem={removeSelectedItem} 
        prevStep={handlePrevStep} 
        isSubmitting={isSubmitting} 
        handleSubmit={handleSubmit} 
        isEditMode={isEditMode} 
      />}
{errorMessage && (
  <div className="mt-6 mb-6 p-4 bg-red-100 border border-red-400 text-red-700 text-center font-medium rounded-md shadow-sm max-w-lg mx-auto">
    {errorMessage}
  </div>
)}
{successMessage && (
  <div className="mt-6 mb-6 p-4 bg-green-100 border border-green-400 text-green-700 text-center font-medium rounded-md shadow-sm max-w-lg mx-auto">
    {successMessage}
  </div>
)}
      </div>
  </div>
);

};

export default EventForm;
