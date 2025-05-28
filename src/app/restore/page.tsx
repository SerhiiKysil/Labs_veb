"use client";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PasswordRecovery from "../components/auth/restoration/Forgot";

export default function Restore() {
    return (
        <div className="bg-white">
          <Navbar />
          <PasswordRecovery/>
          <Footer/>
        </div>
      );
}