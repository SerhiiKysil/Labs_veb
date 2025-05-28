"use client";
import React from 'react';
import '../../globals.css'; // Import global styles
import Image from 'next/image';

const MainContent: React.FC = () => {
  return (
    <section className="bg-white text-dark-blue py-12 " style={{marginLeft:'auto', marginRight:'auto', maxWidth:'1200px'}}>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8" style={{ maxWidth: '85%' }}>
        
        {/* Left section: Text block */}
        <div>
          <h1 className="text-3xl font-bold mt-10" style={{ fontFamily: 'Montserrat Alternates, sans-serif' }}>
            Усі можливості на одній платформі
          </h1>
          <p className="mt-4 text-gray-600">
            Тренінги, курси, молодіжні обміни, волонтерства і стажування від найкращих українських і міжнародних організацій
          </p>
          {/* We need to change transition color !!!*/}
          <a href="/opportunities" className="mt-6 bg-dark-blue text-white rounded-full px-5 py-3 hover:bg-blue-50 hover:text-dark-blue transition text-center inline-block">
            Переглянути
          </a>

        </div>

        {/* Right section: Image block */}
        <div className="flex justify-center">
        <Image
          src="/images/kolaj.webp"
          alt="three cards in one image"
          width={300}
          height={300}
          className="rounded-lg w-auto max-w-[300px] h-auto"
          priority
        />
        </div>

      </div>
    </section>
  );
};

export default MainContent;
