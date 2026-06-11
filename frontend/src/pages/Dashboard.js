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
    const res = await fetch('http://localhost:5000/api/applications/stats', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    setStats(data.stats);
    setTotal(data.total);
  };

  const fetchApplications = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/applications', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    setApplications(data);
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
    { label: 'Total', value: Number(total), color: '#4f46e5' },
    { label: 'Interviews', value: getCount('Interview'), color: '#8b5cf6' },
    { label: 'Offers', value: getCount('Offer'), color: '#10b981' },
    { label: 'Rejected', value: getCount('Rejected'), color: '#ef4444' },
  ];

  const handleAdd = (app) => {
    setApplications(function(prev) { return [app, ...prev]; });
    fetchStats();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {statCards.map(function(stat) {
            return (
              <div key={stat.label} style={{
                flex: '1', minWidth: '140px', background: '#fff',
                borderRadius: '12px', padding: '1.25rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderTop: '4px solid ' + stat.color
              }}>
                <p style={{ margin: '0 0 0.5rem', color: '#666', fontSize: '0.9rem' }}>{stat.label}</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: stat.color }}>{stat.value}</p>
              </div>
            );
          })}
        </div>

        <ApplicationForm onAdd={handleAdd} />

        <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#1a1a2e' }}>Your Applications</h3>
        <ApplicationTable applications={applications} setApplications={setApplications} onUpdate={fetchStats} />

      </div>
    </div>
  );
}