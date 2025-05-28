import { Metadata } from 'next'
import ClientPart from './ClientPart'

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
  privateOpp?: boolean;
  isSaved?: boolean;
}

// Fetch opportunity data
async function getOpportunity(id: string): Promise<Opportunity> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v2/opportunity/${id}`,
    { cache: 'no-store' }
  );
  
  if (!res.ok) throw new Error('Failed to fetch opportunity');
  
  return res.json();
}

interface PageParams {
  id: string;
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<PageParams> 
}): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const opportunity = await getOpportunity(resolvedParams.id);

    // Sanitize and encode components individually
    const projectTitle = encodeURIComponent(opportunity.projectName);
    const bannerImage = opportunity.banner_url || 'https://motyv.space/images/default.jpg';
    
    // Construct and encode the complete OG image URL
    const ogImageUrl = `https://ogcdn.net/83ee17ac-3f17-4ecf-9dca-bfd8bcec577d/v3/${projectTitle}/${encodeURIComponent(bannerImage)}/%23ffffff/og.png`;

    return {
      title: `${opportunity.projectName} | Мотив`,
      description: `${opportunity.projectDescription.slice(0, 160)}... Дивись можливість на Мотив!`,
      openGraph: {
        title: `${opportunity.projectName} | Мотив`,
        description: `${opportunity.projectDescription.slice(0, 160)}... Дивись можливість на Мотив!`,
        images: [{
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: opportunity.projectName
        }]
      },
      twitter: {
        card: 'summary_large_image',
        title: `${opportunity.projectName} | Мотив`,
        description: `${opportunity.projectDescription.slice(0, 160)}... Дивись можливість на Мотив!`,
        images: [ogImageUrl]
      }
    };
  } catch {
    return {
      title: 'Opportunity | Мотив',
      description: 'View opportunity details on Мотив'
    };
  }
}

export default async function Page({ 
  params 
}: { 
  params: Promise<PageParams> // Awaiting params
}) {
  try {
    const resolvedParams = await params; // Await the params
    const idValue = resolvedParams.id; // Access the id
    const opportunity = await getOpportunity(idValue);
    
    // Trim city name before passing to client
    opportunity.city = opportunity.city.trimEnd();
    
    return <ClientPart initialOpportunity={opportunity} id={idValue} />;
  } catch {
    return <div>Error loading opportunity</div>;
  }
}