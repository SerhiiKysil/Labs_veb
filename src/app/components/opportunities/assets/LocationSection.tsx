import React, { useState, useMemo, useEffect, useRef } from 'react';
const countries = [
  "Австрія", "Албанія", "Андорра", "Бельгія", "Болгарія", "Боснія і Герцеговина", "Ватикан", 
  "Велика Британія", "Греція", "Данія", "Естонія", "Ірландія", "Ісландія", "Іспанія", "Італія",
  "Кіпр", "Латвія", "Литва", "Ліхтенштейн", "Люксембург", "Македонія", "Мальта", "Молдова", 
  "Монако", "Нідерланди", "Німеччина", "Норвегія", "Польща", "Португалія", "Румунія", "Сан-Марино",
  "Сербія", "Словаччина", "Словенія","США","Туреччина", "Угорщина", "Україна", "Фінляндія", "Франція", "Хорватія", "Чорногорія", "Чехія", "Швейцарія", "Швеція"
  ];
// Educational Centers Data
const ukrainianEducationalCenters = [
  {
    id: 1,
    name: "Львівський обласний молодіжний центр",
    address: "вул. Володимира Винниченка, 12",
    city: "Львів",
    image: "https://ugc.production.linktr.ee/okL1rqIVQwKNVE8ut053_0Qoh6TSbb98f6U8Q",
  },
  {
    id: 7,
    name: "PixLab",
    address: "вул. Городоцька, 285",
    city: "Львів",
    image: "https://cdn.cases.media/image/company/f1beabd6-066b-4467-bc55-dedfed845a42.jpg",
    coordinates: { lat: 49.8429, lng: 24.0287 }
  },
  {
    id: 8,
    name: "Музей Міста",
    address: "пл. Ринок, 1",
    city: "Львів",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHx6FXJy5HBUWpwVx1IwIl-1H8S-pPPDfquw&s",
    coordinates: { lat: 49.8395, lng: 24.0318 }
  },
  {
    id: 9,
    name: "Центр Шептицького",
    address: "вул. Стрийська, 29а",
    city: "Львів",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdjdnXYgzCTiTphjZdlAaOQDYHtNtZUR2qbA&s",
    coordinates: { lat: 49.8404, lng: 24.0291 }
  },
  {
    id: 10,
    name: "Медіатека",
    address: "вул. Мулярська, 2А",
    city: "Львів",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUneUMudk0LxSYM9tammki4ZLOrfADULnnsg&s",
    coordinates: { lat: 49.8413, lng: 24.0321 }
  },
  {
    id: 11,
    name: "LvivOpenLab",
    address: "пр. Червоної Калини, 58",
    city: "Львів",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYJjV1-Zst-sqPu8V47SVsUpZnFY_ShLcb_CBmgXp1BQWulOs9XbXiC6h059Np9OF1o_M&usqp=CAU",
    coordinates: { lat: 49.8436, lng: 24.0253 }
  },
  {
    id: 12,
    name: "МолодвіжЦентр",
    address: "вул. Скорика, 31",
    city: "Львів",
    image: "/images/mdc.jpg",
    coordinates: { lat: 49.8413, lng: 24.0321 }
  },
  {
    id: 13,
    name: "Закапелок",
    address: "вул. Верхній Вал, 62",
    city: "Київ",
    image: "/images/zakapelok.jpg",
    coordinates: { lat: 49.8413, lng: 24.0321 }
  },
  {
    id: 14,
    name: "Кабан центр",
    address: "вул. Михайлівська 24/в",
    city: "Київ",
    image: "/images/kaban.jpg",
    coordinates: { lat: 49.8413, lng: 24.0321 }
  },
  {
    id: 15,
    name: "Артцентр «Дзиґа»",
    address: "вул. Вірменська, 35",
    city: "Львів",
    image: "/images/dzyga.jpg",
    coordinates: { lat: 49.8413, lng: 24.0321 }
  },
];

