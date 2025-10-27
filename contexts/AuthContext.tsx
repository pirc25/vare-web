'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Usuario {
  idUser: number;
  usuario: string;
  email: string;
}

interface AuthContextType {
  usuario: Usuario | null; // ← Cambio: user → usuario
  login: (usuario: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null); // ← Cambio: user → usuario
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario logueado al cargar la página
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUsuario(userData); // ← Cambio: setUser → setUsuario
        } else {
          localStorage.removeItem('auth_token');
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (usuario: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.token);
        setUsuario(data.user); // ← Cambio: setUser → setUsuario
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUsuario(null); // ← Cambio: setUser → setUsuario
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isLoading }}>
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