import React, { useState } from 'react';
import axios from 'axios';

type TypeItem = { id: number; name: string };
type CategoryItem = { id: number; name: string };

/**
 * AIAutofill Component - A standalone component for AI-powered form autofilling
 * 
 * @param {Object} props
 * @param {Function} props.setFormData - Function to update the parent form's data
 * @param {Array<TypeItem>} props.predefinedTypes - Array of available event types
 * @param {Array<CategoryItem>} props.predefinedCategories - Array of available event categories
 * @param {Function} props.setIsOnlineEvent - Function to update the online event status
 * @param {String} props.apiKey - OpenAI API key (optional, can also use env variables)
 */
interface AIAutofillProps {
  setFormData: React.Dispatch<React.SetStateAction<{
    contactEmail: string;
    projectName: string;
    types: Array<TypeItem>;
    categories: Array<CategoryItem>;
    organization: {
      id: number;
      name: string;
    };
    projectDescription: string;
    startDateTime: string;
    endDateTime: string;
    country: string;
    region: string;
    city: string;
    adress: string;
    projectLanguage: string;
    banner_url: string;
    participationFeeType: number;
    participationFee: number;
    registrationLink: string;
    registrationDeadline: string;
    privateOpp: boolean;
    infoPack: string;
  }>>;
  predefinedTypes: Array<TypeItem>;
  predefinedCategories: Array<CategoryItem>;
  setIsOnlineEvent: React.Dispatch<React.SetStateAction<boolean>>;
  apiKey?: string;
}

interface AIResponse {
  projectName: string;
  projectDescription: string;
  startDateTime: string;
  endDateTime: string;
  isOnline: boolean;
  country: string;
  region: string;
  city: string;
  address: string;
  participationType: string;
  participationFee: number;
  registrationLink: string;
  registrationDeadline: string;
  types: string[];
  categories: string[];
}