interface FormDataType {
    country: string;
    city: string;
    region: string;
    adress: string;
  }
  
  interface LocationProps {
    isOnlineEvent: boolean;
    setIsOnlineEvent: (value: boolean) => void;
    formData: FormDataType;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    countries: string[];
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  }

const LocationSection: React.FC<LocationProps> = ({
  isOnlineEvent,
  setIsOnlineEvent,
  formData,
  handleChange,
  setFormData
}) => {
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);
    const [showEducationalCenters, setShowEducationalCenters] = useState(false);
    const educationalCentersRef = useRef<HTMLDivElement>(null);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [countrySearch, setCountrySearch] = useState("");
    const countryDropdownRef = useRef<HTMLDivElement>(null);
    const [centerSearch, setCenterSearch] = useState('');
    const filteredCountries = useMemo(() => {
      return countries.filter((country) =>
        country.toLowerCase().includes(countrySearch.toLowerCase())
      );
    }, [countrySearch]);
  
    const filteredEducationalCenters = useMemo(() => {
        return ukrainianEducationalCenters
          .filter(center => center.city.toLowerCase() === formData.city.toLowerCase())
          .filter(center => 
            center.name.toLowerCase().includes(centerSearch.toLowerCase()) ||
            center.address.toLowerCase().includes(centerSearch.toLowerCase())
          );
      }, [formData.city, centerSearch]);
    console.log(showCitySuggestions);
    // Add click outside handler for educational centers
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          educationalCentersRef.current && 
          !educationalCentersRef.current.contains(event.target as Node)
        ) {
          setShowEducationalCenters(false);
        }
      };

      // Add event listener
      document.addEventListener('mousedown', handleClickOutside);
      
      // Cleanup the event listener
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
          setShowCountryDropdown(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
  
    const handleCountrySelect = (country: string) => {
      setFormData((prev) => ({ ...prev, country }));
      setShowCountryDropdown(false);
      setCountrySearch("");
    };
    // Existing useEffect for country selection
    useEffect(() => {
      if (formData.country === "Україна") {
        setShowCitySuggestions(true);
      } else {
        setShowCitySuggestions(false);
      }
    }, [formData.country]);

    const popularUkrainianCities = [
      "Київ", "Львів",
    ];
    const addressInputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          // Check if the clicked element is outside the educational centers dropdown
          const isOutsideDropdown = educationalCentersRef.current && 
            !educationalCentersRef.current.contains(event.target as Node);
      
          // If dropdown is shown and click is outside, close it
          if (showEducationalCenters && isOutsideDropdown) {
            setShowEducationalCenters(false);
          }
        };
      
        // Add event listener to the document
        document.addEventListener('mousedown', handleClickOutside);
        
        // Cleanup the event listener
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [showEducationalCenters]); 
    const handleCitySelect = (city: string) => {
      setFormData((prev) => ({
          ...prev,
          city: city,
        }));
        
      setShowCitySuggestions(false);
    };

    const handleEducationalCenterSelect = (center: typeof ukrainianEducationalCenters[0]) => {
      setFormData((prev) => ({
          ...prev,
          city: center.city,
          adress: center.address + ", " + center.name,
          region: '',
        }));
        
      setShowEducationalCenters(false);
    };

    return (
      <div className="bg-white rounded-2xl p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-[#E7F3FF] rounded-xl w-[60px] h-[60px] p-2">
            <img
              src="/emo/map.png"
              alt="location"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="w-full">
            <div className="mb-4">
              <label className="flex items-center gap-2 text-[#0B1F51] font-semibold">
                <input
                  type="checkbox"
                  checked={isOnlineEvent}
                  onChange={() => setIsOnlineEvent(!isOnlineEvent)}
                />
                онлайн подія
              </label>
            </div>

            {!isOnlineEvent && (
    <div className="space-y-4 w-full">


      <div className="space-y-4 md:flex md:space-y-0 md:space-x-4">
        <div className="space-y-4">
        <div className="relative">
                <input
                  type="text"
                  value={formData.country || "Україна"}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, country: e.target.value }));
                    setCountrySearch(e.target.value);
                    setShowCountryDropdown(true);
                  }}
                  placeholder="Оберіть країну"
                  className="w-full md:w-[300px] p-3 border-2 border-gray-300 rounded-lg text-gray-900"
                  onFocus={() => setShowCountryDropdown(true)}
                />
                {showCountryDropdown && (
                  <div
                    ref={countryDropdownRef}
                    className="absolute z-10 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto mt-1"
                  >
                    <div className="p-2 border-b">
                      <input
                        type="text"
                        placeholder="Пошук країни..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full p-2 text-sm md:text-base border rounded"
                      />
                    </div>
                    <div className="overflow-y-auto">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country) => (
                          <div
                            key={country}
                            onClick={() => handleCountrySelect(country)}
                            className="p-3 hover:bg-gray-100 cursor-pointer"
                          >
                            {country}
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">Країну не знайдено</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

          <div className="relative">
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              onFocus={() =>
                formData.country === "Україна" &&
                setShowCitySuggestions(true)
              }
              required={!isOnlineEvent}
              placeholder="Місто"
              className="w-full md:w-[200px] p-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-900"
            />
          </div>
          {(!isOnlineEvent && (formData.country === "Україна" || formData.country === "")) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {popularUkrainianCities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => handleCitySelect(city)}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition"
            >
              {city}
            </button>
          ))}
        </div>
      )}
        </div>

        <div className="space-y-4">
            <div className="relative">
            <div className="flex flex-col space-y-2">
  <input
    ref={addressInputRef}
    name="adress"
    value={formData.adress}
    onChange={handleChange}
    required={!isOnlineEvent}
    placeholder="Адреса"
    onFocus={() =>
      formData.city &&
      filteredEducationalCenters.length > 0 &&
      setShowEducationalCenters(true)
    }
    className="w-full md:w-[200px] p-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-900"
  />

  <label className="flex items-center gap-2 text-sm text-gray-700">
    <input
      type="checkbox"
      checked={formData.adress === "Повідомлять відібраних учасників"}
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          adress: e.target.checked ? "Повідомлять відібраних учасників" : "",
        }))
      }
      className="rounded border-gray-300"
    />
    Повідомлять відібраним учасникам
  </label>
