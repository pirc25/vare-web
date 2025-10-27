'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(usuario, password);
    
    if (!success) {
      setError('Credenciales inválidas');
    }
    
    setIsLoading(false);
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>Iniciar Sesión</h2>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.inputGroup}>
          <label htmlFor="usuario">Usuario:</label>
          <input
            id="usuario"
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Ingresa tu usuario"
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Ingresa tu contraseña"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className={styles.loginButton}
        >
          {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
        
        <div className={styles.testCredentials}>
          <p><strong>Usuarios de prueba:</strong></p>
          <p>Admin: usuario="admin", password="admin123"</p>
          <p>Vendedor: usuario="vendedor", password="vendedor123"</p>
        </div>
      </form>
    </div>
  );
}