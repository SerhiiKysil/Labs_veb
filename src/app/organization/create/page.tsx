"use client";

import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import CreateForm from "@/app/components/organization/CreateOrganizationForm";



export default function Profile() {
    return (
        <div className="bg-white">
          <Navbar />
          <CreateForm/>
          <Footer/>
        </div>
      );
}