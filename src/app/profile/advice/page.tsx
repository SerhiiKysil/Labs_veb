"use client";

import Footer from "@/app/components/layout/Footer";
import Navbar from "@/app/components/layout/Navbar";
import UserGuideComponent from "@/app/components/profile/UserGuideComponent";


export default function Profile() {
    return (
        <div className="bg-white">
            <Navbar />
            <UserGuideComponent />
            <Footer />
        </div>
      );
}