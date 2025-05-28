"use client";

import React, { useState, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import '../../../globals.css';

const NewPasswordContent: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();

  // Verify cookie on component mount
  useEffect(() => {
    // Read verification cookies
    const verifiedEmail = Cookies.get('verified_reset_email');
    const resetTimestamp = Cookies.get('reset_timestamp');
    
    if (!verifiedEmail || !resetTimestamp) {
      setMessage('Для зміни паролю необхідно пройти перевірку по email');
      setTimeout(() => {
        router.push('/auth/forgot-password');
      }, 3000);
      return;
    }
    
    // Check if the timestamp is within the valid timeframe (15 minutes)
    const timestampValue = parseInt(resetTimestamp);
    const currentTime = new Date().getTime();
    const fifteenMinutes = 15 * 60 * 1000;
    
    if (isNaN(timestampValue) || currentTime - timestampValue > fifteenMinutes) {
      // Expired verification
      Cookies.remove('verified_reset_email');
      Cookies.remove('reset_timestamp');
      setMessage('Час сесії закінчився. Спробуйте знову.');
      setTimeout(() => {
        router.push('/auth/forgot-password');
      }, 3000);
      return;
    }
    
    // If we get here, verification is valid
    setEmail(verifiedEmail);
    setIsVerified(true);
    setIsLoading(false);
  }, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  const handleSubmit = async () => {
    if (!isVerified) {
      setMessage('Для зміни паролю необхідно пройти перевірку по email');
      return;
    }

    if (!password) {
      setMessage('Будь ласка, введіть новий пароль.');
      return;
    }
    
    if (password.length < 8) {
      setMessage('Пароль повинен містити не менше 8 символів.');
      return;
    }
    
    if (password !== confirmPassword) {
      setMessage('Паролі не співпадають.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear the cookies after successful password reset
        Cookies.remove('verified_reset_email');
        Cookies.remove('reset_timestamp');
        
        setMessage('Пароль успішно оновлено!');
        setTimeout(() => {
          router.push('/auth');
        }, 2000);
      } else {
        setMessage(data.message || 'Сталася помилка. Спробуйте ще раз.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setMessage('Сталася помилка. Спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading/error states
  if (isLoading && !isVerified) {
    return (
      <section className="bg-white text-dark-blue py-12">
        <div className="container mx-auto max-w-lg text-center">
          <p>Перевірка статусу...</p>
        </div>
      </section>
    );
  }

  if (!isVerified) {
    return (
      <section className="bg-white text-dark-blue py-12">
        <div className="container mx-auto max-w-lg text-center">
          <p className="text-red-500">{message}</p>
          <p className="mt-4">Перенаправлення на сторінку відновлення паролю...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white text-dark-blue py-12" style={{ margin: 'auto', maxWidth: '1200px', fontFamily: 'Montserrat Alternates, sans-serif' }}>
      <div className="container mx-auto grid grid-cols-1 gap-8" style={{ maxWidth: '85%' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '-webkit-fill-available' }}>
          <h2 className="text-2xl font-bold mb-4 text-center">Новий пароль</h2>
          {email && <p className="text-center mb-6">Встановлення нового паролю для <strong>{email}</strong></p>}

          <p className="mb-1">Новий пароль</p>
          <input
            type="password"
            name="password"
            placeholder="не менше 8 символів"
            value={password}
            onChange={handleChange}
            className="border p-2 mb-4 w-full rounded-[10px]"
            disabled={isLoading}
          />

          <p className="mb-1">Підтвердити пароль</p>
          <input
            type="password"
            name="confirmPassword"
            placeholder="введи пароль ще раз"
            value={confirmPassword}
            onChange={handleChange}
            className="border p-2 mb-4 w-full rounded-[10px]"
            disabled={isLoading}
          />

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-dark-blue text-white px-4 py-2 mt-2"
              style={{ borderRadius: '32px', width: '300px', height: '56px', fontSize: '20px' }}
              disabled={isLoading}
            >
              {isLoading ? 'Встановлення...' : 'Встановити пароль'}
            </button>
          </div>

          {message && <p className={`text-center mt-4 ${message === 'Пароль успішно оновлено!' ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
        </div>
      </div>
    </section>
  );
};

const NewPassword: React.FC = () => {
  return (
    <React.Suspense fallback={<p className="text-center py-12">Завантаження...</p>}>
      <NewPasswordContent />
    </React.Suspense>
  );
};

export default NewPassword;