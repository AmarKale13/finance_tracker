import React, { useState } from 'react';
import api from '../services/api';
import './AuthForms.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', form);
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={onSubmit}>
        <h2>Sign Up</h2>
        {error && <p className="auth-error">{error}</p>}
        <label>Name</label>
        <input type="text" name="name" value={form.name} onChange={onChange} required />
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={onChange} required />
        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={onChange} required />
        <button type="submit">Create Account</button>
        <p className="auth-toggle">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}
