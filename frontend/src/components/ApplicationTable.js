import React, { useState, useEffect } from 'react';

const statusColors = {
  'Applied': { bg: '#eff6ff', color: '#2563eb' },
  'Online Assessment': { bg: '#fffbeb', color: '#d97706' },
  'Interview': { bg: '#f5f3ff', color: '#7c3aed' },
  'Offer': { bg: '#f0fdf4', color: '#16a34a' },
  'Rejected': { bg: '#fef2f2', color: '#dc2626' }
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
        <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</p>
        <p style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>No applications yet</p>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Add your first job application above</p>
      </div>
    );
  }

  return (
    <>
      <div style={s.wrapper}>
        <table style={s.table}>
          <thead>
            <tr style={s.headerRow}>
              <th style={s.th}>Company</th>
              <th style={s.th}>Role</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Applied Date</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => {
              const sc = statusColors[app.status] || { bg: '#f1f5f9', color: '#475569' };
              return (
                <tr key={app.id} style={s.row}>
                  <td style={s.td}>
                    <div style={s.company}>{app.company}</div>
                  </td>
                  <td style={s.td}><span style={s.role}>{app.role}</span></td>
                  <td style={s.td}>
                    <select
                      style={{ background: sc.bg, color: sc.color, border: 'none', borderRadius: '20px', padding: '0.3rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}
                      value={app.status}
                      onChange={e => handleStatusChange(app, e.target.value)}>
                      <option>Applied</option>
                      <option>Online Assessment</option>
                      <option>Interview</option>
                      <option>Offer</option>
                      <option>Rejected</option>
                    </select>
                  </td>
                  <td style={s.td}><span style={s.date}>{new Date(app.applied_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></td>
                  <td style={s.td}>
                    <button style={s.notesBtn} onClick={() => setSelectedApp(app)}>📝 Notes</button>
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
          <div>
            <h3 style={ns.title}>{application.company}</h3>
            <p style={ns.sub}>{application.role} · Interview Notes</p>
          </div>
          <button style={ns.close} onClick={onClose}>✕</button>
        </div>
        <div style={ns.body}>
          {notes.length === 0 && (
            <div style={ns.empty}>
              <p>📝</p>
              <p>No notes yet. Add your first note!</p>
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
          <input style={ns.input} placeholder="Add a note and press Enter..."
            value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()} />
          <button style={ns.addBtn} onClick={handleAdd}>Add</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  wrapper: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  headerRow: { background: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { padding: '0.875rem 1.25rem', textAlign: 'left', fontWeight: '600', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  row: { borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' },
  td: { padding: '1rem 1.25rem', fontSize: '0.9rem' },
  company: { fontWeight: '600', color: '#1e293b' },
  role: { color: '#475569' },
  date: { color: '#94a3b8', fontSize: '0.85rem' },
  notesBtn: { padding: '0.35rem 0.875rem', background: '#f5f3ff', color: '#7c3aed', border: 'none', borderRadius: '8px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.8rem', fontWeight: '500' },
  deleteBtn: { padding: '0.35rem 0.875rem', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' },
  empty: { textAlign: 'center', padding: '4rem', color: '#94a3b8' }
};

const ns = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' },
  modal: { background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '520px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1.5rem', borderBottom: '1px solid #e2e8f0' },
  title: { fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.2rem' },
  sub: { fontSize: '0.85rem', color: '#64748b' },
  close: { background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1rem', color: '#475569' },
  body: { flex: 1, overflowY: 'auto', padding: '1.25rem' },
  empty: { textAlign: 'center', color: '#94a3b8', padding: '2rem' },
  note: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '10px', marginBottom: '0.5rem', border: '1px solid #e2e8f0' },
  noteText: { color: '#374151', fontSize: '0.9rem', lineHeight: 1.5 },
  del: { background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '0.85rem', flexShrink: 0, marginLeft: '0.5rem' },
  footer: { display: 'flex', gap: '0.75rem', padding: '1.25rem', borderTop: '1px solid #e2e8f0' },
  input: { flex: 1, padding: '0.65rem 1rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' },
  addBtn: { padding: '0.65rem 1.25rem', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }
};