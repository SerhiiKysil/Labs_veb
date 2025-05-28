import React, { useEffect, useState } from "react";
import OpportunityCard from "./OpportunityCard";
import { useUser } from "../../context/UserContext";
import axios from "axios";

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
const SESSION_TOKEN_KEY = 'authToken';

const SavedOpportunitiesFeed: React.FC = () => {
  const { userCurrent } = useUser() || { userCurrent: null };
  const [savedOpportunities, setSavedOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedOpportunities = async () => {
      if (!userCurrent) {
        setSavedOpportunities([]);
        setLoading(false);
        return;
      }

      const storedToken = sessionStorage.getItem(SESSION_TOKEN_KEY);

      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/opportunity/saved`, 
          {
            headers: {
              Authorization: storedToken,
            },
            params: {
              userId: userCurrent.id, // Add userId as a query parameter
            }
          }
        );
        // Handle successful response
        setSavedOpportunities(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching saved opportunities:", error);
        setSavedOpportunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedOpportunities();
  }, [userCurrent]);

  const handleUnsaveOpportunity = async (opportunityId: string) => {
    if (!userCurrent) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunity/${opportunityId}/unsave`, {
        headers: {
          Authorization: `Bearer ${userCurrent.token}`,
        },
        params: {
          userId: userCurrent.id,
        }
      });
      setSavedOpportunities((prev) =>
        prev.filter((opportunity) => opportunity.id !== opportunityId)
      );
    } catch (error) {
      console.error("Error unsaving opportunity:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
      {savedOpportunities.length ? (
        savedOpportunities.map((opportunity) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            onUnsave={() => handleUnsaveOpportunity(opportunity.id)}
          />
        ))
      ) : (
        <p className="text-center text-gray-500">You have no saved opportunities.</p>
      )}
    </div>
  );
};

export default SavedOpportunitiesFeed;