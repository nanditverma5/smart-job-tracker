import React, { useState } from 'react';

const statusColors = {
  'Applied': '#3b82f6',
  'Online Assessment': '#f59e0b',
  'Interview': '#8b5cf6',
  'Offer': '#10b981',
  'Rejected': '#ef4444'
};

export default function ApplicationTable({ applications, setApplications, onUpdate }) {
  const [selectedApp, setSelectedApp] = useState(null);

  const handleStatusChange = async (app, status) => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/applications/' + app.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ ...app, status })
    });
    const data = await res.json();
    setApplications(function(prev) { return prev.map(function(a) { return a.id === app.id ? data : a; }); });
    if (onUpdate) onUpdate();
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:5000/api/applications/' + id, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    setApplications(function(prev) { return prev.filter(function(a) { return a.id !== id; }); });
    if (onUpdate) onUpdate();
  };

  if (applications.length === 0) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#999', background: '#fff', borderRadius: '12px' }}>No applications yet. Add your first one above!</div>;
  }

  return (
    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8f9fa' }}>
            <th style={th}>Company</th>
            <th style={th}>Role</th>
            <th style={th}>Status</th>
            <th style={th}>Applied Date</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(function(app) {
            return (
              <tr key={app.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                <td style={td}>{app.company}</td>
                <td style={td}>{app.role}</td>
                <td style={td}>
                  <select
                    style={{ background: statusColors[app.status] || '#666', color: '#fff', border: 'none', borderRadius: '20px', padding: '0.3rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer' }}
                    value={app.status}
                    onChange={function(e) { handleStatusChange(app, e.target.value); }}>
                    <option>Applied</option>
                    <option>Online Assessment</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>
                </td>
                <td style={td}>{new Date(app.applied_date).toLocaleDateString()}</td>
                <td style={td}>
                  <button style={{ padding: '0.3rem 0.75rem', background: '#e0e7ff', color: '#4f46e5', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.85rem' }}
                    onClick={function() { setSelectedApp(app); }}>Notes</button>
                  <button style={{ padding: '0.3rem 0.75rem', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                    onClick={function() { handleDelete(app.id); }}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {selectedApp && (
        <NotesPanel application={selectedApp} onClose={function() { setSelectedApp(null); }} />
      )}
    </div>
  );
}

function NotesPanel({ application, onClose }) {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/notes/' + application.id, {
      headers: { 'Authorization': 'Bearer ' + token }
    }).then(function(r) { return r.json(); }).then(function(data) { setNotes(data.notes || []); });
  }, [application.id]);

  const handleAdd = async () => {
    if (!text.trim()) return;
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/notes/' + application.id, {
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
    const res = await fetch('http://localhost:5000/api/notes/' + application.id + '/' + noteId, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    setNotes(data.notes);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', width: '100%', maxWidth: '500px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>{application.company} — Notes</h3>
          <button style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }} onClick={onClose}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
          {notes.length === 0 && <p style={{ color: '#999', textAlign: 'center' }}>No notes yet!</p>}
          {notes.map(function(note) {
            return (
              <div key={note._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.75rem', background: '#f8f9fa', borderRadius: '8px', marginBottom: '0.5rem' }}>
                <span>{note.text}</span>
                <button style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }} onClick={function() { handleDelete(note._id); }}>✕</button>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input style={{ flex: 1, padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
            placeholder="Add a note..." value={text} onChange={function(e) { setText(e.target.value); }}
            onKeyDown={function(e) { if (e.key === 'Enter') handleAdd(); }} />
          <button style={{ padding: '0.6rem 1rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }} onClick={handleAdd}>Add</button>
        </div>
      </div>
    </div>
  );
}

function useEffect(fn, deps) {
  React.useEffect(fn, deps);
}

const th = { padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#444', fontSize: '0.9rem' };
const td = { padding: '0.75rem 1rem', fontSize: '0.95rem', color: '#333' };