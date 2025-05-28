"use client";
import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl">
        <img
          src="/images/load.gif"
          alt="Loading..."
          className="w-96 h-96"
        />
        {/* <span className="mt-4 text-gray-600 text-lg font-semibold">
          Мотив* шукає для тебе найкращу можливість
        </span> */}
      </div>
    </div>
  );
};

export default Loading;
