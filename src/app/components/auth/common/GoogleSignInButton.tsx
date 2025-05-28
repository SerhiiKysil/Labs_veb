"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from "../../../context/UserContext";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Your Firebase configuration
const firebaseConfig = {
  // Replace with your Firebase project configuration
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const GoogleSignInButton = () => {
  const router = useRouter();
  const { setUserCurrent, setToken } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Sign in with Google popup
      const result = await signInWithPopup(auth, provider);
      
      // Get ID token
      const idToken = await result.user.getIdToken();
      
      // Send token to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      
      if (response.ok) {
        const loginData = await response.json();
        const token = loginData.token;
        
        // Store token in sessionStorage
        sessionStorage.setItem('authToken', token);
        
        const userData = {
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
      } else {
        // Try to get more detailed error info
        try {
          const errorData = await response.json();
          console.error('Server error:', errorData);
          setError(errorData.message || 'Authentication failed. Please try again.');
        } catch {
          // If JSON parsing fails, use the status text
          setError(`Authentication failed (${response.status}): ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      
      // More specific error messages based on Firebase error codes
      if (error === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled');
      } else if (error === 'auth/network-request-failed') {
        setError('Network error. Please check your connection.');
      } else {
        setError(`Error signing in with Google: ${error}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <button
        onClick={handleGoogleSignIn}
        className="flex items-center justify-center bg-white text-dark-blue px-4 py-2 border border-gray-300 shadow-md"
        style={{ borderRadius: '32px', width: '100%', height: '56px', fontSize: '16px' }}
        disabled={isLoading}
      >
        {isLoading ? (
          'Завантаження...'
        ) : (
          <>
            <img 
              src="/images/google.svg" 
              alt="Google" 
              className="w-6 h-6 mr-2" 
            />
            Увійти через Google 
          </>
        )}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default GoogleSignInButton;