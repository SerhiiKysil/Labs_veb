import React from 'react';
import Image from 'next/image';

const Banner = () => {
  return (
    <div className="w-full flex justify-center bg-blue-900">
      <div className="w-full max-w-[1250px] px-4">
        <div className="bg-blue-900 relative flex items-center justify-center overflow-hidden py-[15%]">
          {/* Circle hidden on mobile */}
          <div className="absolute top-[15%] left-8 w-24 h-24 hidden md:block">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 rounded-full bg-white"></div>
              <svg className="absolute inset-0 w-full h-full -rotate-12" viewBox="0 0 100 100">
                <defs>
                  <path
                    id="circlePath"
                    d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  />
                </defs>
                <text className="fill-blue-900" style={{fontSize:'0.8322rem'}}>
                  <textPath href="#circlePath" startOffset="5%">
                    досвід • знайомства • подорожі •
                  </textPath>
                </text>
              </svg>
            </div>
          </div>

          {/* Main text with dynamic width and font size */}
          <div className="w-[85vw] max-w-[1062px]" style={{ zIndex:'1' }}>
            <h1 className="text-white font-bold uppercase text-center" style={{
              fontSize: 'clamp(1.5rem, 7vw, 6rem)',
              lineHeight: '1.1',
            }}>
              <div>Де можливості</div>
              <div>для молоді, там</div>
              <div>завжди є Мотив*</div>
            </h1>
          </div>

          {/* Optimized images using Next.js Image component */}
          <div className="absolute" style={{
            top:'27%',
            right:'22%',
            width: 'clamp(96px, 8vw, 180px)',
            height: 'clamp(96px, 8vw, 180px)'
          }}>
            <Image
              src="/images/картка_1.avif"
              alt="card 1"
              width={180}
              height={180}
              priority
              className="rounded-lg w-full h-full"
            />
          </div>

          <div className="absolute" style={{
            bottom:'27%',
            left:'20%',
            width: 'clamp(120px, 10vw, 160px)',
            height: 'clamp(120px, 10vw, 160px)'
          }}>
            <Image
              src="/images/картка_2.avif"
              alt="card 2"
              width={180}
              height={180}
              priority
              className="rounded-lg w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;