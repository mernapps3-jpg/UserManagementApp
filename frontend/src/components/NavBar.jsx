import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import styles from './NavBar.module.css';

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.navbarBrand}>User Management App</Link>
      <div className={styles.navbarLinks}>
        {user && user.role === 'admin' && <Link to="/admin" className={styles.navbarLink}>Admin</Link>}
        {!user && (
          <>
            <Link to="/login" className={styles.navbarLink}>Login</Link>
            <Link to="/register" className={styles.navbarLink}>Register</Link>
          </>
        )}
        {user && (
          <>
            <span className={styles.navbarWelcome}>Hi, {user.name} ({user.role})</span>
            <button className={styles.navbarLogoutButton} onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
