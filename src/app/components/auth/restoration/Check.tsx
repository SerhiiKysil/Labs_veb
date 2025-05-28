"use client";

import React, { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import '../../../globals.css';

const EmailVerificationContent: React.FC = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") as string;
  const [code, setCode] = useState(['', '', '', '']);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Auto focus on next input
      if (value !== '' && index < 3) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleConfirm = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 4) {
      setMessage('Будь ласка, введіть 4-значний код');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: fullCode }),
      });

      const data = await response.json();

      if (response.ok) {
        // Set secure cookies with email verification info
        Cookies.set('verified_reset_email', email, { 
          expires: 1/96, // 15 minutes (1/96 of a day)
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        // Generate a timestamp to prevent simple cookie forging
        const timestamp = new Date().getTime();
        Cookies.set('reset_timestamp', timestamp.toString(), {
          expires: 1/96,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        // Redirect to password reset page
        router.push('/restore/newpassword');
      } else {
        setMessage(data.message || 'Невірний код. Спробуйте ще раз.');
      }
    } catch {
      setMessage('Сталася помилка. Спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white text-dark-blue py-12">
      <div className="container mx-auto max-w-lg">
        <h2 className="text-2xl font-bold text-center">Перевір пошту</h2>
        <p className="text-center mb-6">Ми відправили код на <strong>{email}</strong></p>
        
        <div className="flex justify-center space-x-2 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              className="border p-2 w-12 h-12 text-center text-xl rounded-md"
              disabled={isLoading}
            />
          ))}
        </div>
        
        <button
          onClick={handleConfirm}
          className="bg-dark-blue text-white w-full py-2 mt-4 rounded-md"
          disabled={isLoading}
        >
          {isLoading ? 'Перевірка...' : 'Підтвердити'}
        </button>
        {message && <p className="text-red-500 text-center mt-4">{message}</p>}
      </div>
    </section>
  );
};

const EmailVerification: React.FC = () => {
  return (
    <React.Suspense fallback={<p>Завантаження...</p>}>
      <EmailVerificationContent />
    </React.Suspense>
  );
};

export default EmailVerification;