import React from "react";
//import axios from "axios";
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

//const SESSION_TOKEN_KEY = 'authToken';

const OpportunityCard: React.FC<{ 
  opportunity: Opportunity; 
  onUnsave?: () => void 
}> = ({ opportunity}) => {//, onUnsave }) => {
  //const { userCurrent } = useUser() || { userCurrent: null };
  //const [isSaved, setIsSaved] = useState(false);
/*  const toggleSave = async () => {
    // Check if user is authenticated
    if (!userCurrent) {
      alert("Please log in to save opportunities");
      return;
    }
    const storedToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
    try {
      if (isSaved) {
        // Unsave opportunity
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunity/${opportunity.id}/unsave`, {
          headers: {
            Authorization: storedToken,
          },
          params: {
            userId: userCurrent.id, // Add userId as a query parameter
          }
        });

        // If onUnsave prop is provided (in saved opportunities page), call it
        if (onUnsave) {
          onUnsave();
        }
      } else {
        // Save opportunity
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunity/${opportunity.id}/save`, null, {
            headers: {
              Authorization: storedToken,
            },
            params: {
              userId: userCurrent.id, // Add userId as a query parameter
            }
        });
        console.log(opportunity.id);
        console.log(userCurrent.id);
        console.log(storedToken);
      }
      
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error toggling save state:", error);
      alert("Failed to save/unsave opportunity");
    }
  };*/

  // Extract the first category and type safely
  const firstCategory = opportunity.categories[0]; 
  const firstType = opportunity.types[0];


  return (
    <a
      href={`/opportunities/${opportunity.id}`}
      className="m-4 shadow-lg bg-white relative block overflow-hidden sm:w-[280px] md:w-[320px] lg:w-[280px] xl:w-[280px] cursor-pointer hover:shadow-xl"
      style={{ borderRadius: "20px", padding: 0, overflow: "hidden",height:"inherit" }}
    >
      {/* Image and Logo */}
      <div className="" style={{ margin: 0 }}>
  <img
    src={opportunity.banner_url || "/images/default.jpg"}
    alt={opportunity.projectName}
    className="w-full h-48 sm:h-56 md:h-48 lg:h-44 object-cover"
    style={{
      objectPosition: "0 37%",
      borderTopLeftRadius: "20px",
      borderTopRightRadius: "20px",
      margin: 0,
      padding: 0,
    }}
  />
  <div className="absolute top-6 left-6 w-16 h-16 sm:w-14 sm:h-14 md:w-14 md:h-14 rounded-full border-white border-2 bg-white/30 backdrop-blur-lg overflow-hidden">
    <img
      src={opportunity.organization.logoUrl || "/images/default.jpg"}
      alt={opportunity.organization.name}
      className="w-full h-full object-cover"
    />
  </div>
  
  {opportunity.privateOpp && (
    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full flex items-center text-xs font-medium">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      Приватна можливість
    </div>
  )}
</div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl sm:text-base md:text-base font-bold text-dark-blue mb-2">
          {opportunity.projectName}
        </h3>

        {/* Tags */}
        <div className="flex space-x-2 mb-2">
          <span className="px-2 py-1 border border-[#007AB9] text-[#007AB9] rounded-full text-m sm:text-xs md:text-xs text-center">
            {firstCategory?.name}
          </span>
          <span className="px-2 py-1 border border-[#3D00B7] text-[#3D00B7] rounded-full text-m sm:text-xs md:text-xs text-center">
            {firstType?.name}
          </span>
        </div>


        {/* Location */}
        <div className="flex items-center text-m sm:text-sm md:text-sm text-gray-600 mb-2">
          <span className="mr-1">📍</span>
          <span>
            {opportunity.country === "Онлайн"
              ? "Онлайн"
              : `${opportunity.city.trim()}, ${opportunity.country}`}
          </span>
        </div>
        {/* Date */}
        <div className="flex items-center text-m sm:text-sm md:text-sm text-gray-600 mb-4">
          <span className="mr-1">📅</span>
          <span>
            {new Date(opportunity.startDateTime).toLocaleDateString("uk-UA", { day: 'numeric', month: 'long', year: 'numeric' }) ===
            new Date(opportunity.endDateTime).toLocaleDateString("uk-UA", { day: 'numeric', month: 'long', year: 'numeric' }) ? (
              <>
                {new Date(opportunity.startDateTime).toLocaleDateString("uk-UA", {
                  day: "numeric",
                  month: "long",
                })}{" "}
                {new Date(opportunity.startDateTime).getFullYear()}р.,{" "}
                {new Date(opportunity.startDateTime).toLocaleTimeString("uk-UA", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </>
            ) : (
              <>
                {new Date(opportunity.startDateTime).toLocaleDateString("uk-UA", {
                  day: "numeric",
                  month: "long",
                })}{" "}
                {new Date(opportunity.startDateTime).getFullYear()}р. -{" "}
                {new Date(opportunity.endDateTime).toLocaleDateString("uk-UA", {
                  day: "numeric",
                  month: "long",
                })}{" "}
                {new Date(opportunity.endDateTime).getFullYear()}р.
              </>
            )}
          </span>
        </div>
        
        {/* Views indicator - added in bottom right with blue color */}
        <div className="absolute bottom-2 right-8 flex justify-end">
      <div className="text-sm text-gray-600 font-medium flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        {opportunity.views || 0}
      </div>
    </div>
      </div>
    </a>
  );
};

export default OpportunityCard;