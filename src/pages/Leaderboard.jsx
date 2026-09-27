import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: me } = useAuth();

  useEffect(() => {
    fetch('http://localhost:5000/api/leaderboard')
      .then(r => r.json())
      .then(d => { setUsers(d.leaderboard || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto' }}></div>
    </div>
  );

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>🏆 Leaderboard</h1>
      <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>
        Top students by XP
      </p>

      {users.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🥇</div>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Abhi koi student nahi</p>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>Pehla bano — dost ko invite karo!</p>
        </div>
      ) : (
        <>
          {top3.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 8, marginBottom: 24, paddingTop: 10 }}>
              {[1, 0, 2].map((idx) => {
                const u = top3[idx];
                if (!u) return null;
                const isFirst = idx === 0;
                const size = isFirst ? 72 : 60;
                const medal = ['🥇', '🥈', '🥉'][idx];
                const bg = ['linear-gradient(135deg, #f59e0b, #d97706)', 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 'linear-gradient(135deg, #cd7f32, #a86128)'][idx];
                return (
                  <div key={u.id} style={{ textAlign: 'center', flex: 1, marginBottom: isFirst ? 20 : 0 }}>
                    <div style={{ fontSize: isFirst ? 44 : 36, marginBottom: 6 }}>{medal}</div>
                    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: isFirst ? 26 : 22 }}>
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                    <p style={{ fontSize: isFirst ? 13 : 12, fontWeight: 700, marginBottom: 2 }}>{u.username}</p>
                    <p style={{ fontSize: 11, color: '#3b82f6', fontWeight: 700 }}>{u.xp} XP</p>
                  </div>
                );
              })}
            </div>
          )}

          {rest.map((u, i) => (
            <div key={u.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, marginBottom: 10, background: me?.id === u.id ? '#eff6ff' : 'white', border: me?.id === u.id ? '1px solid #bfdbfe' : '1px solid #f1f5f9' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#64748b' }}>
                {i + 4}
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 16 }}>
                {u.username.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700 }}>{u.username} {me?.id === u.id ? ' (You)' : ''}</p>
                <p style={{ fontSize: 11, color: '#94a3b8' }}>Class {u.class_level}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#3b82f6' }}>{u.xp}</p>
                <p style={{ fontSize: 10, color: '#94a3b8' }}>XP</p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
