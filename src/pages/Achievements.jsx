import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

export default function Achievements() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetch(API + '/achievements/user/' + user.id)
      .then(r => r.json())
      .then(d => { setList(d.achievements || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>;

  const unlocked = list.filter(a => a.unlocked).length;

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>🏆 Achievements</h1>
      <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>{unlocked} / {list.length} unlocked</p>

      <div style={{ height: 8, background: '#f1f5f9', borderRadius: 100, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ height: '100%', width: (list.length ? (unlocked / list.length * 100) : 0) + '%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {list.map(a => (
          <div key={a.code} className="card" style={{ padding: 16, textAlign: 'center', opacity: a.unlocked ? 1 : 0.45, background: a.unlocked ? 'white' : '#f8fafc' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>{a.icon}</div>
            <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{a.name}</p>
            <p style={{ fontSize: 11, color: '#94a3b8' }}>{a.desc}</p>
            {a.unlocked && <p style={{ fontSize: 10, color: '#22c55e', marginTop: 6, fontWeight: 700 }}>✓ Unlocked</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
