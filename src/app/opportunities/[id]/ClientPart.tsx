"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/app/components/layout/Navbar";
import { Share2, Clipboard, X, Edit, Bookmark } from 'lucide-react';
import { Heart, HeartCrack, Sparkles, Star, Trophy } from 'lucide-react';
import { useUser } from "../../context/UserContext";
import { debounce } from 'lodash';
import Link from 'next/link';
import OpportunityCard from "@/app/components/opportunities/OpportunityCard";

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
  privateOpp?: boolean;
}
interface SavedEvent {
  eventId: number | string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}
const createGoogleCalendarUrl = (event: Opportunity) => {
  const startDate: Date = new Date(event.startDateTime);
  const endDate: Date = new Date(event.endDateTime);
  
  // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.projectName,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    details: event.projectDescription.replace(/<[^>]*>/g, ''), // Strip HTML tags
    location: event.country === "online" ? "Online" : `${event.adress}, ${event.city}, ${event.country}`,
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};
const RegistrationButton = ({ opportunity }: { opportunity: Opportunity }) => {
  // State to track hover status (needed for mobile interaction)
  const [isHovered, setIsHovered] = useState(false);
  // State for the shine effect position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // State for the pulsing effect
  const [isPulsing, setIsPulsing] = useState(false);

  // Format the date for Ukrainian locale
  const formattedDate = new Date(opportunity?.registrationDeadline || new Date()).toLocaleString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Update mouse position for the shine effect
  const handleMouseMove = (e: { 
    currentTarget: { getBoundingClientRect: () => DOMRect }; 
    clientX: number; 
    clientY: number; 
  }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  

  // Create a subtle pulse effect that runs periodically
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1500);
    }, 5000);
    
    return () => clearInterval(pulseInterval);
  }, []);

  return (
    <div className="w-full">
      <a
        href={opportunity?.registrationLink || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          block w-full text-center bg-gradient-to-r from-blue-900 to-indigo-800
          text-white py-4 px-6 rounded-full font-semibold shadow-lg
          transform transition-all duration-500 ease-in-out
          ${isHovered ? "scale-105 shadow-xl" : ""}
          ${isPulsing ? "shadow-blue-400" : ""}
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
          overflow-hidden relative
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Animated background gradient */}
        <div 
          className={`
            absolute inset-0 bg-gradient-to-r from-indigo-700 via-blue-600 to-blue-800
            transition-all duration-500 ease-in-out
            ${isHovered ? "opacity-100" : "opacity-0"}
          `}
          style={{
            backgroundSize: isHovered ? "200% 200%" : "100% 100%",
            animation: isHovered ? "gradientShift 3s ease infinite" : "none"
          }}
        />
        
        {/* Shine effect - moving highlight */}
        <div 
          className={`
            absolute top-0 left-0 w-full h-full
            transition-opacity duration-500 ease-in-out
            ${isHovered ? "opacity-50" : "opacity-0"}
          `}
          style={{
            background: `radial-gradient(circle 80px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.8), transparent)`,
            pointerEvents: "none"
          }}
        />
        
        {/* Particles/sparkles effect (simulated with pseudo-elements and animation) */}
        <div className={`
          absolute inset-0 overflow-hidden
          ${isHovered ? "opacity-100" : "opacity-0"}
          transition-opacity duration-500
        `}>
          <div className="absolute h-1 w-1 bg-white rounded-full top-1/4 left-1/4 animate-ping" style={{animationDuration: "1.5s"}} />
          <div className="absolute h-1 w-1 bg-white rounded-full top-3/4 left-1/3 animate-ping" style={{animationDuration: "2s"}} />
          <div className="absolute h-1 w-1 bg-white rounded-full top-1/2 left-2/3 animate-ping" style={{animationDuration: "1.7s"}} />
          <div className="absolute h-1 w-1 bg-white rounded-full top-1/3 left-3/4 animate-ping" style={{animationDuration: "2.2s"}} />
        </div>
        
        {/* Button text with high contrast */}
        <div className="relative z-10">
          <span className={`
            text-lg tracking-wide font-bold
            transition-all duration-500 ease-in-out
            ${isHovered ? "text-white" : ""}
          `}>
            Зареєструватися
          </span>
          <br />
          <span className={`
            text-sm font-light opacity-90 block mt-1
            transition-all duration-500 ease-in-out
            ${isHovered ? "text-white" : ""}
          `}>
            до {formattedDate}
          </span>
        </div>
        
        {/* Border glow effect */}
        <div className={`
          absolute inset-0 rounded-full
          transition-all duration-500 ease-in-out
          ${isHovered ? "opacity-100 shadow-lg" : "opacity-0"}
          ${isPulsing ? "animate-pulse" : ""}
          pointer-events-none
        `}
        style={{
          boxShadow: "0 0 15px 5px rgba(59, 130, 246, 0.5)"
        }}
        />
      </a>
    </div>
  );
};

