import React, { useState, useEffect } from 'react';

const statusConfig = {
  'Applied':            { bg: 'rgba(99,102,241,0.15)',  color: '#818cf8' },
  'Online Assessment':  { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24' },
  'Interview':          { bg: 'rgba(139,92,246,0.15)',  color: '#a78bfa' },
  'Offer':              { bg: 'rgba(16,185,129,0.15)',  color: '#34d399' },
  'Rejected':           { bg: 'rgba(239,68,68,0.15)',   color: '#f87171' }
};

export default function ApplicationTable({ applications, setApplications, onUpdate }) {
  const [selectedApp, setSelectedApp] = useState(null);

  const handleStatusChange = async (app, status) => {
    const token = localStorage.getItem('token');
    const res = await fetch('https://trackhire-r2ba.onrender.com/api/applications/' + app.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ ...app, status })
    });
    const data = await res.json();
    setApplications(prev => prev.map(a => a.id === app.id ? data : a));
    if (onUpdate) onUpdate();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    const token = localStorage.getItem('token');
    await fetch('https://trackhire-r2ba.onrender.com/api/applications/' + id, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    setApplications(prev => prev.filter(a => a.id !== id));
    if (onUpdate) onUpdate();
  };

  if (applications.length === 0) {
    return (
      <div style={s.empty}>
        <div style={s.emptyIcon}>📋</div>
        <p style={s.emptyTitle}>No applications yet</p>
        <p style={s.emptySub}>Add your first job application above</p>
      </div>
    );
  }

  return (
    <>
      <div style={s.wrapper}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Company</th>
              <th style={s.th}>Role</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Applied</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => {
              const sc = statusConfig[app.status] || { bg: '#1e2433', color: '#94a3b8' };
              return (
                <tr key={app.id} style={s.row}>
                  <td style={s.td}>
                    <div style={s.companyWrapper}>
                      <div style={s.companyAvatar}>{app.company.charAt(0)}</div>
                      <span style={s.company}>{app.company}</span>
                    </div>
                  </td>
                  <td style={s.td}><span style={s.role}>{app.role}</span></td>
                  <td style={s.td}>
                    <select style={{ background: sc.bg, color: sc.color, border: 'none', borderRadius: '20px', padding: '0.3rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}
                      value={app.status} onChange={e => handleStatusChange(app, e.target.value)}>
                      <option>Applied</option>
                      <option>Online Assessment</option>
                      <option>Interview</option>
                      <option>Offer</option>
                      <option>Rejected</option>
                    </select>
                  </td>
                  <td style={s.td}><span style={s.date}>{new Date(app.applied_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></td>
                  <td style={s.td}>
                    <button style={s.notesBtn} onClick={() => setSelectedApp(app)}>Notes</button>
                    <button style={s.deleteBtn} onClick={() => handleDelete(app.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedApp && <NotesPanel application={selectedApp} onClose={() => setSelectedApp(null)} />}
    </>
  );
}

function NotesPanel({ application, onClose }) {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('https://trackhire-r2ba.onrender.com/api/notes/' + application.id, {
      headers: { 'Authorization': 'Bearer ' + token }
    }).then(r => r.json()).then(data => setNotes(data.notes || []));
  }, [application.id]);

  const handleAdd = async () => {
    if (!text.trim()) return;
    const token = localStorage.getItem('token');
    const res = await fetch('https://trackhire-r2ba.onrender.com/api/notes/' + application.id, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    setNotes(data.notes);
    setText('');
  };

  const handleDelete = async (noteId) => {
    const token = localStorage.getItem('token');
    const res = await fetch('https://trackhire-r2ba.onrender.com/api/notes/' + application.id + '/' + noteId, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    setNotes(data.notes);
  };

  return (
    <div style={ns.overlay}>
      <div style={ns.modal}>
        <div style={ns.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={ns.avatar}>{application.company.charAt(0)}</div>
            <div>
              <h3 style={ns.title}>{application.company}</h3>
              <p style={ns.sub}>{application.role}</p>
            </div>
          </div>
          <button style={ns.close} onClick={onClose}>✕</button>
        </div>
        <div style={ns.body}>
          {notes.length === 0 && (
            <div style={ns.empty}>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</p>
              <p style={{ color: '#4a5568' }}>No notes yet. Add your first note!</p>
            </div>
          )}
          {notes.map(note => (
            <div key={note._id} style={ns.note}>
              <span style={ns.noteText}>{note.text}</span>
              <button style={ns.del} onClick={() => handleDelete(note._id)}>✕</button>
            </div>
          ))}
        </div>
        <div style={ns.footer}>
          <input style={ns.input} placeholder="Add a note... (press Enter)"
            value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()} />
          <button style={ns.addBtn} onClick={handleAdd}>Add</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  wrapper: { background: '#161b27', borderRadius: '16px', border: '1px solid #1e2433', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '0.875rem 1.25rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #1e2433' },
  row: { borderBottom: '1px solid #1a1f2e' },
  td: { padding: '1rem 1.25rem' },
  companyWrapper: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  companyAvatar: { width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '0.875rem', flexShrink: 0 },
  company: { fontWeight: '600', color: '#e2e8f0', fontSize: '0.9rem' },
  role: { color: '#64748b', fontSize: '0.9rem' },
  date: { color: '#4a5568', fontSize: '0.85rem' },
  notesBtn: { padding: '0.35rem 0.875rem', background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.8rem', fontWeight: '500' },
  deleteBtn: { padding: '0.35rem 0.875rem', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' },
  empty: { textAlign: 'center', padding: '4rem', color: '#4a5568' },
  emptyIcon: { fontSize: '2.5rem', marginBottom: '0.75rem' },
  emptyTitle: { fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' },
  emptySub: { color: '#4a5568', fontSize: '0.9rem' }
};

const ns = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' },
  modal: { background: '#161b27', borderRadius: '20px', width: '100%', maxWidth: '520px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', border: '1px solid #1e2433', boxShadow: '0 25px 80px rgba(0,0,0,0.5)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #1e2433' },
  avatar: { width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '1rem' },
  title: { fontSize: '1rem', fontWeight: '700', color: '#e2e8f0', marginBottom: '0.2rem' },
  sub: { fontSize: '0.8rem', color: '#64748b' },
  close: { background: '#1e2433', border: '1px solid #2d3748', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', color: '#64748b', fontSize: '0.9rem' },
  body: { flex: 1, overflowY: 'auto', padding: '1.25rem' },
  empty: { textAlign: 'center', padding: '2rem' },
  note: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.875rem 1rem', background: '#1a1f2e', borderRadius: '10px', marginBottom: '0.5rem', border: '1px solid #1e2433', gap: '0.75rem' },
  noteText: { color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 },
  del: { background: 'none', border: 'none', color: '#2d3748', cursor: 'pointer', fontSize: '0.85rem', flexShrink: 0 },
  footer: { display: 'flex', gap: '0.75rem', padding: '1.25rem', borderTop: '1px solid #1e2433' },
  input: { flex: 1, padding: '0.7rem 1rem', borderRadius: '10px', border: '1px solid #2d3748', fontSize: '0.9rem', outline: 'none' },
  addBtn: { padding: '0.7rem 1.25rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }
};