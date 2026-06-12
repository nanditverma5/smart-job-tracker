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
          <span style={s.brandName}>TrackHire</span>
        </div>
        <h1 style={s.tagline}>Your job search, organized</h1>
        <p style={s.sub}>Stop losing track of applications. TrackHire keeps everything in one place so you can focus on what matters — getting hired.</p>
        <div style={s.glow} />
      </div>
      <div style={s.right}>
        <div style={s.card}>
          <h2 style={s.title}>Create account</h2>
          <p style={s.subtitle}>Start tracking for free</p>
          {error && <div style={s.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <label style={s.label}>Full Name</label>
            <input style={s.input} type="text" placeholder="Nandit Verma"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <label style={s.label}>Email address</label>
            <input style={s.input} type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            <button style={{...s.btn, opacity: loading ? 0.7 : 1}} type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Get started →'}
            </button>
          </form>
          <p style={s.link}>Already have an account? <Link to="/login" style={s.a}>Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display: 'flex', minHeight: '100vh', background: '#0f1117' },
  left: { flex: 1, padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', borderRight: '1px solid #1e2433' },
  brand: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' },
  logo: { width: '36px', height: '36px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '1rem' },
  brandName: { fontSize: '1.25rem', fontWeight: '700', color: '#e2e8f0' },
  tagline: { fontSize: '2.5rem', fontWeight: '700', color: '#fff', lineHeight: 1.2, marginBottom: '1rem', maxWidth: '400px' },
  sub: { color: '#64748b', lineHeight: 1.7, maxWidth: '380px' },
  glow: { position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%', top: '50%', left: '30%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' },
  right: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { background: '#161b27', padding: '2.5rem', borderRadius: '20px', width: '100%', maxWidth: '420px', border: '1px solid #1e2433' },
  title: { fontSize: '1.75rem', fontWeight: '700', color: '#fff', marginBottom: '0.375rem' },
  subtitle: { color: '#64748b', marginBottom: '2rem' },
  label: { display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: { width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #2d3748', fontSize: '0.95rem', marginBottom: '1.25rem', outline: 'none' },
  btn: { width: '100%', padding: '0.875rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem' },
  error: { background: 'rgba(220,38,38,0.1)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.875rem', border: '1px solid rgba(220,38,38,0.2)' },
  link: { textAlign: 'center', marginTop: '1.5rem', color: '#4a5568', fontSize: '0.9rem' },
  a: { color: '#818cf8', fontWeight: '600', textDecoration: 'none' }
};