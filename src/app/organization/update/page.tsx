"use client";

import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import UpdateOrganizationForm from "@/app/components/organization/UpdateOrganization";
import Cookies from 'js-cookie';

export default function UpdateOrganization() {
    const organizationId = Cookies.get('organizationId');

    return (
        <div className="bg-white">
          <Navbar />
          <UpdateOrganizationForm organizationId={organizationId ? parseInt(organizationId) : null}/>
          <Footer/>
        </div>
    );
}