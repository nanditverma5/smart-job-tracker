import React, { useState } from 'react';
import { register } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={s.page}>
      <div style={s.left}>
        <div style={s.brand}>
          <div style={s.logo}>T</div>
          <h1 style={s.brandName}>TrackHire</h1>
        </div>
        <h2 style={s.tagline}>Start tracking your job search today</h2>
        <p style={s.sub}>Join thousands of job seekers who use TrackHire to stay organized and land more offers.</p>
      </div>
      <div style={s.right}>
        <div style={s.card}>
          <h2 style={s.title}>Create account</h2>
          <p style={s.subtitle}>Start your job search journey</p>
          {error && <div style={s.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <label style={s.label}>Full Name</label>
            <input style={s.input} type="text" placeholder="Nandit Verma"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            <button style={s.btn} type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <p style={s.link}>Already have an account? <Link to="/login" style={s.a}>Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display: 'flex', minHeight: '100vh' },
  left: { flex: 1, background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' },
  brand: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' },
  logo: { width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: '700' },
  brandName: { fontSize: '1.5rem', fontWeight: '700' },
  tagline: { fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', lineHeight: 1.3 },
  sub: { opacity: 0.8, lineHeight: 1.6 },
  right: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#f8fafc' },
  card: { background: '#fff', padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  title: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem', color: '#1e293b' },
  subtitle: { color: '#64748b', marginBottom: '1.5rem' },
  label: { display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.4rem' },
  input: { width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', marginBottom: '1rem', outline: 'none', color: '#1e293b' },
  btn: { width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem' },
  error: { background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' },
  link: { textAlign: 'center', marginTop: '1.25rem', color: '#64748b', fontSize: '0.9rem' },
  a: { color: '#4f46e5', fontWeight: '600', textDecoration: 'none' }
};