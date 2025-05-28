import React, { useState } from 'react';
import { Globe, Mail, Plus, Edit, ChevronDown, WandSparkles, ChartNoAxesCombined, UserRoundPlus, Trash2, History } from 'lucide-react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import OpportunityCard from '../opportunities/OpportunityCard';
import { Organization, Event, Opportunity } from '@/app/types/organization';

interface OrganizationPageProps {
  organization: Organization;
  currentUserId: number | null;
  savedOpportunities?: string[];
}

const OrganizationPage: React.FC<OrganizationPageProps> = ({ 
  organization, 
  currentUserId, 
  savedOpportunities = [] 
}) => {
  const router = useRouter();
  const [events] = useState(organization.events);
  const [savedEvents] = useState(savedOpportunities);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [isLoadingPastEvents, setIsLoadingPastEvents] = useState(false);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isCrewMember = organization.crew.some((crewMember) => crewMember.id === currentUserId);
  const [expanded, setExpanded] = useState(false);
  const maxLength = 300; // Adjust as needed

  const isLong = organization.description.length > maxLength;
  const handleCreateEvent = () => {
    Cookies.set('organizationId', organization.id.toString(), { expires: 7 });
    router.push('/opportunities/create');
  };

  const handleEditOrganization = () => {
    Cookies.set('organizationId', organization.id.toString(), { expires: 7 });
    router.push('/organization/update');
  };
  const handleAddTeammate = () => {
    router.push('/organization/team');
  };

  const activeEvents = events.filter((event) => event.active);

  const handleLoadPastEvents = async () => {
    if (!showPastEvents) {
      setIsLoadingPastEvents(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organizations/${organization.id}/past-events`);
        if (response.ok) {
          const pastEventsData = await response.json();
          setPastEvents([...pastEventsData].reverse());
        }
      } catch (error) {
        console.error('Error loading past events:', error);
      } finally {
        setIsLoadingPastEvents(false);
      }
    }
    setShowPastEvents(!showPastEvents);
  };

  const mapEventToOpportunity = (event: Event): Opportunity => ({
    id: event.id.toString(),
    contactEmail: organization.contactEmail,
    projectName: event.projectName,
    types: event.types,
    categories: event.categories,
    organization: {
      id: organization.id,
      name: organization.name,
      description: organization.description,
      logoUrl: organization.logoUrl,
      bannerUrl: organization.bannerUrl,
      activeEventsCount: organization.activeEventsCount,
      websiteUrl: organization.websiteUrl,
      contactEmail: organization.contactEmail,
      slug: organization.slug,
      verified: organization.verified
    },
    projectDescription: event.projectDescription,
    startDateTime: event.startDateTime,
    endDateTime: event.endDateTime,
    slug: event.projectName.toLowerCase().replace(/\s+/g, '-') + '-' + event.id,
    country: event.country,
    region: event.region,
    city: event.city,
    views: event.views,
    adress: event.adress,
    projectLanguage: 'uk',
    banner_url: event.bannerUrl,
    participationFeeType: 0,
    participationFee: 0,
    registrationLink: '',
    registrationDeadline: event.endDateTime,
    infoPack: '',
    privateOpp: event.privateOpp,
    timestamp: new Date().toISOString()
  });

  return (
    <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
      {/* Banner and logo for small screens */}
      <div className="relative w-full h-48 mb-16 md:hidden">
        <img 
          src={organization.bannerUrl || "/images/default.jpg"} 
          alt={`${organization.name} banner`} 
          className="w-full h-full object-cover rounded-lg" 
        />
        <div className="absolute -bottom-12 left-8">
  <img 
            src={organization.logoUrl || "/images/defaultOrg.png"} 
            alt={`${organization.name} logo`} 
            className="w-24 h-24 rounded-full border-4 border-white bg-white" 
          />
        </div>
      </div>

      {/* Logo and name for large screens */}
      <div className="hidden md:flex items-center mb-16">
        <div className="relative">
          <img 
            src={organization.logoUrl} 
            alt={`${organization.name} logo`} 
            className="w-24 h-24 rounded-full border-4 border-white bg-white" 
          />
          {organization.verified && (
            <span className="absolute -bottom-12 left-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Підтверджено
            </span>
          )}
        </div>
        
        <div className="ml-6 mt-2">
          <h1 className="text-3xl font-bold text-dark-blue mb-4">{organization.name}</h1>
        </div>
      </div>

      {/* For small screens, the name and verified label are adjusted */}
      <div className="md:hidden flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold text-dark-blue mb-4">{organization.name}</h1>
        {organization.verified && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Підтверджено
          </span>
        )}
      </div>

      {/* Organization Info */}
      <div className="space-y-6">
        

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Left Column - Organization Description */}
          <div className="md:col-span-3 relative">
      <div className="relative">
        <p className="text-gray-600 text-lg mt-8">
          {expanded ? organization.description : organization.description.slice(0, maxLength) + (isLong ? "..." : "")}
        </p>

        {isLong && !expanded && (
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
        )}
      </div>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-blue-500 font-medium hover:underline relative z-10"
        >
          {expanded ? "Згорнути" : "Переглянути більше"}
        </button>
      )}
    </div>

          {/* Right Column - Contact Information */}
          <div className="md:col-span-2 bg-white rounded-lg overflow-hidden mt-8">
            
            <div className=" space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="text-gray-500 min-w-8 min-h-8" />
                <a 
                  href={organization.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline"
                >
                  {organization.websiteUrl}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="text-gray-500 min-w-8 min-h-8" />
                <a 
                  href={`mailto:${organization.contactEmail}`} 
                  className="text-blue-600 hover:underline"
                >
                  {organization.contactEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
          {isCrewMember && (
          <div className="relative inline-block">
            <div className="inline-flex rounded-md shadow-sm">
              <button 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-l-md bg-blue-600 text-white hover:bg-blue-700 transition-colors border border-blue-600"
                type="button"
              >
                <WandSparkles size={20} />
                Дії
              </button>
              <button 
                className="inline-flex items-center gap-1 px-3 py-2 rounded-r-md bg-blue-600 text-white hover:bg-blue-700 transition-colors border border-blue-600 border-l-0"
                onClick={() => setIsOpen(!isOpen)}
                type="button"
              >
                <ChevronDown 
                  size={20}
                  className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 inline-flex items-center gap-2"
                    onClick={() => {
                      handleCreateEvent();
                      setIsOpen(false);
                    }}
                    type="button"
                  >
                    <Plus size={16} className="text-blue-600" />
                    Створити подію
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 inline-flex items-center gap-2"
                    onClick={() => {
                      handleAddTeammate();
                      setIsOpen(false);
                    }}
                    type="button"
                  >
                    <UserRoundPlus size={16} className="text-purple-600" />
                    Додати в команду
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 inline-flex items-center gap-2"
                    onClick={() => {
                      handleEditOrganization();
                      setIsOpen(false);
                    }}
                    type="button"
                  >
                    <ChartNoAxesCombined size={16} className="text-yellow-600" />
                    Статистика
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 inline-flex items-center gap-2"
                    onClick={() => {
                      handleEditOrganization();
                      setIsOpen(false);
                    }}
                    type="button"
                  >
                    <Edit size={16} className="text-green-600" />
                    Редагувати
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 inline-flex items-center gap-2"
                    onClick={() => {
                      handleEditOrganization();
                      setIsOpen(false);
                    }}
                    type="button"
                  >
                    <Trash2 size={16} className="text-red-600" />
                    Видалити
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        

        

        {/* Saved Events Section */}
        {savedEvents.length > 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-dark-blue">Збережені події</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeEvents
                  .filter(event => savedEvents.includes(event.id.toString()))
                  .map((event) => (
                    <OpportunityCard 
                      key={event.id} 
                      opportunity={mapEventToOpportunity(event)} 
                    />
                  ))
                }
              </div>
            </div>
          </div>
        )}

        {/* Events Section */}
        <div className="space-y-6">
          <div className='mt-16'>
            <h2 className="text-xl font-semibold text-dark-blue">Активні події:</h2>
            {activeEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
                {[...activeEvents].reverse().map((event) => (
                  <div key={event.id} className="w-full h-full">
                    <OpportunityCard opportunity={mapEventToOpportunity(event)} />
                  </div>
                ))}

              </div>
            ) : (
              <p className="text-gray-600">Немає активних подій.</p>
            )}
          </div>

          {/* Past Events Section with load more button */}
          <div>
            <div className="flex items-center justify-between mb-4 mt-16">
              <h2 className="text-xl font-semibold text-dark-blue">Минулі події:</h2>
              <button
                onClick={handleLoadPastEvents}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                disabled={isLoadingPastEvents}
              >
                <History size={20} />
                {showPastEvents ? 'Приховати минулі події' : 'Показати минулі події'}
              </button>
            </div>
            
            {isLoadingPastEvents ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : showPastEvents && pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...pastEvents].reverse().map((event) => (
                <OpportunityCard 
                  key={event.id} 
                  opportunity={mapEventToOpportunity(event)} 
                />
              ))}

              </div>
            ) : showPastEvents ? (
              <p className="text-gray-600">Немає минулих подій.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationPage;