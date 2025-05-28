"use client";

import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import '../../../globals.css';

const PasswordRecovery: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSendCode = async () => {
    if (!email) {
      setMessage('Будь ласка, введіть електронну пошту');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/recover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        router.push(`/restore/check?email=${encodeURIComponent(email)}`);
      } else {
        setMessage(data.message || 'Сталася помилка. Спробуйте ще раз.');
      }
    } catch (error) {
      console.error('Recovery error:', error);
      setMessage('Сталася помилка. Спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white text-dark-blue py-12">
      <div className="container mx-auto max-w-lg">
        <h2 className="text-2xl font-bold text-center">Забули пароль?</h2>
        <input
          type="email"
          placeholder="Твоя електронна пошта"
          value={email}
          onChange={handleChange}
          className="border p-2 w-full rounded-md mt-4"
          disabled={isLoading}
        />
        <button
          onClick={handleSendCode}
          className="bg-dark-blue text-white w-full py-2 mt-4 rounded-md hover:bg-blue-900 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Відправлення...' : 'Надіслати код'}
        </button>
        {message && <p className="text-red-500 text-center mt-4">{message}</p>}
      </div>
    </section>
  );
};

export default PasswordRecovery;