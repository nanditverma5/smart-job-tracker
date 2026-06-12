import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ApplicationForm from '../components/ApplicationForm';
import ApplicationTable from '../components/ApplicationTable';

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('https://trackhire-r2ba.onrender.com/api/applications/stats', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    setStats(data.stats || []);
    setTotal(data.total || 0);
  };

  const fetchApplications = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('https://trackhire-r2ba.onrender.com/api/applications', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    setApplications(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, []);

  const getCount = (status) => {
    const found = stats.find(s => s.status === status);
    return found ? Number(found.count) : 0;
  };

  const statCards = [
    { label: 'Total Applied', value: Number(total), color: '#818cf8', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)', icon: '📨' },
    { label: 'Interviews', value: getCount('Interview'), color: '#a78bfa', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)', icon: '🎯' },
    { label: 'Offers', value: getCount('Offer'), color: '#34d399', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', icon: '🎉' },
    { label: 'Rejected', value: getCount('Rejected'), color: '#f87171', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', icon: '❌' },
  ];

  const handleAdd = (app) => {
    setApplications(prev => [app, ...prev]);
    fetchStats();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#e2e8f0', marginBottom: '0.25rem' }}>Dashboard</h1>
          <p style={{ color: '#4a5568' }}>Track and manage your job applications</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {statCards.map(stat => (
            <div key={stat.label} style={{ background: stat.bg, borderRadius: '16px', padding: '1.25rem', border: '1px solid ' + stat.border, display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ fontSize: '0.78rem', color: '#4a5568', fontWeight: '500', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: stat.color, lineHeight: 1 }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <ApplicationForm onAdd={handleAdd} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#94a3b8' }}>Applications</h2>
          <span style={{ fontSize: '0.8rem', color: '#4a5568', background: '#161b27', padding: '0.25rem 0.75rem', borderRadius: '20px', border: '1px solid #1e2433' }}>{applications.length} total</span>
        </div>

        <ApplicationTable applications={applications} setApplications={setApplications} onUpdate={fetchStats} />

      </div>
    </div>
  );
}