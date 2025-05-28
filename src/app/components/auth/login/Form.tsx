"use client";
import React, { useState, ChangeEvent } from 'react';
import GoogleSignInButton from '../common/GoogleSignInButton';
import { useRouter } from 'next/navigation';
import { useUser } from "../../../context/UserContext";
import '../../../globals.css';
import { UserType } from "../../../context/UserContext";

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false); 
  const router = useRouter();
  const { setUserCurrent, setToken } = useUser();
  console.log(showForgotPassword);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


const handleLogin = async () => {
  setIsLoading(true);
  setErrorMessage('');
  setShowForgotPassword(false);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      const loginData = await response.json();
      const token = loginData.token;
      
      // Store token in sessionStorage
      sessionStorage.setItem('authToken', token);

      const userData: UserType = {
        id: loginData.user.id,
        name: loginData.user.name,
        email: loginData.user.email,
        telegram: loginData.user.telegram,
        role: loginData.user.role,
        isVerified: loginData.user.isVerified,
        organizations: loginData.user.organizations,
        token: token
      };

      setToken(token);
      setUserCurrent(userData);
      sessionStorage.setItem('currentUser', JSON.stringify(userData));

      router.push('/profile');
    } else if (response.status === 401) {
      setErrorMessage('Неправильний email або пароль.');
      setShowForgotPassword(true);
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.message || 'Сталася помилка. Спробуйте ще раз.');
    }
  } catch (error) {
    console.error('Помилка входу:', error);
    setErrorMessage('Сталася помилка. Спробуйте ще раз.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <section className="bg-white text-dark-blue py-12" style={{ margin: 'auto', maxWidth: '1200px', fontFamily: "Montserrat Alternates, sans-serif" }}>
      <div className="container mx-auto grid grid-cols-1 gap-8" style={{ maxWidth: '85%' }}>
        <div style={{ maxWidth: '1000px', marginLeft: 'auto', marginRight: 'auto', width: '-webkit-fill-available' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ textAlign: "center" }}>Увійти в акаунт</h2>
          
          <p className='mb-1'>Електронна пошта</p>
          <input
            type="email"
            name="email"
            placeholder="Твоя електронна пошта"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 mb-4 w-full rounded-[10px]"
            disabled={isLoading}
          />

          <p className='mb-1'>Пароль</p>
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            className="border p-2 mb-4 w-full rounded-[10px]"
            disabled={isLoading}
          />

          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

          <div className="mb-4" style={{ marginTop: "12px" }}>
            <label htmlFor="policy" className="ml-2">
              Забули пароль? <a href="/restore" className="text-blue-500 underline">Відновіть його тут.</a>
            </label>
          </div>

          <button 
            onClick={handleLogin} 
            className="bg-dark-blue text-white px-4 py-2 mt-4" 
            style={{ borderRadius: '32px', width: '100%', height: '56px', fontSize: '20px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Завантаження...' : 'Увійти'}
          </button>
          <div className="mt-4 mb-4">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-300 flex-grow"></div>
              <span className="px-4 bg-white text-gray-500">або</span>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>
          </div>

          <GoogleSignInButton />
          <div className="mb-4 mt-4">
            <p>Ще не маєте акаунту? <a href="/auth/register" className="text-blue-500 underline">зареєструйтесь тут!</a></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
