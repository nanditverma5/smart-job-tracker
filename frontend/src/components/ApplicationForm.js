import React, { useState } from 'react';

export default function ApplicationForm({ onAdd }) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Applied');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ company, role, status, applied_date: date })
      });
      const data = await res.json();
      onAdd(data);
      setCompany(''); setRole(''); setStatus('Applied'); setDate('');
    } catch (err) {
      setError('Failed to add application');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
      <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#1a1a2e' }}>Add Application</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <input style={inp} placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} required />
        <input style={inp} placeholder="Role" value={role} onChange={e => setRole(e.target.value)} required />
        <select style={inp} value={status} onChange={e => setStatus(e.target.value)}>
          <option>Applied</option>
          <option>Online Assessment</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
        <input style={inp} type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <button style={{ padding: '0.6rem 1.5rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }} type="submit">Add</button>
      </form>
    </div>
  );
}

const inp = { padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem', flex: '1', minWidth: '140px' };