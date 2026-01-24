import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import useAuth from '../hooks/useAuth';
import commonStyles from '../styles/common.module.css';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      const { data } = await api.post('/api/auth/register', form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={commonStyles.card}>
      <h2 className={commonStyles.cardTitle}>Create account</h2>
      <form onSubmit={handleSubmit} className={commonStyles.form}>
        <label className={commonStyles.formLabel}>Name</label>
        <input 
          className={commonStyles.formInput}
          name="name" 
          value={form.name} 
          onChange={handleChange} 
          required 
        />

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
          minLength={6} 
        />

        {error && <p className={commonStyles.errorMessage}>{error}</p>}
        <button type="submit" className={commonStyles.button} disabled={loading}>
          {loading ? (
            <>
              <span className={commonStyles.loadingSpinner}></span>
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
