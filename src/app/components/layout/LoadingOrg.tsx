// components/layout/Loading.tsx
"use client";
import React from 'react';
import style from '../../styles/layout/Loading.module.css';

const LoadingOrg: React.FC = () => {
  return (
    <div className={style.container}>
      <div className={style.wrapper}>
        <div className={style.spinner}></div>
        <span className={style.text}>
          Мотив* завантажує класну організацію
        </span>
      </div>
    </div>
  );
};

export default LoadingOrg;