
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

// This is a mock User type. In a real app, this would likely come from Firebase.
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  login: () => {}, 
  logout: () => {} 
});

const AUTH_SESSION_KEY = 'emerald-health-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for a user session when the app loads.
  useEffect(() => {
    try {
        const storedUser = sessionStorage.getItem(AUTH_SESSION_KEY);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error("Failed to parse user from sessionStorage", error);
        setUser(null);
    } finally {
        setLoading(false);
    }
  }, []);

  // Mock login function
  const login = (email: string) => {
    // Create a mock user object.
    const mockUser: MockUser = {
      uid: 'mock-user-id-' + Math.random(),
      email: email,
      displayName: email.split('@')[0], // Create a display name from the email
      photoURL: null, // No photo for mock users
    };
    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
  };

  // Mock logout function
  const logout = () => {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    setUser(null);
  };


  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