</div>


      {showEducationalCenters && (
        <div 
        ref={educationalCentersRef}
        className="absolute z-10 w-[calc(100vw-2rem)] sm:w-[300px] bg-white border rounded shadow-lg max-h-[60vh] md:max-h-[400px] overflow-y-auto left-1/2 transform -translate-x-1/2 sm:left-0 sm:translate-x-0 top-full mt-1"
        style={{ WebkitOverflowScrolling: 'touch' }}
        >
        <div className="sticky top-0 bg-white border-b flex justify-between items-center p-2 z-10">
          <input 
          type="text"
          placeholder="Пошук центру"
          value={centerSearch}
          onChange={(e) => setCenterSearch(e.target.value)}
          className="w-full mr-2 p-2 text-sm md:text-base"
          />
          <button 
          onClick={() => setShowEducationalCenters(false)}
          className="text-gray-500 hover:text-gray-700 p-2 flex-shrink-0"
          aria-label="Закрити"
          >
          <span className="text-xl">✕</span>
          </button>
        </div>
        <div className="overflow-y-auto">
          {filteredEducationalCenters.length > 0 ? (
          filteredEducationalCenters.map(center => (
            <div 
            key={center.id} 
            onClick={() => handleEducationalCenterSelect(center)}
            className="p-3 hover:bg-gray-100 cursor-pointer flex items-center border-b"
            >
            <img 
              src={center.image} 
              alt={center.name} 
              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded mr-2 sm:mr-3 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm sm:text-base truncate">{center.name}</div>
              <div className="text-xs sm:text-sm text-gray-600 truncate">{center.address}</div>
            </div>
            </div>
          ))
          ) : (
          <div className="p-4 text-center text-gray-500">
            Локації не знайдено
          </div>
          )}
        </div>
        </div>
      )}
            </div>
        </div>
      </div>
    </div>
  )}

          </div>
        </div>
      </div>
    );
  };

export default LocationSection;