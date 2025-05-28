"use client";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Loading from "../components/layout/Loading";

export default function Test() {
    return (
        <div className="bg-white">
          <Navbar />
          <Loading/>
          <Footer/>
        </div>
      );
}