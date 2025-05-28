"use client";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import RegPolicy from "../components/policy/RegPolicy";

export default function Profile() {
    return (
        <div className="bg-white">
          <Navbar />
          <RegPolicy/>
          <Footer/>
        </div>
      );
}