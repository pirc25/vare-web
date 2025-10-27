'use client';

import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import styles from "./page.module.css";

export default function Home() {
  const { usuario, logout, isLoading } = useAuth(); // ← Cambio: user → usuario

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div>Cargando...</div>
      </div>
    );
  }

  if (!usuario) { // ← Cambio: !user → !usuario
    return <LoginForm />;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Sistema de Ventas</h1>
        <div className={styles.userInfo}>
          <span>Bienvenido, {usuario.usuario}</span> {/* ← Cambio: user.usuario → usuario.usuario */}
          <button onClick={logout} className={styles.logoutButton}>
            Cerrar Sesión
          </button>
        </div>
      </header>
      
      <main className={styles.main}>  
        <h2>Dashboard Principal</h2>
        <p>Usuario: {usuario.usuario}</p> {/* ← Cambio: user.usuario → usuario.usuario */}
        <p>Email: {usuario.email}</p> {/* ← Cambio: user.email → usuario.email */}
        
        {/* Aquí irá el contenido principal de tu aplicación */}
        <div className={styles.dashboard}>
          <div className={styles.card}>
            <h3>Productos</h3>
            <p>Gestionar inventario</p>
            <a href="/productos">Ver productos</a>
          </div>
          
          <div className={styles.card}>
            <h3>Clientes</h3>
            <p>Gestionar clientes</p>
            <a href="/clientes">Ver clientes</a>
          </div>
          
          <div className={styles.card}>
            <h3>Ventas</h3>
            <p>Registrar ventas</p>
            <a href="/ventas">Ver ventas</a>
          </div>
          
          <div className={styles.card}>
            <h3>Usuarios</h3>
            <p>Gestionar usuarios</p>
            <a href="/usuarios">Ver usuarios</a>
          </div>
        </div>
      </main>
    </div>
  );
}