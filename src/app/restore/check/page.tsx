"use client";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import EmailVerification from "@/app/components/auth/restoration/Check";

export default function Restore() {
    return (
        <div className="bg-white">
          <Navbar />
          <EmailVerification/>
          <Footer/>
        </div>
      );
}