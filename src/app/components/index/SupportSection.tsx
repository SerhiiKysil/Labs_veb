"use client";
import React from 'react';
import '../../globals.css'; // Import global styles

const SupportSection: React.FC = () => {
  return (
    <section className="bg-white py-12 text-dark-blue">
      <div className="container mx-auto"  style={{ maxWidth: '1200px', width:'85%'}}>
        
        <h2 className="text-3xl font-bold mb-8 " style={{ fontFamily: 'Montserrat Alternates, sans-serif' }}>
          Хочеш підтримати Мотив?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left section: ideas for improvement */}
          <div className="flex flex-col justify-between bg-blue-50 text-dark-blue rounded-3xl p-8 relative">
            <div>
              <p className="text-gray-600 mb-2">
                Маєш <span className="font-bold">ідеї щодо покращень?</span>
              </p>
              <p className="text-gray-600 mb-2">Розкажи, що треба додати</p>
              <p className="text-gray-600 mb-2">чи змінити</p>
            </div>

            <div className="text-left mt-4">
              <a href="https://forms.gle/r8gX32vNWoAStNcH8" target="_blank" rel="noopener noreferrer">
                <button className="border-2 border-blue-600 text-blue-600 py-2 px-6 rounded-full hover:bg-blue-600 hover:text-white transition text-sm">
                  поділитися враженнями
                </button>
              </a>
            </div>

            <img
              src="images/the_star.webp"  
              alt="Зірочка"
              className="rounded-lg absolute right-0 bottom-0" style={{ maxWidth: '39%' }}
            />
          </div>

          {/* Right section: donation option */}
          <div className="flex flex-col justify-between bg-yellow-50 text-dark-blue rounded-3xl p-8 max-w-md">
            <div>
              <p className="text-gray-600 mb-2">Якщо маєш таку можливість,</p>
              <p className="text-gray-600 mb-2">
                то можеш <span className="font-bold">підтримати</span>
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-bold">розробників</span> гривнею
              </p>
            </div>
            <div className="text-left mt-4">
              <a href="https://send.monobank.ua/jar/9N2XySzuK1" target="_blank" rel="noopener noreferrer">
                <button className="border-2 border-gray-600 text-gray-600 py-2 px-6 rounded-full hover:bg-gray-600 hover:text-white transition text-sm">
                  задонатити
                </button>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SupportSection;
