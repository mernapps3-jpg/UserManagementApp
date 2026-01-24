import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import useAuth from '../hooks/useAuth';
import commonStyles from '../styles/common.module.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={commonStyles.card}>
      <h2 className={commonStyles.cardTitle}>Login</h2>
      <form onSubmit={handleSubmit} className={commonStyles.form}>
        <label className={commonStyles.formLabel}>Email</label>
        <input 
          className={commonStyles.formInput}
          name="email" 
          type="email" 
          value={form.email} 
          onChange={handleChange} 
          required 
        />

        <label className={commonStyles.formLabel}>Password</label>
        <input 
          className={commonStyles.formInput}
          name="password" 
          type="password" 
          value={form.password} 
          onChange={handleChange} 
          required 
        />

        {error && <p className={commonStyles.errorMessage}>{error}</p>}
        <button type="submit" className={commonStyles.button} disabled={loading}>
          {loading ? (
            <>
              <span className={commonStyles.loadingSpinner}></span>
              Signing in...
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>
      <p>New here? <Link to="/register">Create an account</Link></p>
    </div>
  );
}
