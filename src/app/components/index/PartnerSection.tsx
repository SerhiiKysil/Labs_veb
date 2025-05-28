"use client";
import React from 'react';
import Image from 'next/image';
import '../../globals.css';

const PartnersSection: React.FC = () => {
  return (
    <section className="text-dark-blue py-20" style={{ backgroundColor: '#f0f6fc' }}>
      <div className="container mx-auto flex flex-col md:flex-row items-center md:items-start gap-8" style={{ maxWidth: '1200px', width: '85%' }}>

        {/* Left section: smaller images in chaotic order */}
        <div className="relative flex-wrap hidden md:flex gap-4 md:w-[60%] justify-center">
          {/* First image */}
          <div className="relative w-[150px] h-[150px] md:w-[200px] md:h-[200px]">
            <Image
              src="/images/img_1.webp"
              alt="Молодіжний обмін у Туреччині"
              fill
              className="rounded-lg shadow-lg object-cover"
              priority
            />
          </div>

          {/* Second image */}
          <div className="relative w-[120px] h-[120px] md:mt-10 md:ml-[-30px]" style={{marginTop:'36%'}}>
            <Image
              src="/images/img_2.webp"
              alt="Онлайн стажування з маркетингу"
              fill
              className="rounded-lg shadow-lg object-cover"
              priority
            />
          </div>

          {/* Third image */}
          <div className="relative w-[140px] h-[140px] md:ml-[-20px] md:mt-6">
            <Image
              src="/images/img_3.webp"
              alt="Лекція про емоційний інтелект у Львові"
              fill
              className="rounded-lg shadow-lg object-cover"
              priority
            />
          </div>
        </div>

        {/* Right section: text */}
        <div className="w-full md:w-[40%] text-left md:text-left">
          <h2 className="mt-10 md:mt-20 text-2xl font-bold" style={{ fontFamily: 'Montserrat Alternates, sans-serif' }}>
            Партнерам
          </h2>
          <p className="mt-4 text-gray-600 text-lg">Думайте не про те, як залучити</p>
          <p className="text-gray-600 text-lg">більше учасників, а про те, куди</p>
          <p className="text-gray-600 text-lg">помістити всіх мотивчиків, що</p>
          <p className="text-gray-600 text-lg">прийдуть до вас : )</p>
          <a href="/partners" target="_blank" rel="noopener noreferrer">
            <button className="mt-10 bg-dark-blue text-white rounded-full px-5 py-3 hover:bg-white hover:text-dark-blue transition">
              Опублікувати подію
            </button>
          </a>
          <p className="mt-4 text-gray-600 text-sm">
            Як отримати <span className="font-bold">два місяці</span>
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-bold">безкоштовних публікацій</span>, читай <a href="#" className="text-gray-600 underline">тут</a>
          </p>
        </div>

      </div>
    </section>
  );
};

export default PartnersSection;
