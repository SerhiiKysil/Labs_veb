"use client";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import MainInfo from "../components/profile/MainInfo";

export default function Profile() {
    return (
        <div className="bg-white">
          <Navbar />
          <MainInfo/>
          <Footer/>
        </div>
      );
}