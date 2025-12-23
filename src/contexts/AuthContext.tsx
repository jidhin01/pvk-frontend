import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'designer'
  | 'printer'
  | 'dealer'
  | 'sales'
  | 'finance'
  | 'stock_keeper';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for development
const MOCK_USERS: Record<string, User> = {
  'superadmin@pvk.com': {
    id: '1',
    email: 'superadmin@pvk.com',
    name: 'Super Admin',
    role: 'super_admin',
  },
  'admin@pvk.com': {
    id: '2',
    email: 'admin@pvk.com',
    name: 'Admin User',
    role: 'admin',
  },
  'manager@pvk.com': {
    id: '3',
    email: 'manager@pvk.com',
    name: 'Manager',
    role: 'manager',
  },
  'dealer@pvk.com': {
    id: '4',
    email: 'dealer@pvk.com',
    name: 'Dealer',
    role: 'dealer',
  },
  'designer@pvk.com': {
    id: '5',
    email: 'designer@pvk.com',
    name: 'Designer',
    role: 'designer',
  },
  'printer@pvk.com': {
    id: '6',
    email: 'printer@pvk.com',
    name: 'Printer',
    role: 'printer',
  },
  'sales@pvk.com': {
    id: '7',
    email: 'sales@pvk.com',
    name: 'Sales Staff',
    role: 'sales',
  },
  'finance@pvk.com': {
    id: '8',
    email: 'finance@pvk.com',
    name: 'Finance Officer',
    role: 'finance',
  },
  'stockkeeper@pvk.com': {
    id: '9',
    email: 'stockkeeper@pvk.com',
    name: 'Stock Keeper',
    role: 'stock_keeper',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('pvk_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const normalizedEmail = email.toLowerCase().trim();
    const mockUser = MOCK_USERS[normalizedEmail];

    if (mockUser && password === 'password123') {
      setUser(mockUser);
      localStorage.setItem('pvk_user', JSON.stringify(mockUser));
      setIsLoading(false);
      return { success: true, user: mockUser };
    }

    setIsLoading(false);
    return { success: false, error: 'Invalid email or password' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('pvk_user');
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
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
