import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'farmer' | 'processor' | 'laboratory' | 'manufacturer' | 'regulator' | 'consumer';

interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  loginWithPhone: (phone: string, role: UserRole) => Promise<boolean>;
  signup: (email: string, password: string, role: UserRole, name?: string, phone?: string) => Promise<boolean>;
  forgotPassword: (emailOrPhone: string) => Promise<{ success: boolean; method: 'email' | 'phone' | null; message: string }>;
  resetPassword: (emailOrPhone: string, otp: string, newPassword: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('vrukshachain_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call - in real app, this would validate against backend
    const users = JSON.parse(localStorage.getItem('vrukshachain_users') || '[]');
    const foundUser = users.find((u: any) => 
      u.email === email && u.password === password && u.role === role
    );

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
        name: foundUser.name
      };
      setUser(userData);
      localStorage.setItem('vrukshachain_user', JSON.stringify(userData));
      return true;
    }

    // For demo purposes, allow any login with demo credentials
    if (email === 'demo@vrukshachain.com' && password === 'demo123') {
      const userData = {
        id: 'demo-' + role,
        email,
        role,
        name: 'Demo User'
      };
      setUser(userData);
      localStorage.setItem('vrukshachain_user', JSON.stringify(userData));
      return true;
    }

    return false;
  };

  const loginWithPhone = async (phone: string, role: UserRole): Promise<boolean> => {
    // Check for existing user with phone number
    const users = JSON.parse(localStorage.getItem('vrukshachain_users') || '[]');
    const foundUser = users.find((u: any) => 
      u.phone === phone && u.role === role
    );

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
        name: foundUser.name,
        phone: foundUser.phone
      };
      setUser(userData);
      localStorage.setItem('vrukshachain_user', JSON.stringify(userData));
      return true;
    }

    // For demo purposes, allow any phone login with farmers
    if (role === 'farmer') {
      const userData = {
        id: 'phone-' + phone,
        email: `${phone}@phone.demo`,
        role,
        name: 'Phone User',
        phone
      };
      setUser(userData);
      localStorage.setItem('vrukshachain_user', JSON.stringify(userData));
      return true;
    }

    return false;
  };

  const signup = async (email: string, password: string, role: UserRole, name?: string, phone?: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('vrukshachain_users') || '[]');
      
      // Check if user already exists
      const existingUser = users.find((u: any) => u.email === email || (phone && u.phone === phone));
      if (existingUser) {
        return false;
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        role,
        name: name || email.split('@')[0],
        phone
      };

      users.push(newUser);
      localStorage.setItem('vrukshachain_users', JSON.stringify(users));

      const userData = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        phone: newUser.phone
      };
      setUser(userData);
      localStorage.setItem('vrukshachain_user', JSON.stringify(userData));
      return true;
    } catch (error) {
      return false;
    }
  };

  const forgotPassword = async (emailOrPhone: string): Promise<{ success: boolean; method: 'email' | 'phone' | null; message: string }> => {
    try {
      const users = JSON.parse(localStorage.getItem('vrukshachain_users') || '[]');
      
      // Check if it's an email
      const isEmail = emailOrPhone.includes('@');
      
      let foundUser;
      if (isEmail) {
        foundUser = users.find((u: any) => u.email === emailOrPhone);
      } else {
        // Assume it's a phone number
        foundUser = users.find((u: any) => u.phone === emailOrPhone);
      }
      
      if (foundUser) {
        // In a real app, this would send an actual OTP
        const method = isEmail ? 'email' : 'phone';
        const message = isEmail 
          ? `Reset code sent to ${emailOrPhone}` 
          : `Reset code sent to +91 ${emailOrPhone}`;
        
        return { success: true, method, message };
      } else {
        return { 
          success: false, 
          method: null, 
          message: isEmail ? 'Email not found' : 'Phone number not found' 
        };
      }
    } catch (error) {
      return { success: false, method: null, message: 'Failed to process request' };
    }
  };

  const resetPassword = async (emailOrPhone: string, otp: string, newPassword: string): Promise<boolean> => {
    try {
      // In a real app, you would verify the OTP first
      if (otp !== '123456') {
        return false;
      }
      
      const users = JSON.parse(localStorage.getItem('vrukshachain_users') || '[]');
      const isEmail = emailOrPhone.includes('@');
      
      const userIndex = users.findIndex((u: any) => 
        isEmail ? u.email === emailOrPhone : u.phone === emailOrPhone
      );
      
      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('vrukshachain_users', JSON.stringify(users));
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vrukshachain_user');
  };

  const value = {
    user,
    login,
    loginWithPhone,
    signup,
    forgotPassword,
    resetPassword,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};