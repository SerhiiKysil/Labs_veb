//nav bar for loggined users
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "../../context/UserContext";
import "../../globals.css";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { userCurrent } = useUser();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Helper function to safely render user content
  const renderUserContent = (user: typeof userCurrent) => {
    if (!user) return null;
    return typeof user.name === 'string' ? user.name : 'Your Account';
  };

  return (
    <nav className="text-dark-blue p-4">
      <div className="container mx-auto flex justify-between items-center" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Link href="/" className="nav-item nav-link text-light" style={{ fontSize: "30px" }}>
          <h1 className="text-2xl font-bold text-dark-blue" style={{ fontFamily: "Montserrat Alternates, sans-serif" }}>
            Мотив*
          </h1>
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden md:flex space-x-6 font-medium text-dark-grey" style={{ fontFamily: "Montserrat, sans-serif" }}>
          <li>
            <Link href="/opportunities" className={pathname === "/opportunities" ? "underline" : ""}>
              Можливості
            </Link>
          </li>
          <li>
            <Link href="/opportunities/create" className={`hover:text-dark-grey ${pathname === "/" ? "underline" : ""}`}>
              Створити подію
            </Link>
          </li>
          <li>
            <Link href="/" className={`hover:text-dark-grey ${pathname === "#partners" ? "underline" : ""}`}>
              Про нас
            </Link>
          </li>
        </ul>

        {/* Hamburger menu for mobile */}
        <button
          className="md:hidden flex flex-col items-center justify-center w-8 h-8 text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          type="button"
        >
          <div className="relative w-6 h-6">
            <span
              className={`block absolute w-full h-0.5 bg-dark-blue transition-all duration-300 ease-in-out ${
                isOpen ? "transform rotate-45 top-1/2" : "top-0"
              }`}
            ></span>
            <span
              className={`block absolute w-full h-0.5 bg-dark-blue transition-all duration-300 ease-in-out ${
                isOpen ? "opacity-0" : "top-1/2"
              }`}
            ></span>
            <span
              className={`block absolute w-full h-0.5 bg-dark-blue transition-all duration-300 ease-in-out ${
                isOpen ? "transform -rotate-45 bottom-1/2" : "bottom-0"
              }`}
            ></span>
          </div>
        </button>

        {/* Desktop Auth Button */}
        {userCurrent ? (
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/profile" className="bg-dark-blue text-white px-4 py-2 rounded-full font-bold">
              {renderUserContent(userCurrent)}
            </Link>
          </div>
        ) : (
          <Link href="/auth/register" className="hidden md:block bg-dark-blue text-white px-4 py-2 rounded-full font-bold">
            Зареєструватися
          </Link>
        )}
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4">
          <ul className="flex flex-col space-y-4 font-semibold text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>
            <li>
              <Link 
                href="/opportunities" 
                className={`hover:text-dark-grey ${pathname === "/opportunities" ? "underline" : ""}`} 
                onClick={handleLinkClick}
              >
                Можливості
              </Link>
            </li>
            <li>
              <Link 
                href="/" 
                className={`hover:text-dark-grey ${pathname === "/" ? "underline" : ""}`} 
                onClick={handleLinkClick}
              >
                Про нас
              </Link>
            </li>
            <li>
              <Link 
                href="#partners" 
                className={`hover:text-dark-grey ${pathname === "#partners" ? "underline" : ""}`} 
                onClick={handleLinkClick}
              >
                Партнерам
              </Link>
            </li>
          </ul>
          {userCurrent ? (
            <div className="space-y-2">
              <Link 
                href="/profile" 
                className="w-full bg-dark-blue text-white px-4 py-2 rounded-full hover:bg-blue-700 text-center block" 
                onClick={handleLinkClick}
              >
                {renderUserContent(userCurrent)}
              </Link>
            </div>
          ) : (
            <Link 
              href="/auth/register" 
              className="w-full bg-dark-blue text-white px-4 py-2 rounded-full text-center block" 
              onClick={handleLinkClick}
            >
              Зареєструватися
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;