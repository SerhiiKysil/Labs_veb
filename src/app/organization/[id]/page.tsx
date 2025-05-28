import { Metadata } from 'next';
import ClientPart from './ClientPart';

import { Organization } from '@/app/types/organization'
async function getOrganization(id: string): Promise<Organization> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/organizations/${id}`,
    { cache: 'no-store' }
  );
  
  if (!res.ok) throw new Error('Failed to fetch organization');
  console.log(res);
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
    const resolvedParams = await params; // Await the params
    const organization = await getOrganization(resolvedParams.id);

    const title_text = encodeURIComponent(organization.name);
    const image_url = organization.logoUrl || 'https://motyv.space/images/default.jpg';
    const ogImageUrl = `https://ogcdn.net/75522e42-1463-44ef-a8c1-26258701e3ab/v3/${title_text}/${encodeURIComponent(image_url)}/og.png`;

    return {
      title: `${organization.name} | Мотив`,
      description: `${organization.description.slice(0, 160)}... Дивись організацію на Мотив!`,
      metadataBase: new URL('https://motyv.space'),
      openGraph: {
        title: `${organization.name} | Мотив`,
        description: `${organization.description.slice(0, 160)}... Дивись організацію на Мотив!`,
        images: [{
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: organization.name
        }],
        type: 'website',
        url: `https://motyv.space/organizations/${organization.id}`,
        siteName: 'Мотив',
        locale: 'uk_UA'
      },
      twitter: {
        card: 'summary_large_image',
        title: `${organization.name} | Мотив`,
        description: `${organization.description.slice(0, 160)}... Дивись організацію на Мотив!`,
        images: [ogImageUrl]
      }
    };
  } catch (error) {
    console.error('Metadata generation error:', error);
    return {
      title: 'Organization | Мотив',
      description: 'View organization details on Мотив'
    };
  }
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  try {
    const resolvedParams = await params; // Await the params
    const organization = await getOrganization(resolvedParams.id);
    return <ClientPart initialOrganization={organization} />;
  } catch {
    return <div>Error loading organization</div>;
  }
}
