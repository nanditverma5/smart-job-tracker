import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={s.nav}>
      <div style={s.brand}>
        <div style={s.logo}>T</div>
        <span style={s.name}>TrackHire</span>
      </div>
      <div style={s.right}>
        <div style={s.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
        <span style={s.username}>{user?.name}</span>
        <button style={s.btn} onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

const s = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem', height: '64px', background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 },
  brand: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  logo: { width: '32px', height: '32px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '1rem' },
  name: { fontWeight: '700', fontSize: '1.1rem', color: '#1e293b' },
  right: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  avatar: { width: '32px', height: '32px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600', fontSize: '0.875rem' },
  username: { fontSize: '0.9rem', color: '#475569', fontWeight: '500' },
  btn: { padding: '0.4rem 1rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.875rem' }
};