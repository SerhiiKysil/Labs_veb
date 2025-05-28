"use client";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Form from '../components/auth/login/Form';

export default function ClientPart() {
  return (
    <div className="bg-white">
      <Navbar />
      <Form />
      <Footer />
    </div>
  );
}
