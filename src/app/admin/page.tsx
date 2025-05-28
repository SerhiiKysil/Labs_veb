"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Adjust for app directory usage
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useUser } from "../context/UserContext"; // Adjust the path as needed
import OrganizationControll from "../components/admin/OrganizationControll";

export default function Admin() {
    const { userCurrent } = useUser();
    const router = useRouter();

    useEffect(() => {
        // Redirect if the user is not a superadmin
        if (userCurrent?.role?.name !== "superadmin") {
            router.push("/"); // Redirect to the home page or another page
        }
    }, [userCurrent, router]);

    // If the user is not a superadmin, don't render the page content
    if (userCurrent?.role?.name !== "superadmin") {
        console.log("Access denied: User is not a superadmin.");
        return null; // or display an access denied message
    }

    return (
        <div className="bg-white">
            <Navbar />
            <OrganizationControll/>
            <Footer />
        </div>
    );
}
