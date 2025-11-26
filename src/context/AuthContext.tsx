import React, { useEffect, useState, createContext, useContext } from 'react';
import { User, UserRole } from '../types';
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Mock authentication - check localStorage for users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password && u.role === role);
    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role
      };
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    // Demo: auto-create staff user if logging in as staff
    if (role === 'staff' && email === 'staff@example.com' && password === 'password') {
      const staffUser = {
        id: 'staff-1',
        email: 'staff@example.com',
        name: 'Staff User',
        role: 'staff' as UserRole,
        password: 'password'
      };
      users.push(staffUser);
      localStorage.setItem('users', JSON.stringify(users));
      const userWithoutPassword = {
        id: staffUser.id,
        email: staffUser.email,
        name: staffUser.name,
        role: staffUser.role
      };
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };
  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      return false;
    }
    const newUser = {
      id: `client-${Date.now()}`,
      email,
      password,
      name,
      role: 'client' as UserRole
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    const userWithoutPassword = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    };
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return true;
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };
  return <AuthContext.Provider value={{
    user,
    login,
    register,
    logout
  }}>
      {children}
    </AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}