"use client";

import Navbar from "@/app/components/layout/Navbar";
import EventForm from "../../components/opportunities/CreateOpportunitie";
import Footer from "@/app/components/layout/Footer";

const CreateEventPage = () => {
    return (
  <div>
  <Navbar/>
  <EventForm />
  <Footer/>
  </div>
    );
};


export default CreateEventPage;