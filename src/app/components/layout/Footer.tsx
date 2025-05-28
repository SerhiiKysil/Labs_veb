"use client";
import React from 'react';
import '../../globals.css'; // Import global styles

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-dark-blue py-8"style={{ width:'85%', marginLeft:'auto', marginRight:'auto'}}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between" style={{ maxWidth: '1200px' }}>
        
        {/* First div: Logo and description */}
        <div className="flex-1 mb-8 md:mb-0">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Montserrat Alternates, sans-serif' }}>Мотив*</h1>
          <p className="mt-4 text-gray-600 max-w-xs">
            Всі можливості для молоді на одній платформі: лекції, тренінги, міжнародні обміни, волонтерства і стажування
          </p>

          <div className="flex mt-4 space-x-4">
            <a 
              href="https://www.instagram.com/motyv.space/profilecard/?igsh=cXJzM3Vsemw0ajc=" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img 
                src="images/Instagram.avif" 
                alt="Instagram" 
                className="w-8 h-8 rounded-full" 
              />
            </a>
            <a 
              href="https://www.tiktok.com/@motyv.space?_t=8qmKefO77eI&_r=1" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img 
                src="images/tiktok.avif" 
                alt="Tiktok" 
                className="w-8 h-8 rounded-full" 
              />
            </a>
            <a 
              href="https://send.monobank.ua/jar/9N2XySzuK1" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img 
                src="images/monobank.avif" 
                alt="Monobank" 
                className="w-8 h-8 rounded-full" 
              />
            </a>
          </div>
        </div>

        <div className="flex-1 flex mb-8 md:mb-0">
          <div className="mr-16">
            <h2 className="text-lg font-bold">Молоді</h2>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li><a href="/opportunities" className="hover:text-dark-blue">Можливості</a></li>
              <li><a href="/" className="hover:text-dark-blue">Про нас</a></li>
              <li>
                <a 
                  href="https://send.monobank.ua/jar/9N2XySzuK1" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-dark-blue"
                >
                  Підтримати
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold">Партнерам</h2>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li><a href="/partners" className="hover:text-dark-blue">Правила</a></li>
              <li><a href="/policy" className="hover:text-dark-blue">Політика конфіденсійності</a></li>
              <li><a href="/advantages" className="hover:text-dark-blue">Наші переваги</a></li>
              <li>
                <a 
                  href="/auth/register" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-dark-blue"
                >
                  Реєстрація
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Third div:email form */}
        <div className="flex-1 relative">
          <h2 className="text-lg font-bold">Залишайся на зв&apos;язку</h2>
          <p className="mt-4 text-gray-600 max-w-xs">
            Щоб отримувати розсилку про найкрутіші можливості, залиш свою пошту
          </p>
          {/* Form and button */}
          <form className="mt-5 relative">
            <input
              type="email"
              placeholder="твоя пошта"
              className="border rounded-full px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-40 mt-10 min-w-[300px]"
            />
            {/*To do transition!!!*/}
            <button type="submit" className="absolute top-1 right-1 bg-dark-blue text-white rounded-full px-6 py-2 hover:bg-blue-50 hover:text-dark-blue transition mt-10">
              підписатися
            </button>
          </form>
        </div>

      </div>
      
      <div className="mt-8 text-center text-gray-400 text-sm">
        Copyright © 2025 Мотив*
      </div>
    </footer>
  );
};

export default Footer;
