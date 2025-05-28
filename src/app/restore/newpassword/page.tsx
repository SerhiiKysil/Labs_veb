"use client";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import NewPassword from "@/app/components/auth/restoration/NewPas";

export default function Restore() {
    return (
        <div className="bg-white">
          <Navbar />
          <NewPassword/>
          <Footer/>
        </div>
      );
}