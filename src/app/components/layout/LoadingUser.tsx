// components/layout/Loading.tsx
"use client";
import React from 'react';
import style from '../../styles/layout/Loading.module.css';

const Loading: React.FC = () => {
  return (
    <div className={style.container}>
      <div className={style.wrapper}>
        <div className={style.spinner}></div>
        <span className={style.text}>
          Гарний профіль, до речі)
        </span>
      </div>
    </div>
  );
};

export default Loading;