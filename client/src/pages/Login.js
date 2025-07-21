import React, { useState } from 'react';
import api from '../services/api';
import './AuthForms.css';

export default function Login({ navigate }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={onSubmit}>
        <h2>Login</h2>
        {error && <p className="auth-error">{error}</p>}
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={onChange} required />
        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={onChange} required />
        <button type="submit">Sign In</button>
        <p className="auth-toggle">
          Don't have an account? <a href="/register">Sign Up</a>
        </p>
      </form>
    </div>
  );
}