interface ClientPartProps {
    initialOpportunity: Opportunity;
    id: string;
  }
  
  export default function ClientPart({
    initialOpportunity,
    id
  }: ClientPartProps) {
    const [opportunity] = useState<Opportunity>(initialOpportunity);
    const [isSaved, setIsSaved] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [savingStatus, setSavingStatus] = useState<string | null>(null);
    const [similarOpportunities, setSimilarOpportunities] = useState<Opportunity[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

  
    const { userCurrent } = useUser();
    useEffect(() => {
      const fetchSimilarOpportunities = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v2/opportunity/${id}/similar?limit=4`,
            { cache: 'no-store' }
          );
          
          if (!res.ok) throw new Error('Failed to fetch similar opportunities');
          
          const data = await res.json();
          setSimilarOpportunities(data);
        } catch (error) {
          console.error('Error fetching similar opportunities:', error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchSimilarOpportunities();
    }, [id]);
  // Check if event is saved when component mounts
  useEffect(() => {
    if (!id || !userCurrent?.token) return;
    
// Replace the checkIfSaved function with this:
const checkIfSaved = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saved-events`, {
      headers: {
        'Authorization': `Bearer ${userCurrent.token}`,
      }
    });
    
    if (response.ok) {
      const savedEvents: SavedEvent[] = await response.json();
      const isEventSaved = savedEvents.some(event => 
        event.eventId.toString() === id.toString());
      setIsSaved(isEventSaved);
    }
  } catch {
    console.error('Error checking saved event:');
  }
};

    checkIfSaved();
  }, [id, userCurrent]);
  const debouncedSaveEvent = debounce(async () => {
    if (!userCurrent?.token) {
      setSavingStatus("Збереження...");
      setSavingStatus("Для збереження треба ввійти");
      setTimeout(() => setSavingStatus(null), 2000);
      return;
    }
    
    if (isSaving) return;
    
    setIsSaving(true);
    setSavingStatus("Збереження...");
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saved-events/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userCurrent.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.text();
        // Check if the operation was a save or unsave based on server response
        if (result.includes("Event saved successfully")) {
          setIsSaved(true);
          setSavingStatus("Збережено успішно");
        } else if (result.includes("Event unsaved successfully")) {
          setIsSaved(false);
          setSavingStatus("Видалено зі збережених");
        } else {
          // Handle other success responses
          setIsSaved(!isSaved);
          setSavingStatus(isSaved ? "Видалено зі збережених" : "Збережено успішно");
        }
        console.log(result);
      } else {
        if (response.status === 401) {
          // Handle unauthorized - might need to refresh token or redirect to login
          setSavingStatus("Потрібна авторизація");
          // Optionally attempt to refresh the token
          // refreshToken();
        } else {
          setSavingStatus("Помилка при збереженні");
        }
      }
    } catch (error) {
      console.error('Error saving event:', error);
      setSavingStatus("Помилка при збереженні");
    } finally {
      setTimeout(() => {
        setIsSaving(false);
        setSavingStatus(null);
      }, 2000);
    }
  }, 2000);

  const handleBookmarkClick = () => {
    debouncedSaveEvent();
  };

  useEffect(() => {
    if (!opportunity || !userCurrent?.token) {
      setIsOwner(false);
      return;
    }
  
    const checkOwnership = async () => {
      try {
        // Use the actual opportunity ID instead of organization ID
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v2/opportunity/${opportunity.organization.id}/ownership`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${userCurrent.token}`,
              'Content-Type': 'application/json'
            },
            // Adding cache control to ensure fresh results
            cache: 'no-cache'
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setIsOwner(data.isOwner);
          console.log('Ownership status:', data.isOwner);
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('Ownership check failed:', response.status, errorData);
          setIsOwner(false);
        }
      } catch (error) {
        console.error('Error checking ownership:', error);
        setIsOwner(false);
      }
    };
  
    checkOwnership();
  }, [opportunity, userCurrent?.token]);
  const [savedCount, setSavedCount] = useState<number | null>(null);

  useEffect(() => {
    // Function to fetch the saved count
    async function fetchSavedCount() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}/saved-count`);
        if (response.ok) {
          const count = await response.json();
          setSavedCount(count); // Set a default value for testing
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    // Only fetch if we have an eventId
    if (id) {
      fetchSavedCount();
    }
  }, [id]);
  const ShareButton = ({ opportunity }: { opportunity: Opportunity }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const url = typeof window !== "undefined" ? window.location.href : "";
  
    useEffect(() => {
      setIsMobile(/Mobi|Android|iPhone/i.test(navigator.userAgent));
    }, []);
  
    const shareWebAPI = async () => {
      if (isMobile && navigator.share) {
        try {
          await navigator.share({
            title: opportunity.projectName,
            text: "Дивись можливість на Мотив*!",
            url: url,
          });
        } catch  {
          console.error("Помилка при спробі поділитися:");
        }
      } else {
        setIsOpen(!isOpen);
      }
    };
  
    const copyLink = () => {
      navigator.clipboard.writeText(`${opportunity.projectName} - Дивись можливість на Мотив*! ${url}`);
      setMessage("Посилання скопійовано!");
      setIsOpen(false);
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    };
  
    return (
      <div className="relative">
        <button
          onClick={shareWebAPI}
          className="flex items-center gap-2 border-2 border-dark-blue text-dark-blue bg-white px-6 py-3 rounded-full font-semibold hover:transition-colors text-sm md:text-base"
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Share2 className="w-5 h-5" />
          )}
          Поділитися
        </button>
  
        {message && (
          <div className="absolute top-full left-0 mt-3 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium shadow-md animate-fade-in">
            {message}
          </div>
        )}
  
        {!isMobile && isOpen && (
          <div className="absolute top-full left-0 mt-3 w-64 bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100 z-50 animate-fade-in">
            <button
              onClick={copyLink}
              className="flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors gap-3 text-gray-700"
            >
              <Clipboard className="w-5 h-5 text-gray-500" />
              <span>Копіювати посилання</span>
            </button>
            
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(opportunity.projectName + " - Дивись можливість на Мотиві*!")}`}
              className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors gap-3 text-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z" fill="#27A6E6"/>
                <path d="M17.5 7.5l-10 4 3.5 2 2 3.5 4.5-9.5z" fill="white"/>
              </svg>
              <span>Telegram</span>
            </a>
            
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(opportunity.projectName + " - Дивись можливість на Мотив*! " + url)}`}
              className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors gap-3 text-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z" fill="#25D366"/>
                <path d="M17 14.9c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.2-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.4.1-.1.2-.3.3-.4.1-.1.1-.3 0-.4 0-.1-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5-.2 0-.3 0-.5 0s-.5.1-.7.3c-.2.3-.9 1-1 2.4s1.1 2.8 1.3 3c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4z" fill="white"/>
              </svg>
              <span>WhatsApp</span>
            </a>
            
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(opportunity.projectName + " - Дивись можливість на Мотив*!")}`}
              className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors gap-3 text-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z" fill="#1877F2"/>
                <path d="M15 8h-1.35c-.538 0-.65.221-.65.778V10h2l-.209 2H13v7h-3v-7H8v-2h2V8.192C10 6.307 10.931 5 13.029 5H15v3z" fill="white"/>
              </svg>
              <span>Facebook</span>
            </a>
          </div>
        )}
      </div>
    );
  };
  const GoogleCalendarButton = ({ opportunity }: { opportunity: Opportunity }) => {
    return (
      <a
        href={createGoogleCalendarUrl(opportunity)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 mt-4 border-2 border-dark-blue text-dark-blue bg-white px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors text-sm md:text-base"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75Z" stroke="#0B1F51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.5 2.25V5.25" stroke="#0B1F51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7.5 2.25V5.25" stroke="#0B1F51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.75 8.25H20.25" stroke="#0B1F51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.25 12.75H11.25" stroke="#0B1F51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12.75 12.75H15.75" stroke="#0B1F51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.25 16.5H11.25" stroke="#0B1F51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12.75 16.5H15.75" stroke="#0B1F51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Додати в Google Calendar
      </a>
    );
  };
  const renderContent = () => {
    if (savedCount === null) {
      return (
        <div className="flex items-center gap-2">
          <div className="animate-pulse bg-gray-200 h-5 w-32 rounded"></div>
        </div>
      );
    }
    
    if (savedCount === 0) {
      return (
        <div className="flex items-center gap-2 text-gray-500 transition-all">
          <HeartCrack size={20} className="text-gray-400" />
          <span>Ще ніхто не зберіг цю можливість</span>
        </div>
      );
    }
    
    if (savedCount === 1) {
      return (
        <div className="flex items-center gap-2">
          <Heart size={20} className="text-pink-500" />
          <span>Одна людина вже зберегла цю можливість</span>
        </div>
      );
    }
    
    if (savedCount < 5) {
      return (
        <div className="flex items-center gap-2">
          <Star size={20} className="text-amber-400" />
          <span>{`${savedCount} людини зберегли цю можливість`}</span>
        </div>
      );
    }
    
    if (savedCount < 10) {
      return (
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-purple-500" />
          <span>{`Чудовий вибір! ${savedCount} людей зберегли цю можливість`}</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2">
        <Trophy size={20} className="text-amber-500" />
        <span>{`Популярна можливість! Збережено ${savedCount} учасниками`}</span>
      </div>
    );
  };

  // Вибір фонового градієнту залежно від кількості збережень
  const getBackgroundClass = () => {
    if (savedCount === null || savedCount === 0) {
      return "bg-white";
    }
    if (savedCount < 5) {
      return "bg-gradient-to-r from-gray-50 to-gray-100";
    }
    if (savedCount < 10) {
      return "bg-gradient-to-r from-blue-50 to-purple-50";
    }
    return "bg-gradient-to-r from-amber-50 to-yellow-50";
  };
  console.log(getBackgroundClass());
  console.log(renderContent());
  const startDateTime = new Date(opportunity.startDateTime);
  const endDateTime = new Date(opportunity.endDateTime);

  const dayOfWeek = startDateTime.toLocaleDateString('uk-UA', { weekday: 'long' });
  const date = startDateTime.toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' });
  const time = startDateTime.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  const enddate = endDateTime.toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' });
  const endtime = endDateTime.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
  const categoryColors = ["red-600", "blue-600", "red-600", "yellow-600", "pink-600", "green-600"];
  const typeColors = ["purple-600", "orange-600", "blue-600", "teal-600", "indigo-600", "green-600"];
  const carouselRef = useRef(null);

  return (
    <div className="min-h-screen pb-32 md:pb-0">
      <Navbar />
      
      {/* Hero Image Section */}
      <div className="relative space-y-2 p-4 w-full max-w-[1200px] rounded-md flex flex-col items-start mx-auto">
        <h1 className="text-3xl font-bold text-dark-blue mb-2 mt-10">
            {opportunity.projectName}
        </h1>
        {isOwner && opportunity && (
          <div className="flex items-center space-x-2 mb-4">
            <a
              href={`/opportunities/create?id=${opportunity.id}`}
              className="flex items-center p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors gap-2"
            >
              <Edit className="w-5 h-5" />
              <span className="text-sm font-semibold">Редагувати подію</span>
            </a>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {opportunity.categories.map((category, index) => {
            const color = categoryColors[index % categoryColors.length];
            return (
              <span
                key={category.id}
                className={`px-2 py-1 border border-grey text-${color} rounded-full text-m sm:text-xs md:text-xs text-center`}
              >
                {category.name}
              </span>
            );
          })}
          {opportunity.types.map((type, index) => {
            const color = typeColors[index % typeColors.length];
            return (
              <span
                key={type.id}
                className={`px-2 py-1 border border-grey text-${color} rounded-full text-m sm:text-xs md:text-xs text-center`}
              >
                {type.name}
              </span>
            );
          })}
        </div>

        {/*<div className={`flex items-center px-4 py-3 rounded-lg shadow-sm ${getBackgroundClass()} transition-all`}>
                    <div className="flex items-center gap-2 font-medium">
                      {renderContent()}
                    </div>
                    
                    {savedCount !== null && savedCount > 10 && (
                      <div className="ml-2 flex">
                        {[...Array(3)].map((_, i) => (
                          <span key={i} className="text-xs animate-bounce inline-block ml-1 text-amber-400">
                          </span>
                        ))}
                      </div>
                    )}
                  </div>*/}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-0">
        <div className="bg-white rounded-3xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Event Info Cards */}
            <div>
              {/* Banner */}
              <div className="relative w-[300px] h-[300px] mb-6 flex-shrink-0">
                <img
                  src={opportunity.banner_url || "/images/default.jpg"}
                  alt={opportunity.projectName}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  onClick={handleBookmarkClick}
                  disabled={isSaving}
                  className="absolute top-4 right-4 p-2 rounded-full bg-purple/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                >
                  {isSaved ? (
                    <Bookmark className="w-10 h-10 text-black drop-shadow-md" stroke="black" fill="#AAD9BB" />
                  ) : (
                    <Bookmark className="w-10 h-10 text-black drop-shadow-md" stroke="black" fill="white" />
                  )}
                </button>
                {savingStatus && (
                  <div className="absolute top-16 right-6 mt-2 bg-black/60 text-white px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                    {savingStatus}
                  </div>
                )}
              </div>

              <div className="rounded-2xl">
                <div className="flex items-center space-x-4 mb-4">
                  <div className=" bg-white rounded-xl flex-shrink-0 w-[60px] h-[60px]">
                    <img 
                      src="/emo/calendar.png" 
                      alt="calendar" 
                      className="w-full h-full object-contain"
                      style={{backgroundColor:"#E7F3FF", padding:"8px", borderRadius:"8px"}}
                    />
                  </div>
                  <div>
                    <p className="text-[#0B1F51]">
                      {date === enddate ? (
                        <>
                          <strong>{date}</strong>, <br />
                          {dayOfWeek} о {time}-{endtime}
                        </>
                      ) : (
                        <>
                          {date} - {enddate}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl">
                <div className="flex items-center space-x-4 mb-4">
                  <div className=" bg-white rounded-xl flex-shrink-0 w-[60px] h-[60px]">
                    <img src="/emo/map.png" alt="calendar" className="w-full h-full object-contain"
                    style={{backgroundColor:"#E7F3FF", padding:"8px",borderRadius:"8px"}}/>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      {opportunity.country === "online"
                        ? opportunity.country
                        : `${opportunity.country}, ${opportunity.city}`}
                    </p>
                    {opportunity.country !== "online" && (
                      <p className="font-light text-[#0B1F51]">{opportunity.adress}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl">
                <div className="flex items-center space-x-4 mb-4">
                  <div className=" bg-white rounded-xl flex-shrink-0 w-[60px] h-[60px]">
                    <img src="/emo/money.png" alt="calendar" className="w-full h-full object-contain"
                    style={{backgroundColor:"#E7F3FF", padding:"8px",borderRadius:"8px"}}/>
                  </div>
                  <p className="font-light text-[#0B1F51]">
                    {opportunity.participationFeeType === 1 && "Безкоштовно"}
                    {opportunity.participationFeeType === 2 && `Донат від ${opportunity.participationFee}`}
                    {opportunity.participationFeeType === 3 && "Вільний донат"}
                    {opportunity.participationFeeType === 4 && `${opportunity.participationFee}`}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl">
                <a href={`/organization/${opportunity.organization.id}`} className="flex items-center space-x-4 mb-4">
                  <div className=" bg-white rounded-xl flex-shrink-0 w-[60px] h-[60px] ">
                    <img 
                      src={opportunity.organization.logoUrl} 
                      alt="Organizer Logo" 
                      className="w-full h-full object-contain"
                      style={{borderRadius:"8px"}}
                    />
                  </div>
                  <p className="font-semibold text-[#0B1F51]">{opportunity.organization.name}</p>
                </a>
              </div>

              <div className="rounded-2xl">
                <ShareButton opportunity={opportunity} />
              </div>
              <div className="rounded-2xl">
                <GoogleCalendarButton opportunity={opportunity} />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="space-y-6">
              <div
                className="text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: opportunity.projectDescription }}
              />

              {/* Registration button for desktop */}
              <div className="hidden md:block mt-8">
                <div className="w-[300px]">
                {new Date(opportunity.registrationDeadline) > new Date() && (
                <RegistrationButton opportunity={opportunity} />
                )}
                </div>
                
              </div>
              </div>
            </div>
            </div>
          </div>
          </div>

          {/* Floating registration button for mobile */}
          {new Date(opportunity.registrationDeadline) > new Date() && (
          <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
            <RegistrationButton opportunity={opportunity} />
            </div>
          </div>
          )}
      {/* Similar Opportunities */}
      <div className="py-8" style={{ maxWidth: "1200px", margin: "0 auto"}}>
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">Рекомендовано для тебе</h2>
        
        {isLoading ? (
            <div className="flex gap-5 px-4 overflow-x-auto pb-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-[400px] w-[330px] flex-none"></div>
            ))}
            </div>
          ) : similarOpportunities.length > 0 ? (
            <div className="relative">
            <div 
              ref={carouselRef}
              className="flex gap-5 px-4 overflow-x-auto pb-4 snap-x snap-mandatory" 
              style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
              }}
            >
              {similarOpportunities.map(opp => (
              <div key={opp.id} className="w-[330px] flex-none h-[400px]">
                <OpportunityCard opportunity={{...opp}} />
              </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Схожих можливостей не знайдено
          </div>
        )}
        
        <div className="text-center mt-6">
          <Link href="/catalog" className="text-blue-600 font-medium hover:underline">
            Переглянути всі можливості
          </Link>
        </div>
      </div>
    </div>
  );
}