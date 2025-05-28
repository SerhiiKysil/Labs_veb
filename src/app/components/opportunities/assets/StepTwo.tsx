import React from "react";
import ImageUpload from "../../../utils/ImageUpload";
import LocationSection from './LocationSection';

type StepTwoProps = {
  formData: {
    startDateTime: string;
    endDateTime: string;
    banner_url: string;
    types: Array<{ id: number; name: string }>;
    categories: Array<{ id: number; name: string }>;
    participationFeeType: number;
    participationFee: number;
    country: string;
    city: string;
    region: string;
    adress: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleImageSelect: (name: string) => (file: File | null, url?: string) => void;
  handleParticipationFeeTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleStartDateTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  dateErrors: {
    startDateTime: string;
    endDateTime: string;
  };
  isOnlineEvent: boolean;
  setIsOnlineEvent: React.Dispatch<React.SetStateAction<boolean>>;
  updateLocationFields: React.Dispatch<React.SetStateAction<{
    country: string;
    city: string;
    region: string;
    adress: string;
  }>>;
  countries: string[];
  participationFeeTypes: Array<{ id: number; name: string }>;
  filters: {
    types: Array<{ id: number; name: string }>;
    categories: Array<{ id: number; name: string }>;
  };
  typesDropdownRef: React.RefObject<HTMLDivElement>;
  categoriesDropdownRef: React.RefObject<HTMLDivElement>;
  showTypesDropdown: boolean;
  showCategoriesDropdown: boolean;
  setShowTypesDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCategoriesDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  handleMultiSelectChange: (field: "types" | "categories", value: { id: number; name: string }) => void;
  removeSelectedItem: (field: "types" | "categories", value: { id: number; name: string }) => void;
  prevStep: () => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isEditMode: boolean;
};

const StepTwo: React.FC<StepTwoProps> = ({
  formData,
  handleChange,
  handleImageSelect,
  handleParticipationFeeTypeChange,
  handleStartDateTimeChange,
  dateErrors,
  isOnlineEvent,
  setIsOnlineEvent,
  updateLocationFields,
  countries,
  participationFeeTypes,
  filters,
  typesDropdownRef,
  categoriesDropdownRef,
  showTypesDropdown,
  showCategoriesDropdown,
  setShowTypesDropdown,
  setShowCategoriesDropdown,
  handleMultiSelectChange,
  removeSelectedItem,
  prevStep,
  isSubmitting,
  handleSubmit,
  isEditMode
}) => {
    console.log(handleSubmit)
    return (
<form onSubmit={handleSubmit} className="w-[90%] mx-auto px-6 flex flex-col items-center">
<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left Column */}
          <div className="md:col-span-1">
            {/* Banner Image Upload */}
            <div className="mb-8 max-w-[350px]">
              <label className="block text-[#0B1F51] font-semibold mb-2">
                Банер події
              </label>
              <ImageUpload
                name="banner_url"
                placeholder="Завантажити банер"
                onImageSelect={handleImageSelect("banner_url")}
                initialImageUrl={formData.banner_url || ""}
              />
            </div>
    
            {/* Event Types and Categories */}
            <div className="mb-8">
  {/* Type Dropdown */}
  <div className="mb-6">
    <label className="block text-[#0B1F51] font-semibold mb-2">
      Тип заходу
    </label>
    <div className="relative" ref={typesDropdownRef}>
      <div
        className="p-3 border-2 border-gray-300 text-gray-900 rounded-lg cursor-pointer flex justify-between items-center"
        onClick={() => setShowTypesDropdown(!showTypesDropdown)}
      >
        <span className="truncate">
          {formData.types.length > 0 
            ? `Обрано ${formData.types.length} ${formData.types.length === 1 ? 'тип' : 'типів'}`
            : 'Оберіть тип заходу'}
        </span>
        <span className="text-gray-500">
          {showTypesDropdown ? "▲" : "▼"}
        </span>
      </div>
      {showTypesDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {filters.types.map((type) => (
              <div
                key={type.id}
                className="p-2.5 hover:bg-gray-100 cursor-pointer text-gray-800 flex items-center"
                onClick={() => handleMultiSelectChange("types", type)}
              >
                <div className="flex items-center w-full">
                  <input
                    type="checkbox"
                    checked={formData.types.some((t) => t.id === type.id)}
                    readOnly
                    className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{type.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    {formData.types.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-2 w-fit max-w-full">
      {formData.types.map((type) => (
          <div
            key={type.id}
            className="px-3 py-1 bg-dark-blue rounded-full text-sm text-white flex items-center"
          >
            <span className="mr-1">{type.name}</span>
            <button
              type="button"
              onClick={() => removeSelectedItem("types", type)}
              className="ml-1 w-5 h-5 flex items-center justify-center hover:bg-blue-700 rounded-full transition-colors"
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Category Dropdown */}
  <div className="mb-6">
    <label className="block text-[#0B1F51] font-semibold mb-2">
      Тематика заходу
    </label>
    <div className="relative" ref={categoriesDropdownRef}>
      <div
        className="p-3 border-2 border-gray-300 text-gray-900 rounded-lg cursor-pointer flex justify-between items-center"
        onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
      >
        <span className="truncate">
          {formData.categories.length > 0 
            ? `Обрано ${formData.categories.length} ${formData.categories.length === 1 ? 'тематику' : 'тематик'}`
            : 'Оберіть тематику заходу'}
        </span>
        <span className="text-gray-500">
          {showCategoriesDropdown ? "▲" : "▼"}
        </span>
      </div>
      {showCategoriesDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {filters.categories.map((category) => (
              <div
                key={category.id}
                className="p-2.5 hover:bg-gray-100 cursor-pointer text-gray-800 flex items-center"
                onClick={() => handleMultiSelectChange("categories", category)}
              >
                <div className="flex items-center w-full">
                  <input
                    type="checkbox"
                    checked={formData.categories.some((c) => c.id === category.id)}
                    readOnly
                    className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{category.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    {formData.categories.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-2 w-fit max-w-full">
      {formData.categories.map((category) => (
          <div
            key={category.id}
            className="px-3 py-1 bg-dark-blue rounded-full text-sm text-white flex items-center"
          >
            <span className="mr-1">{category.name}</span>
            <button
              type="button"
              onClick={() => removeSelectedItem("categories", category)}
              className="ml-1 w-5 h-5 flex items-center justify-center hover:bg-blue-700 rounded-full transition-colors"
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
          </div>
    
          {/* Right Column */}
          <div className="md:col-span-2">
            {/* Date and Time Section */}
            <div className="bg-white rounded-2xl p-4 mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-[#E7F3FF] rounded-xl w-[60px] h-[60px] p-2">
                  <img src="/emo/calendar.png" alt="calendar" className="w-full h-full object-contain" />
                </div>
                <div className="space-y-4 w-full md:flex md:space-y-0 md:space-x-4">
                  <div className="w-full md:w-[200px]">
                    <label className="block text-[#0B1F51] font-semibold mb-2">початок</label>
                    <input
                      type="datetime-local"
                      name="startDateTime"
                      value={formData.startDateTime}
                      onChange={handleStartDateTimeChange}
                      required
                      className={`w-full p-3 border-2 ${dateErrors.startDateTime ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-900`}
                    />
                    {dateErrors.startDateTime && (
                      <div className="text-red-500 text-sm mt-1">{dateErrors.startDateTime}</div>
                    )}
                  </div>
    
                  <div className="w-full md:w-[200px]">
                    <label className="block text-[#0B1F51] font-semibold mb-2">кінець</label>
                    <input
                      type="datetime-local"
                      name="endDateTime"
                      value={formData.endDateTime}
                      onChange={handleChange}
                      required
                      className={`w-full p-3 border-2 ${dateErrors.endDateTime ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-900`}
                    />
                    {dateErrors.endDateTime && (
                      <div className="text-red-500 text-sm mt-1">{dateErrors.endDateTime}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
    
            {/* Location Section */}
            <LocationSection
              isOnlineEvent={isOnlineEvent}
              setIsOnlineEvent={setIsOnlineEvent}
              formData={{
                country: formData.country,
                city: formData.city,
                region: formData.region,
                adress: formData.adress
              }}
              handleChange={handleChange}
              countries={countries}
              setFormData={updateLocationFields}
            />
    
            {/* Participation Fee Section */}
            <div className="bg-white rounded-2xl p-4 mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-[#E7F3FF] rounded-xl w-[60px] h-[60px] p-2">
                  <img
                    src="/emo/money.png"
                    alt="fee"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="w-full">
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
                    <div className="w-full md:w-[200px]">
                      <label className="block text-[#0B1F51] font-semibold mb-2">
                        тип участі
                      </label>
                      <select
                        value={formData.participationFeeType}
                        onChange={handleParticipationFeeTypeChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900"
                      >
                        {participationFeeTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
    
                    {formData.participationFeeType !== 1 &&
                      formData.participationFeeType !== 3 && (
                        <div className="w-full md:w-[200px]">
                          <label className="block text-[#0B1F51] font-semibold mb-2">
                            сума внеску
                          </label>
                          <input
                            type="number"
                            name="participationFee"
                            value={formData.participationFee || 0}
                            onChange={handleChange}
                            min="0"
                            className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900"
                          />
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            className="py-3 px-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all mr-1"
          >
            Назад
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-3 px-8 bg-[#0B1F51] hover:bg-blue-900 text-white font-semibold rounded-lg transition-all disabled:opacity-50 ml-1"
          >
            {isSubmitting
              ? "Збереження..."
              : isEditMode
              ? "Оновити подію"
              : "Створити подію"}
          </button>
          
        </div>
      </form>
    );
};

export default StepTwo;