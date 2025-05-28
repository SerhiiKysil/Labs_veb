"use client";
import React, { useEffect, useState } from "react";
import Loading from "../layout/Loading";
import { useUser } from "../../context/UserContext";

type Organization = {
  id: number;
  name: string;
  description: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  contactEmail: string;
  slug: string;
  verified: boolean;
};

type ApiError = {
  message: string;
};

const OrganizationControl: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useUser();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organizations`);
      if (!response.ok) {
        throw new Error("Failed to fetch organizations");
      }
      const data = await response.json();
      setOrganizations(data);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setError(apiError.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: number) => {
    if (!token) {
      alert("You must be logged in to perform this action");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organizations/${id}/verify`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to verify organization" }));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
      
      // Refresh the organizations list
      fetchOrganizations();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      alert(apiError.message || "Failed to verify organization");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this organization?")) return;
    
    if (!token) {
      alert("You must be logged in to perform this action");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organizations/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to delete organization" }));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
      
      // Refresh the organizations list
      fetchOrganizations();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      alert(apiError.message || "Failed to delete organization");
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="p-4 text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Організації</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...organizations].reverse().map((org) => (
          <div
            key={org.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg"
          >
            <div className="relative h-48 bg-gray-100">
              {org.logoUrl ? (
                <img 
                  src={org.logoUrl} 
                  alt={org.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200">
                  <span className="text-gray-400 text-lg">Немає лого</span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <div 
                  className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-100"
                  onClick={(e) => {
                    const dropdownEl = e.currentTarget.nextElementSibling as HTMLElement;
                    if (dropdownEl) {
                      dropdownEl.style.display = dropdownEl.style.display === "block" ? "none" : "block";
                    }
                  }}
                >
                  <span className="text-gray-600">•••</span>
                </div>
                <div
                  className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                >
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleVerify(org.id)}
                  >
                    {org.verified ? 'Скасувати верифікацію' : 'Верифікувати'}
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={() => handleDelete(org.id)}
                  >
                    Видалити
                  </button>
                </div>
              </div>
              {org.verified && (
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs rounded-md">
                  Верифіковано
                </div>
              )}
            </div>

            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{org.name}</h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{org.description}</p>
              
              <div className="flex flex-col space-y-3">
                <a 
                  href={`/organization/${org.id}`} 
                  className="text-blue-600 font-medium hover:underline text-sm"
                >
                  Перейти на сторінку
                </a>
                
                {org.websiteUrl && (
                  <a
                    href={org.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Відвідати сайт
                  </a>
                )}
                
                <div className="text-sm text-gray-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${org.contactEmail}`} className="hover:underline">
                    {org.contactEmail}
                  </a>
                </div>
                
                {!org.verified && (
                  <div className="text-sm text-red-500 font-medium">
                    Не верифіковано
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {organizations.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500">Немає організацій для відображення</p>
        </div>
      )}
    </div>
  );
};

export default OrganizationControl;