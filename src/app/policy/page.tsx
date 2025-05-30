"use client";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import RegPolicy from "../components/policy/RegPolicy";
import Chat from "../components/chat/Chat";

export default function Profile() {
    return (
        <div className="bg-white">
          <Navbar />
          <Chat/>
          <RegPolicy/>
          <Footer/>
        </div>
      );
}