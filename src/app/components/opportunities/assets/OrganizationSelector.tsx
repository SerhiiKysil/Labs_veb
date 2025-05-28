import React, { useState, useEffect } from "react";

// Define the Organization interface 
interface Organization {
  id: number;
  name: string;
  logoUrl?: string; // Make logoUrl optional as it might not be in your current type
}

type OrganizationSelectorProps = {
  organizations: Organization[];
  value: number;
  onChange: (orgId: number) => void; // Simplified onChange handler
};

const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({
  organizations,
  value,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  
  // Set initially selected organization based on value prop
  useEffect(() => {
    const initialOrg = organizations.find(org => org.id === value) || organizations[0];
    if (initialOrg) {
      setSelectedOrg(initialOrg);
    }
  }, [organizations, value]);
  
  const handleSelect = (org: Organization) => {
    setSelectedOrg(org);
    setIsOpen(false);
    
    // Simply pass the org ID to the parent component
    onChange(org.id);
  };
  
  return (
    <div className="mb-6">
      <label className="block text-[#0B1F51] font-semibold mb-2">Організація</label>
      
      <div className="relative">
        {/* Custom selector button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 flex items-center border-2 border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {selectedOrg && (
            <>
              {selectedOrg.logoUrl && (
                <img 
                  src={selectedOrg.logoUrl} 
                  alt={`${selectedOrg.name} logo`} 
                  className="w-6 h-6 mr-3 rounded-sm"
                />
              )}
              <span>{selectedOrg.name}</span>
            </>
          )}
          
          <svg 
            className="w-4 h-4 ml-auto" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
            />
          </svg>
        </button>
        
        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            {organizations.map((org) => (
              <div
                key={org.id}
                onClick={() => handleSelect(org)}
                className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
              >
                {org.logoUrl && (
                  <img 
                    src={org.logoUrl} 
                    alt={`${org.name} logo`} 
                    className="w-6 h-6 mr-3 rounded-sm"
                  />
                )}
                <span style={{color:"black"}}>{org.name}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Hidden select for form compatibility */}
        <select
          className="hidden"
          name="organization"
          value={selectedOrg?.id || ''}
        >
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default OrganizationSelector;