import React, { useState } from 'react';

export default function ApplicationForm({ onAdd }) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Applied');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://trackhire-r2ba.onrender.com/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ company, role, status, applied_date: date })
      });
      const data = await res.json();
      onAdd(data);
      setCompany(''); setRole(''); setStatus('Applied'); setDate('');
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={s.card}>
      <h3 style={s.title}>Add New Application</h3>
      <form onSubmit={handleSubmit} style={s.form}>
        <div style={s.field}>
          <label style={s.label}>Company</label>
          <input style={s.input} placeholder="e.g. Google" value={company} onChange={e => setCompany(e.target.value)} required />
        </div>
        <div style={s.field}>
          <label style={s.label}>Role</label>
          <input style={s.input} placeholder="e.g. SDE Intern" value={role} onChange={e => setRole(e.target.value)} required />
        </div>
        <div style={s.field}>
          <label style={s.label}>Status</label>
          <select style={s.input} value={status} onChange={e => setStatus(e.target.value)}>
            <option>Applied</option>
            <option>Online Assessment</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
        </div>
        <div style={s.field}>
          <label style={s.label}>Date Applied</label>
          <input style={s.input} type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <button style={s.btn} type="submit" disabled={loading}>
          {loading ? 'Adding...' : '+ Add Application'}
        </button>
      </form>
    </div>
  );
}

const s = {
  card: { background: '#fff', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem', border: '1px solid #e2e8f0' },
  title: { fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1.25rem' },
  form: { display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' },
  field: { display: 'flex', flexDirection: 'column', flex: '1', minWidth: '150px' },
  label: { fontSize: '0.8rem', fontWeight: '500', color: '#64748b', marginBottom: '0.4rem' },
  input: { padding: '0.6rem 0.875rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', color: '#1e293b', outline: 'none' },
  btn: { padding: '0.65rem 1.5rem', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', whiteSpace: 'nowrap', height: '38px' }
};