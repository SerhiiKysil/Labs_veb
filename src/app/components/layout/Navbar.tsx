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

  const navigationItems = userCurrent
    ? [
        { href: "/opportunities", label: "Можливості" },
        { href: "/opportunities/create", label: "Створити подію" },
        { href: "/", label: "Про нас" },
      ]
    : [
        { href: "/opportunities", label: "Можливості" },
        { href: "/", label: "Про нас" },
        { href: "/partners", label: "Партнерам" },
      ];

  const renderUserContent = (user: typeof userCurrent) => {
    if (!user) return null;
    return typeof user.name === 'string' ? user.name : 'Your Account';
  };

  return (
    <nav className="text-dark-blue p-4">
      <div className="container mx-auto flex items-center justify-between" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Logo */}
        <Link href="/" className="nav-item nav-link text-light">
          <h1 className="text-2xl font-bold text-dark-blue" style={{ fontFamily: "Montserrat Alternates, sans-serif" }}>
            Мотив*
          </h1>
        </Link>

        {/* Desktop navigation - visible only on desktop */}
        <div className="hidden md:flex items-center justify-center flex-grow">
          <ul className="flex space-x-8 font-medium text-dark-grey" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={`hover:text-dark-grey ${pathname === item.href ? "underline" : ""}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile button and burger wrapper */}
        <div className="flex items-center space-x-4">
          {/* Auth Button - shown on both mobile and desktop */}
          <div className="block">
            {userCurrent ? (
              <Link 
                href="/profile" 
                className="border-2 border-dark-blue text-dark-blue bg-white px-4 py-2 rounded-full font-bold hover:bg-dark-blue hover:text-white transition-colors text-sm md:text-base"              >
                {renderUserContent(userCurrent)}
              </Link>
            ) : (
              <Link 
                href="/auth/register" 
                className="border-2 border-dark-blue text-dark-blue bg-white px-4 py-2 rounded-full font-bold hover:bg-dark-blue hover:text-white transition-colors text-sm md:text-base"
                              >
                Зареєструватися
              </Link>
            )}
          </div>

          {/* Hamburger menu button - mobile only */}
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
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4">
          <ul className="flex flex-col space-y-4 font-semibold text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={`hover:text-dark-grey ${pathname === item.href ? "underline" : ""}`}
                  onClick={handleLinkClick}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;