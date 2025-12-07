import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { sendOTP as firebaseSendOTP, verifyOTP, signOut as firebaseSignOut } from '../services/firebase';
import {
  loginWithFirebaseToken,
  logout as apiLogout,
  getStoredUser,
  isAuthenticated,
} from '../services/api';

interface User {
  id: number;
  name: string;
  phone: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  phoneNumber: string;
  sendOTP: (phone: string) => Promise<boolean>;
  verifyAndLogin: (otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Check for existing auth on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        const storedUser = await getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }
      }
    } catch (error) {
      console.log('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (phone: string): Promise<boolean> => {
    try {
      setPhoneNumber(phone);
      await firebaseSendOTP(phone);
      return true;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  };

  const verifyAndLogin = async (otp: string): Promise<boolean> => {
    try {
      // Verify OTP with Firebase and get ID token
      const { idToken } = await verifyOTP(otp);

      // Login to Laravel API with the Firebase token
      const response = await loginWithFirebaseToken(idToken);

      setUser(response.data.user);

      return true;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await firebaseSignOut();
      await apiLogout();
      setUser(null);
      setPhoneNumber('');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn: !!user,
    phoneNumber,
    sendOTP: handleSendOTP,
    verifyAndLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
