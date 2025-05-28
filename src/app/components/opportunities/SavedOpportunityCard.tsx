import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";

interface SavedOpportunity {
  id: string;
  projectName: string;
  media?: string;
  organizationLogo?: string;
  organizationName: string;
  category: string;
  opportunityType: string;
  location: string;
  startDate: string | Date;
  startTime: string | Date;
  endDate: string | Date;
  slug: string;
  endTime: string | Date;
}
const SESSION_TOKEN_KEY = 'authToken';

const OpportunityCard: React.FC<{ 
  opportunity: SavedOpportunity; 
  onUnsave?: () => void 
}> = ({ opportunity, onUnsave }) => {
  const { userCurrent } = useUser() || { userCurrent: null };
  const [isSaved, setIsSaved] = useState(false);

  const toggleSave = async () => {
    // Check if user is authenticated
    if (!userCurrent) {
      alert("Please log in to save opportunities");
      return;
    }
    const storedToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
    console.log(opportunity.id);
    console.log(userCurrent.id);
    console.log(storedToken);
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
  };

  return (
    <div
      className="m-4 shadow-lg bg-white relative"
      style={{ borderRadius: "40.5px", padding: 0, width: "320px" }}
    >
      {/* Image and Logo */}
      <div className="relative" style={{ margin: 0 }}>
        <img
          src={opportunity.media || "/images/default.jpg"}
          alt={opportunity.projectName}
          className="w-full h-24 object-cover"
          style={{
            objectPosition: "0 37%",
            borderTopLeftRadius: "40.5px",
            borderTopRightRadius: "40.5px",
            margin: 0,
            padding: 0,
          }}
        />
        <img
          src={opportunity.organizationLogo || "/path-to-default-logo.png"}
          alt={opportunity.organizationName}
          className="absolute top-6 left-6 w-14 h-14 rounded-full border-white border-2"
        />

        {/* Bookmark Icon with Blur */}
        <div className="absolute" style={{ top: "24px", right: "24px" }}>
          <div className="relative">
            {/* Blurred Circle */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                width: "48px",
                height: "48px",
                background: "rgba(128, 128, 128, 0.5)", 
                filter: "blur(1px)", 
                transform: "translate(-7px, -7px)",
              }}
            ></div>

            {/* Bookmark Icon */}
            <button
              className="relative text-gray-500 hover:text-gray-700"
              onClick={toggleSave}
              disabled={!userCurrent}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill={isSaved ? "white" : "none"}
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ 
                  cursor: userCurrent ? "pointer" : "not-allowed", 
                  zIndex: 1 
                }}
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-dark-blue mb-2">
          {opportunity.projectName}
        </h3>

        {/* Tags */}
        <div className="flex space-x-2 mb-2">
          <span className="px-1 py-1 border border-blue-400 text-blue-600 rounded-full text-sm text-center">
            {opportunity.category}
          </span>
          <span className="px-1 py-1 border border-purple-400 text-purple-600 rounded-full text-sm text-center">
            {opportunity.opportunityType}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span className="mr-1">📍</span>
          <span>{opportunity.location}</span>
        </div>

        {/* Date */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <span className="mr-1">📅</span>
          <span>
            {new Date(opportunity.startDate).toLocaleDateString()} -{" "}
            {new Date(opportunity.endDate).toLocaleDateString()}
          </span>
        </div>

        {/* Link */}
        <a
          href={`/opportunities/${opportunity.slug}`}
          className="text-sm font-bold"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily: "Montserrat Alternates, sans-serif", color: "#007AB9" }}
        >
          Дивитися повністю
        </a>
      </div>
    </div>
  );
};

export default OpportunityCard;