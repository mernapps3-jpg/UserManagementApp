import React from 'react';
import useAuth from '../hooks/useAuth';
import commonStyles from '../styles/common.module.css';
import styles from './Admin.module.css';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className={commonStyles.card}>
      <h2 className={commonStyles.cardTitle}>Welcome Back! 👋</h2>
      <div style={{ marginTop: '1.5rem' }}>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          Hello, <strong style={{ color: 'var(--accent-2)' }}>{user?.name}</strong>!
        </p>
        <p style={{ marginBottom: '1rem' }}>
          Your role: <span className={`${styles.roleTag} ${user?.role === 'admin' ? styles.roleTagAdmin : styles.roleTagUser}`} style={{ display: 'inline-block', marginLeft: '0.5rem' }}>{user?.role}</span>
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
          This is your protected dashboard. You're successfully authenticated and can access your account features.
          {user?.role === 'admin' && (
            <>
              <br />
              <br />
              As an admin, you can access the <strong style={{ color: 'var(--accent-2)' }}>Admin Panel</strong> to manage users and use AI features.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
