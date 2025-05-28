"use client"; 
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface UserType {
  id: number;
  name: string;
  email: string;
  telegram?: string;
  role: { id: number; name: string };
  isVerified: boolean;
  organizations: Array<{
    id: number;
    name: string;
    logoUrl: string;
    description: string;
    activeEventsCount: number;
    websiteUrl: string;
    contactEmail: string;
    slug: string;
    isVerified: boolean;
  }> ;
  token: string;
}

type UserContextType = {
  userCurrent: UserType | null;
  setUserCurrent: (user: UserType | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
  isInitialized: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const SESSION_USER_KEY = 'currentUser'; 
const SESSION_TOKEN_KEY = 'authToken';
const SESSION_PASSWORD_KEY = 'authPassword'; // додано для збереження пароля

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userCurrent, setUserCurrent] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Ініціалізація стейту з sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem(SESSION_USER_KEY);
      const storedToken = sessionStorage.getItem(SESSION_TOKEN_KEY);

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUserCurrent(parsedUser);
        } catch (error) {
          console.error('Error parsing user data from session:', error);
          sessionStorage.removeItem(SESSION_USER_KEY);
        }
      }

      if (storedToken) {
        setToken(storedToken);
      }

      setIsInitialized(true);
    }
  }, []);

  // Оновлення sessionStorage коли змінюється користувач
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      if (userCurrent) {
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(userCurrent));
      } else {
        sessionStorage.removeItem(SESSION_USER_KEY);
      }
    }
  }, [userCurrent, isInitialized]);

  // Оновлення sessionStorage коли змінюється токен
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      if (token) {
        sessionStorage.setItem(SESSION_TOKEN_KEY, token);
      } else {
        sessionStorage.removeItem(SESSION_TOKEN_KEY);
      }
    }
  }, [token, isInitialized]);

// Update the refreshUser method to use token and userId
const refreshUser = async () => {
  const storedToken = sessionStorage.getItem(SESSION_TOKEN_KEY);

  if (!storedToken) {
    console.error("No token found");
    return;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${storedToken}`,
      },
    });

    if (response.ok) {
      const userData: UserType = await response.json();
      setUserCurrent(userData);
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(userData));
    } else {
      console.error("Failed to refresh user:", response.status);
      logout();
    }
  } catch (error) {
    console.error("Error refreshing user data:", error);
  }
};

  

  const logout = () => {
    sessionStorage.removeItem(SESSION_USER_KEY);
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_PASSWORD_KEY); // Видаляємо пароль
    setUserCurrent(null);
    setToken(null);
  };

  return (
    <UserContext.Provider value={{ userCurrent, setUserCurrent, token, setToken, refreshUser, logout, isInitialized }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
