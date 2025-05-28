// ClientPart.tsx
'use client';

import { useState } from 'react';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import LoadingOrg from '@/app/components/layout/LoadingOrg';
import OrganizationPage from '@/app/components/organization/OrganizationPage';
import { useUser } from '../../context/UserContext';
import { Organization } from '@/app/types/organization';

interface ClientPartProps {
  initialOrganization: Organization;
}

export default function ClientPart({ initialOrganization }: ClientPartProps) {
  const [organization] = useState<Organization>(initialOrganization);
  const { userCurrent } = useUser() || { userCurrent: null };
  const currentUserId = userCurrent?.id ?? null;

  
  if (!organization) {
    return (
      <>
        <Navbar />
        <LoadingOrg />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <OrganizationPage
        organization={organization}
        currentUserId={currentUserId}
      />
      <Footer />
    </>
  );
}