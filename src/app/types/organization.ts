// types/organization.ts

export interface CrewMember {
    id: number;
    name: string | null;
    email: string | null;
    telegram: string | null;
    role: string | null;
    verified: boolean;
    createdAt: string | null;
    organizations: Organization[] | null;
  }
  
  export interface Type {
    id: number;
    name: string;
  }
  
  export interface Category {
    id: number;
    name: string;
  }
  
  export interface Event {
    id: number;
    contactEmail: string;
    projectName: string;
    projectDescription: string;
    startDateTime: string;
    endDateTime: string;
    slug: string;
    country: string;
    region: string;
    city: string;
    adress: string;
    projectLanguage: string;
    bannerUrl: string;
    participationFeeType: number;
    participationFee: number;
    views: number | null;
    registrationLink: string;
    registrationDeadline: string;
    infoPack: string;
    timestamp: string;
    types: Type[];
    categories: Category[];
    organization: Organization;
    privateOpp:boolean
    active: boolean;
  }
  
  export interface Organization {
    id: number;
    name: string;
    description: string;
    logoUrl: string;
    bannerUrl: string;
    activeEventsCount: number;
    websiteUrl: string;
    contactEmail: string;
    slug: string;
    crew: CrewMember[];
    verified: boolean;
    events: Event[];
  }
  
  export interface Opportunity {
    id: string;
    contactEmail: string;
    projectName: string;
    types: Type[];
    categories: Category[];
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
    privateOpp: boolean;
    isSaved?: boolean;
  }