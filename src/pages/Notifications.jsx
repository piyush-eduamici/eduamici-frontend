import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    fetch('http://localhost:5000/api/notifications/user/' + user.id)
      .then(r => r.json())
      .then(d => { setNotifs(d.notifications || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto' }}></div>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>🔔 Notifications</h1>
      <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>
        {notifs.length} notifications
      </p>

      {notifs.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🔔</div>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Abhi koi notification nahi</p>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>Activity karne pe yahan updates aayenge</p>
        </div>
      ) : (
        notifs.map(n => (
          <div key={n.id} className="card" style={{ display: 'flex', gap: 12, padding: 14, marginBottom: 10, background: n.read ? 'white' : '#eff6ff', border: n.read ? '1px solid #f1f5f9' : '1px solid #bfdbfe' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              {n.icon || '🔔'}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: n.read ? 500 : 700, lineHeight: 1.4, marginBottom: 4 }}>{n.title}</p>
              <p style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(n.created_at).toLocaleString()}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
