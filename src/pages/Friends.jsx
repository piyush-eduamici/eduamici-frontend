import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Friends() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user: me } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/messages/users')
      .then(r => r.json())
      .then(d => {
        setUsers((d.users || []).filter(u => u.id !== me?.id));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [me]);

  const filtered = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto' }}></div>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>👥 Students</h1>
      <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>
        {users.length} students on StudyHub
      </p>

      <input className="input" placeholder="🔍 Search by username..."
        value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 16 }} />

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>👥</div>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Koi student nahi mila</p>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>Dost ko invite karo — wo register karega toh yahan dikhega</p>
        </div>
      ) : (
        filtered.map(u => (
          <div key={u.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, marginBottom: 10 }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 18 }}>
              {u.username.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700 }}>{u.username}</p>
              <p style={{ fontSize: 11, color: '#94a3b8' }}>Class {u.class_level}</p>
            </div>
            <button onClick={() => navigate('/chat/' + u.id)}
              style={{ padding: '8px 14px', borderRadius: 10, background: '#eff6ff', color: '#3b82f6', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              💬 Chat
            </button>
          </div>
        ))
      )}
    </div>
  );
}
