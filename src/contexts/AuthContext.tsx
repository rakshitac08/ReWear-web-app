import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  points: number;
  role: 'user' | 'admin';
  profileImage?: string;
  badges: string[];
  totalSwaps: number;
  listingsCount: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, confirmPassword: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'rakshita08@gmail.com',
    username: 'Rakshita',
    password: 'password123',
    points: 50,
    role: 'user',
    badges: ['New Member'],
    totalSwaps: 0,
    listingsCount: 0
  },
  {
    id: '2',
    email: 'anisha22@gmail.com',
    username: 'Anisha',
    password: 'password123',
    points: 500,
    role: 'admin',
    badges: ['Admin', 'Platform Manager'],
    totalSwaps: 25,
    listingsCount: 15
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored auth token on app load
    const storedUser = localStorage.getItem('rewear_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('rewear_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const updateUserStats = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('rewear_user', JSON.stringify(updatedUser));
    }
  };

  const register = async (username: string, email: string, password: string, confirmPassword: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (password !== confirmPassword) {
      return false;
    }

    // Check if email already exists
    if (mockUsers.find(u => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      username,
      points: 50, // Welcome bonus
      role: 'user',
      badges: ['New Member'],
      totalSwaps: 0,
      listingsCount: 0
    };

    setUser(newUser);
    localStorage.setItem('rewear_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rewear_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateUserStats,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}