const AIAutofill: React.FC<AIAutofillProps> = ({ 
  setFormData, 
  predefinedTypes, 
  predefinedCategories,
  setIsOnlineEvent,
  apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
}) => {
  // Component state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [eventName, setEventName] = useState<string>('');
  const [eventDescription, setEventDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  
  
  // Close modal and reset form
  const handleCloseModal = (): void => {
    setShowModal(false);
    setEventName('');
    setEventDescription('');
    setError('');
  };

  // Send data to OpenAI API and process the response
  const generateFormData = async (): Promise<void> => {
    // Validate inputs
    if (!eventName.trim() || !eventDescription.trim()) {
      setError('Будь ласка, заповніть назву та опис події');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      // Create prompt for OpenAI
      const prompt = `
      Вам потрібно проаналізувати назву події: "${eventName}" та її опис: "${eventDescription}"  
      і на основі цього заповнити форму івенту, використовуючи поточний рік.  
    
      **Формат відповіді** – виключно валідний JSON без будь-яких коментарів чи пояснень.  
    
      **Структура JSON:**  
      {
        "projectName": "Повна, коректна назва проєкту",
        "projectDescription": "Розширений, детальний опис проєкту на основі вхідних даних",
        "startDateTime": "Дата та час початку у форматі ISO 8601 (YYYY-MM-DDTHH:MM:SS)",
        "endDateTime": "Дата та час завершення у форматі ISO 8601 (YYYY-MM-DDTHH:MM:SS)",
        "isOnline": true/false,  // Вказати, чи подія проводиться онлайн
        "country": "Країна проведення або 'Онлайн', якщо подія віртуальна",
        "region": "Область або регіон, якщо подія офлайн",
        "city": "Місто проведення або пустий рядок для онлайн-подій",
        "address": "Точна адреса місця проведення або пустий рядок для онлайн-подій",
        "participationType": "платна" або "безкоштовна",  // Вказати, чи участь безкоштовна
        "participationFee": Число,  // Вартість участі в грн (0, якщо безкоштовно)
        "registrationLink": "Посилання на реєстрацію, якщо є",
        "privateOpp": false,  // не змінювати
        "registrationDeadline": "Кінцева дата реєстрації у форматі ISO 8601",
        "types": ["Тип1", "Тип2", "Тип3"],  // До 3 типів зі списку:
        ${JSON.stringify(predefinedTypes.map(type => type.name))},
        "categories": ["Категорія1", "Категорія2"]  // До 2 категорій зі списку:
        ${JSON.stringify(predefinedCategories.map(category => category.name))}
      }
    
      **Важливі вимоги:**  
      - Опис заходу не має бути зміненим або відформатованим.
      - Якщо подія онлайн, у полі "country" вказати "Онлайн", а "region", "city" та "address" залишити порожніми.  
      - Якщо подія платна, вказати суму в "participationFee", інакше встановити 0.  
      - Поля "types" та "categories" повинні містити відповідні значення зі списку.  
      - Не додавати жодного пояснювального тексту або коментарів у відповідь.  
    
      **Приклад валідного JSON-виходу:**  
      {
        "projectName": "Tech Conference 2025",
        "projectDescription": "Велика міжнародна конференція для IT-спеціалістів...",
        "startDateTime": "2025-09-15T10:00:00Z",
        "endDateTime": "2025-09-15T18:00:00Z",
        "isOnline": false,
        "country": "Україна",
        "region": "Київська область",
        "city": "Київ",
        "address": "вул. Хрещатик, 22",
        privateOpp: false,
        "participationType": "платна",
        "participationFee": 500,
        "registrationLink": "https://example.com/register",
        "registrationDeadline": "2025-09-10T23:59:59",
        "types": ["Конференція", "Майстер-клас"],
        "categories": ["Технології", "Освіта"]
      }
    `;
    

      // Make API request to OpenAI
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions', 
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        }, 
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('AI Response:', response.data);
      

      // Extract and parse the AI response
      const aiResponseText = response.data.choices[0].message.content.trim();
      const jsonStartIndex = aiResponseText.indexOf('{');
      const jsonEndIndex = aiResponseText.lastIndexOf('}') + 1;
      const jsonString = aiResponseText.substring(jsonStartIndex, jsonEndIndex);
      
      const aiResponse: AIResponse = JSON.parse(jsonString);
      
      // Match the AI-selected types and categories with predefined ones
      const matchedTypes = predefinedTypes
        .filter(type => aiResponse.types.includes(type.name));
      
      const matchedCategories = predefinedCategories
        .filter(category => aiResponse.categories.includes(category.name));
      
      // Update online event status
      const isEventOnline = aiResponse.isOnline || aiResponse.country === "Онлайн";
      setIsOnlineEvent(isEventOnline);

      // Create the data object to update the form
      setFormData(prev => ({
        ...prev,
        projectName: aiResponse.projectName || eventName,
        projectDescription: aiResponse.projectDescription || eventDescription,
        startDateTime: aiResponse.startDateTime || new Date().toISOString(),
        endDateTime: aiResponse.endDateTime || new Date(new Date().getTime() + 86400000).toISOString(),
        country: isEventOnline ? "Онлайн" : (aiResponse.country || "Україна"),
        region: isEventOnline ? "Онлайн" : (aiResponse.region || ""),
        city: isEventOnline ? "Онлайн" : (aiResponse.city || ""),
        adress: isEventOnline ? "" : (aiResponse.address || ""),
        participationFeeType: aiResponse.participationType === "платна" ? 2 : 1,
        participationFee: aiResponse.participationFee || 0,
        registrationLink: aiResponse.registrationLink || "",
        registrationDeadline: aiResponse.registrationDeadline || "",
        privateOpp: false,
        types: matchedTypes,
        categories: matchedCategories,
      }));

      // Close the modal on success
      handleCloseModal();
    } catch (error) {
      console.error('Error in AI autofill:', error);
      setError('Помилка при автозаповненні. Спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* AI Autofill Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center bg-[#0B1F51] text-white px-4 py-2 rounded-md hover:bg-[#0c2a6b] transition-colors"
        type="button"
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
        </svg>
        ШІ автозаповнення
      </button>

      {/* AI Autofill Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4">ШІ автозаповнення форми</h3>
            <p className="text-gray-600 mb-4">
              Введіть назву та опис події, і ШІ автоматично заповнить форму
            </p>
            
            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            {/* Event name input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Назва події
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Введіть назву події"
              />
            </div>
            
            {/* Event description textarea */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Опис події
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={5}
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Опишіть вашу подію детально..."
              ></textarea>
            </div>
            
            {/* Modal buttons */}
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100"
                onClick={handleCloseModal}
                disabled={isLoading}
                type="button"
              >
                Скасувати
              </button>
              <button
                className="px-4 py-2 bg-[#0B1F51] text-white rounded hover:bg-[#0c2a6b] flex items-center"
                onClick={generateFormData}
                disabled={isLoading}
                type="button"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Обробка...
                  </>
                ) : (
                  'Заповнити форму'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAutofill;