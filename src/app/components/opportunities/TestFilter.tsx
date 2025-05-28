import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Filter, X, Check, Calendar,Globe  } from "lucide-react";
import { useMemo } from "react";
import { Search, MapPin } from 'lucide-react';
import OpportunityCard from "./OpportunityCard";
import Image from "next/image";
import { useUser } from "../../context/UserContext";

interface Opportunity {
  id: string;
  contactEmail: string;
  projectName: string;
  types: Array<{ id: number; name: string }>;
  categories: Array<{ id: number; name: string }>;
  organization: {
    id: number;
    name: string;
    description: string;
    logoUrl: string;
    bannerUrl: string;
    activeEventsCount: number;
    websiteUrl: string;
    contactEmail: string;
    slug: string;
    verified: boolean;
  };
  projectDescription: string;
  startDateTime: string;
  endDateTime: string;
  slug: string;
  country: string;
  region: string;
  city: string;
  adress: string;
  projectLanguage: string;
  banner_url: string;
  participationFeeType: number;
  participationFee: number;
  views: number | null;
  registrationLink: string;
  registrationDeadline: string;
  infoPack: string;
  timestamp: string;
  isSaved?: boolean;
}

interface SavedEvent {
  id: number;
  eventId: string;
  userId: number;
}

interface FiltersProps {
  filters: {
    types: string[];
    categories: string[];
    startDate: string[];
    locations: string[];
    languages: string[];
  };
  activeFilters: {
    types: string[];
    categories: string[];
    startDate: Date[];
    locations: string[];
    languages: string[];
  };
  onFilterUpdate: (filters: {
    types: string[];
    categories: string[];
    startDate: Date[];
    locations: string[];
    languages: string[];
  }) => void;
  opportunities: Opportunity[];
  userCurrent?: { token: string; id: number };
}

const sortingOptions = [
  "Нові",
  "Популярні",
  "Найближчі",
  "Збережені",
];

const TestFilter: React.FC<FiltersProps> = ({ 
  filters, 
  activeFilters, 
  onFilterUpdate,
  opportunities
}) => {

  const [allLocations, setAllLocations] = useState<Record<string, string[]>>({});
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Нові");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [showMoreTypes, setShowMoreTypes] = useState(false);
  const sortedTypes = [...filters.types].sort((a, b) => a.localeCompare(b, "uk"));

  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const sortedCategories = [...filters.categories].sort((a, b) => a.localeCompare(b, "uk"));

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [touchStartY, setTouchStartY] = useState(0);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  
  const mobileFiltersRef = useRef<HTMLDivElement>(null);
  const { userCurrent } = useUser();

  // Fetch saved events when sorting option changes to "Збережені"
  useEffect(() => {
    if (selectedSort === "Збережені" && userCurrent?.token) {
      fetchSavedEvents();
    }
  }, [selectedSort, userCurrent]);

  // Function to fetch saved events
  const fetchSavedEvents = async () => {
    if (!userCurrent?.token) return;
    
    setIsLoadingSaved(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saved-events`, {
        headers: {
          'Authorization': `Bearer ${userCurrent.token}`,
        }
      });
      
      if (response.ok) {
        const savedEvents: SavedEvent[] = await response.json();
        const savedIds = savedEvents.map(event => event.eventId.toString());
        setSavedEventIds(savedIds);
        
        // Update isSaved property for all opportunities
        opportunities.forEach(opportunity => {
          opportunity.isSaved = savedIds.includes(opportunity.id.toString());
        });
      }
    } catch (error) {
      console.error('Error fetching saved events:', error);
    } finally {
      setIsLoadingSaved(false);
    }
  };
  const filteredOpportunities = useMemo(() => {
    // First apply all filters
    let filtered = opportunities;
    
    // Apply search filter if search term exists
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(opp => 
        // Search by project name (opportunity title)
        opp.projectName?.toLowerCase().includes(searchLower) ||
        // Search by organization name
        opp.organization?.name?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply type filters
    if (activeFilters.types.length > 0) {
      filtered = filtered.filter(opp => 
        opp.types.some(type => activeFilters.types.includes(type.name))
      );
    }
    
    // Apply category filters
    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter(opp => 
        opp.categories.some(category => activeFilters.categories.includes(category.name))
      );
    }
    
    // Apply location filters
    if (activeFilters.locations.length > 0) {
      filtered = filtered.filter(opp => {
        return activeFilters.locations.some(location => {
          if (location.includes('|')) {
            // Handle city|country format
            const [city, country] = location.split('|');
            return opp.country === country && opp.city === city;
          } else {
            // Handle country only format
            return opp.country === location;
          }
        });
      });
    }
    
    // Apply date filters
    if (activeFilters.startDate.length > 0) {
      filtered = filtered.filter(opp => {
        const eventDate = new Date(opp.startDateTime);
        return activeFilters.startDate.some(date => 
          date.getFullYear() === eventDate.getFullYear() &&
          date.getMonth() === eventDate.getMonth() &&
          date.getDate() === eventDate.getDate()
        );
      });
    }
    
    return filtered;
  }, [opportunities, searchTerm, activeFilters]);
  // Sort opportunities based on the selected sort option
  const sortOpportunities = useMemo(() => {
    switch (selectedSort) {
      case "Нові":
        return [...filteredOpportunities].sort((a, b) => {
          // Sort by id in descending order (higher id = newer)
          return parseInt(b.id) - parseInt(a.id);
        });
        case "Популярні":
          return [...filteredOpportunities].sort((a, b) => {
            const aDaysFromCreation = calculateDaysFromTimestamp(a.timestamp);
            const bDaysFromCreation = calculateDaysFromTimestamp(b.timestamp);
            const aViews = (a.views || 1);
            const bViews = (b.views || 1);
            const aPopularity = aViews / Math.max(aDaysFromCreation, 1);
            const bPopularity = bViews / Math.max(bDaysFromCreation, 1);
            console.log(aPopularity, bPopularity);
            return bPopularity - aPopularity;
          });
      case "Збережені":
        return [...filteredOpportunities].filter(opp => 
          savedEventIds.includes(opp.id.toString())
        ).sort((a, b) => (b.views || 0) - (a.views || 0));
      case "Найближчі":
        return [...filteredOpportunities].sort((a, b) => {
          const dateA = new Date(a.registrationDeadline);
          const dateB = new Date(b.registrationDeadline);
          return dateA.getTime() - dateB.getTime();
        });
      default:
        return filteredOpportunities;
    }
  }, [filteredOpportunities, selectedSort, savedEventIds]);
  function calculateDaysFromTimestamp(timestamp: string): number {
    if (!timestamp) return 365; // Якщо немає timestamp, припускаємо що подія стара (1 рік)
    
    const creationDate = new Date(timestamp);
    const currentDate = new Date();
    
    // Обчислюємо різницю в мілісекундах
    const differenceMs = currentDate.getTime() - creationDate.getTime();
    
    // Конвертуємо мілісекунди в дні (1000 мс * 60 с * 60 хв * 24 год)
    const differenceDays = differenceMs / (1000 * 60 * 60 * 24);
    
    return differenceDays;
  }
  // Group locations by country
  const handleLocationSelect = (country: string, city?: string) => {
    let locationValue: string;
    
    if (city) {
      locationValue = `${city}|${country}`;  // Використовуємо роздільник для внутрішнього зберігання
    } else {
      locationValue = country;
    }
    
    toggleSelection('locations', locationValue);
    setIsLocationDropdownOpen(false);
  };
  useEffect(() => {
    const grouped: Record<string, string[]> = {};
    const citiesByCountry: Map<string, Set<string>> = new Map();
  
    opportunities.forEach((opp: Opportunity) => {
      if (!grouped[opp.country]) {
        grouped[opp.country] = [];
      }
      if (opp.country === "Україна" && opp.city) {
        if (!citiesByCountry.has(opp.country)) {
          citiesByCountry.set(opp.country, new Set());
        }
        citiesByCountry.get(opp.country)?.add(opp.city);
      }
    });
  
    const result: Record<string, string[]> = {};
  
    // Додаємо "Онлайн" на перше місце
    if (grouped["Онлайн"]) {
      result["Онлайн"] = grouped["Онлайн"];
    }
  
    // Додаємо Україну з містами
    if (citiesByCountry.has("Україна")) {
      result["Україна"] = Array.from(citiesByCountry.get("Україна") || []).sort((a, b) => 
        a.localeCompare(b, "uk")
      );
    }
  
    // Додаємо інші країни
    Object.keys(grouped)
      .filter(country => country !== "Онлайн" && country !== "Україна")
      .sort((a, b) => a.localeCompare(b, "uk"))
      .forEach(country => {
        result[country] = grouped[country];
      });
  
    setAllLocations(result);
  }, []);
  
  const groupedLocations = allLocations;

  

  const toggleSelection = (
    filterType: 'types' | 'categories' | 'locations' | 'languages',
    value: string
  ) => {
    const currentFilters = [...activeFilters[filterType]];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(item => item !== value)
      : [...currentFilters, value];
    
    onFilterUpdate({
      ...activeFilters,
      [filterType]: newFilters
    });
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    const existingDateIndex = activeFilters.startDate.findIndex(
      date => date.toDateString() === newDate.toDateString()
    );
    
    let newDates;
    if (existingDateIndex >= 0) {
      newDates = [
        ...activeFilters.startDate.slice(0, existingDateIndex),
        ...activeFilters.startDate.slice(existingDateIndex + 1)
      ];
    } else {
      newDates = [...activeFilters.startDate, newDate];
    }
    
    onFilterUpdate({
      ...activeFilters,
      startDate: newDates
    });
  };

  const changeMonth = (offset: number) => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
    setCurrentMonth(newMonth);
  };

  const renderCalendar = () => {
    const days = daysInMonth(currentMonth);
    const firstDay = (firstDayOfMonth(currentMonth) + 6) % 7;
    const today = new Date();
    const calendarDays = [];
  
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
  
    for (let day = 1; day <= days; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = Array.isArray(activeFilters.startDate) &&
      activeFilters.startDate.some(
        d => d.toDateString() === date.toDateString()
      );
    
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isHighlighted = filters.startDate.some(
        d => new Date(d).toDateString() === date.toDateString()
      );

      calendarDays.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={isPast}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isSelected
              ? 'bg-blue-300 text-white' // Selected date style
              : isToday
              ? 'bg-[#F0EBE5]'
              : isHighlighted
              ? 'bg-dark-blue text-white'
              : isPast
              ? 'text-gray-300'
              : 'hover:bg-blue-100'
          }`}
        >
          {day}
        </button>
      );
    }
  
    return calendarDays;
  };

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };


  const handleRemoveFilter = (
    filterType: 'types' | 'categories' | 'locations' | 'languages',
    value: string
  ) => {
    const newFilters = activeFilters[filterType].filter(item => item !== value);
    
    onFilterUpdate({
      ...activeFilters,
      [filterType]: newFilters
    });
  };

  const handleRemoveDate = (date: Date) => {
    const newDates = activeFilters.startDate.filter(
      d => d.toDateString() !== date.toDateString()
    );
    
    onFilterUpdate({
      ...activeFilters,
      startDate: newDates
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!mobileFiltersRef.current) return;
    
    const touchY = e.touches[0].clientY;
    const diff = touchY - touchStartY;
    
    // If swiping down with significant movement
    if (diff > 50) {
      setIsMobileFiltersOpen(false);
    }
  };

  // Handle click outside for location dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const dropdown = document.getElementById('location-dropdown');
      const trigger = document.getElementById('location-trigger');
      
      if (dropdown && !dropdown.contains(target) && trigger && !trigger.contains(target)) {
        setIsLocationDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderFilters = () => (
    <>
      <div className="mb-8 pr-6">
        <h3 className="font-bold mb-4 text-lg text-gray-800">Вид</h3>
        <div className="space-y-2 text-gray-800">
          {(showMoreTypes ? sortedTypes : sortedTypes.slice(0, 5)).map(type => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                className="hidden peer"
                checked={activeFilters.types.includes(type)}
                onChange={() => toggleSelection('types', type)}
              />
              <div className="w-5 h-5 flex-shrink-0 border-2 border-gray-400 rounded-md flex items-center justify-center peer-checked:border-blue-600 peer-checked:bg-blue-600 group-hover:scale-105 transition-transform">
                {activeFilters.types.includes(type) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414 0L7.5 13.086 4.707 10.293a1 1 0 10-1.414 1.414l3.5 3.5a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="ml-3 transition-colors duration-200 group-hover:text-blue-600">{type}</span>
            </label>
          ))}
        </div>
        {sortedTypes.length > 5 && (
          <button
            onClick={() => setShowMoreTypes(!showMoreTypes)}
            className="text-blue-800 mt-4 text-base hover:text-blue-500 transition-colors duration-200"
          >
            {showMoreTypes ? "менше" : "більше"}
          </button>
        )}
      </div>

      <div className="mb-8 border-t-2 border-gray-300 pr-6 pt-6">
        <h3 className="font-bold mb-4 text-lg text-gray-800">Календар</h3>
        <div className="w-full text-dark-blue">
          <div className="flex justify-between mb-2">
            <button onClick={() => changeMonth(-1)}>&lt;</button>
            <span>{currentMonth.toLocaleString('uk-UA', { month: 'long', year: 'numeric' })}</span>
            <button onClick={() => changeMonth(1)}>&gt;</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-sm text-gray-800">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map(day => (
              <div key={day} className="text-center font-medium">{day}</div>
            ))}
            {renderCalendar()}
          </div>
        </div>
      </div>

      <div className="mb-8 border-t-2 border-gray-300 pr-6 pt-6">
        <h3 className="font-bold mb-4 text-lg text-gray-800">Тематика</h3>
        <div className="space-y-2 text-gray-800">
          {(showMoreCategories ? sortedCategories : sortedCategories.slice(0, 5)).map(category => (
            <label key={category} className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                className="hidden peer"
                checked={activeFilters.categories.includes(category)}
                onChange={() => toggleSelection('categories', category)}
              />
              <div className="w-5 h-5 flex-shrink-0 border-2 border-gray-400 rounded-md flex items-center justify-center peer-checked:border-blue-600 peer-checked:bg-blue-600 group-hover:scale-105 transition-transform">
                {activeFilters.categories.includes(category) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414 0L7.5 13.086 4.707 10.293a1 1 0 10-1.414 1.414l3.5 3.5a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="ml-3 transition-colors duration-200 group-hover:text-blue-600">{category}</span>
            </label>
          ))}
        </div>
        {sortedCategories.length > 5 && (
          <button
            onClick={() => setShowMoreCategories(!showMoreCategories)}
            className="text-blue-800 mt-4 text-base hover:text-blue-500 transition-colors duration-200"
          >
            {showMoreCategories ? "менше" : "більше"}
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className="w-full">
      <div className="bg-dark-blue text-white p-8 relative min-h-[300px]">
        <h1 className="text-5xl font-bold mt-20 mb-6 lg:ml-28 text-xl">Найкращі можливості тут</h1>
        <div className="flex flex-col lg:flex-row gap-4 justify-start items-center lg:ml-28">
        <div className="relative w-full lg:w-[360px]">
  <Search className="absolute left-1 top-3 text-gray-600" size={30} />
  <input
    type="text"
    placeholder="Пошук"
    className="w-full h-[54px] p-3 pl-10 rounded-lg text-black"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // We don't need to do anything special here since the search is real-time
      }
    }}
  />
</div>
          <div className="relative w-full lg:w-[180px]">
            <div className="relative">
              <MapPin className="absolute left-1 top-3 text-gray-600" size={30} />
              <button
                id="location-trigger"
                className="w-full h-[54px] p-3 pl-10 rounded-lg text-left text-black bg-white flex items-center justify-between"
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              >
                <span className="truncate">
                  {activeFilters.locations.length > 0 ? 
                    activeFilters.locations.length === 1 ? 
                      activeFilters.locations[0] : 
                      `${activeFilters.locations.length} обрано` : 
                    'Локація'}
                </span>
                <ChevronDown size={18} className="text-gray-600 ml-2" />
              </button>
              
              {isLocationDropdownOpen && (
                <div 
                  id="location-dropdown"
                  className="absolute left-0 top-full mt-1 w-64 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-md z-20 text-gray-800"
                >
                {Object.entries(groupedLocations).map(([country, cities]) => (
                  <div key={country} className="border-b border-gray-100 last:border-b-0">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 font-semibold flex items-center justify-between"
                  onClick={() => handleLocationSelect(country)}
                >
                  <span className="flex items-center gap-2">
                    {country === "Онлайн" && <Globe size={16} className="text-blue-600" />}
                    {country}
                  </span>
                  {activeFilters.locations.includes(country) && (
                    <Check size={16} className="text-blue-600" />
                  )}
                </button>
                    
                    {country === "Україна" && cities.length > 0 && (
                      <div className="ml-4 border-l border-gray-200">
                        {cities.sort((a, b) => a.localeCompare(b, "uk")).map(city => (
                          <button
                            key={city}
                            className="w-full text-left px-4 py-1 hover:bg-gray-100 text-sm flex items-center justify-between"
                            onClick={() => handleLocationSelect("Україна", city)}
                          >
                            <span>{city}</span>
                            {activeFilters.locations.includes(`${city}|Україна`) && (
                              <Check size={14} className="text-blue-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="hidden lg:block absolute w-[300px] h-auto" style={{bottom:"20px", right:"36px"}}>
          <Image
            src="/images/kolaj.webp"
            alt="three cards in one image"
            width={300}
            height={300}
            className="rounded-lg w-full h-auto"
            priority
          />
        </div>
      </div>

      <div className="relative flex justify-between lg:justify-end items-center mt-10 px-8">
        <button
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-800 rounded-lg"
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          <Filter size={20} />
          <span>Фільтри</span>
        </button>

        <div className="flex items-center">
          <button
            className="border border-gray-600 bg-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-colors text-gray-800"
            onClick={() => setIsSortOpen(!isSortOpen)}
          >
            {selectedSort}
            <ChevronDown size={18} className="text-gray-600" />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-10 text-dark-blue top-full">
            {sortingOptions.map((option) => (
              <button
                key={option}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  selectedSort === option ? "font-bold text-dark-blue" : ""
                }`}
                onClick={() => {
                  setSelectedSort(option);
                  setIsSortOpen(false);
                  // If this is the "Збережені" option and you have user authentication, fetch saved events
                  if (option === "Збережені" && userCurrent?.token) {
                    fetchSavedEvents();
                  }
                }}
              >
                {option}
              </button>
            ))}
            </div>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Active Filters */}
        {(activeFilters.types.length > 0 || 
          activeFilters.categories.length > 0 || 
          activeFilters.locations.length > 0 || 
          (activeFilters.startDate && activeFilters.startDate.length > 0) 
        ) && (
          <div className="mb-6 flex flex-wrap gap-2 items-center">
            <span className="text-gray-600 font-medium">Обрані фільтри:</span>
            
            {activeFilters.types.map(type => (
              <div key={type} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
                <span>{type}</span>
                <button 
                  onClick={() => handleRemoveFilter('types', type)}
                  className="hover:bg-blue-200 rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            
            {activeFilters.categories.map(category => (
              <div key={category} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1">
                <span>{category}</span>
                <button 
                  onClick={() => handleRemoveFilter('categories', category)}
                  className="hover:bg-green-200 rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            
            {activeFilters.locations.map(location => {
          // Визначаємо відображуване ім'я
          let displayName = location;
          if (location.includes('|')) {
            const [city, country] = location.split('|');
            displayName = `${city}, ${country}`;
          }
          
          return (
            <div key={location} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-1">
              <span>{displayName}</span>
              <button 
                onClick={() => handleRemoveFilter('locations', location)}
                className="hover:bg-purple-200 rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
            
            {activeFilters.startDate && activeFilters.startDate.map(date => (
              <div key={date.toISOString()} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full flex items-center gap-1">
                <Calendar size={14} className="mr-1" />
                <span>{date.toLocaleDateString('uk-UA')}</span>
                <button 
                  onClick={() => handleRemoveDate(date)}
                  className="hover:bg-orange-200 rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            
            <button 
              onClick={() => onFilterUpdate({
                types: [],
                categories: [],
                startDate: [],
                locations: [],
                languages: []
              })}
              className="text-gray-600 hover:text-gray-800 underline text-sm"
            >
              Очистити всі
            </button>
          </div>
        )}

        <div className="flex justify-center gap-10">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 border-r-2 border-gray-300 flex-shrink-0">
            <h2 className="font-bold text-2xl mb-8 text-dark-blue">Фільтри</h2>
            {renderFilters()}
          </div>

          {/* Mobile Filters Modal */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity lg:hidden ${
              isMobileFiltersOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            <div
              ref={mobileFiltersRef}
              className={`fixed bottom-0 left-0 w-full h-[90%] bg-white rounded-t-[38px] shadow-lg transform transition-transform ${
                isMobileFiltersOpen ? "translate-y-0" : "translate-y-full"
              }`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              <div className="h-full flex flex-col">
                {/* Swipe Indicator */}
                <div className="w-16 h-1 bg-gray-300 rounded-full mx-auto mt-2"></div>
                
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-dark-blue">Фільтри</h2>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-full"
                    onClick={() => setIsMobileFiltersOpen(false)}
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">{renderFilters()}</div>
                <div className="border-t border-gray-200 p-4">
                  <button
                    className="w-full bg-dark-blue text-white py-3 px-4 rounded-lg"
                    onClick={() => setIsMobileFiltersOpen(false)}
                  >
                    Застосувати фільтри
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Opportunities Grid */}
<div className="flex justify-center h-fit">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {selectedSort === "Збережені" && isLoadingSaved ? (
      <div className="lg:col-span-3 flex justify-center items-center p-8">
        <div className="text-gray-600 text-center">
          <div className="w-12 h-12 border-4 border-dark-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-medium">Завантаження збережених подій...</p>
        </div>
      </div>
    ) : sortOpportunities.length > 0 ? (
      sortOpportunities.map((opportunity) => (
        <OpportunityCard 
          key={opportunity.id} 
          opportunity={{...opportunity, isSaved: savedEventIds.includes(opportunity.id.toString())}} 
        />
      ))
    ) : (
      <div className="flex flex-col justify-between bg-blue-50 text-dark-blue rounded-3xl p-8 relative lg:w-[500px] w-full">
        <div>
          <p className="text-gray-600 mb-4 font-bold">
            {selectedSort === "Збережені" ? "У вас ще немає збережених подій" : "Упс, такої події не знайдено"}
          </p>
          <p className="text-gray-600">
            {selectedSort === "Збережені" 
              ? "Зберігайте події, які вас цікавлять, щоб швидко знайти їх пізніше"
              : "Ти завжди можеш знайти іншу або ж"}
          </p>
        </div>

        <div className="text-left mt-4">
          {selectedSort === "Збережені" ? (
            <button 
              onClick={() => setSelectedSort("Популярні")} 
              className="bg-dark-blue text-white py-2 px-6 rounded-full font-bold hover:bg-white hover:text-dark-blue transition text-sm"
            >
              переглянути всі події
            </button>
          ) : (
            <a href="/opportunities/create" target="_blank" rel="noopener noreferrer">
              <button className="bg-dark-blue text-white py-2 px-6 rounded-full font-bold hover:bg-white hover:text-dark-blue transition text-sm">
                опублікувати власну подію
              </button>
            </a>
          )}
        </div>

        <img
          src="images/the_star.webp"  
          alt="Зірочка"
          className="rounded-lg absolute right-0 bottom-0" style={{ maxWidth: '33%' }}
        />
      </div>
    )}
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default TestFilter;