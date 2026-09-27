import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const username = user?.username || 'Guest';
  const classLevel = user?.class_level || user?.classLevel || 9;
  const xp = user?.xp || 0;
  const level = user?.level || 1;

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ background: 'linear-gradient(135deg, #0a1128 0%, #16224d 50%, #1e2d63 100%)', padding: '40px 16px 60px', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.4), transparent 70%)', filter: 'blur(40px)' }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 800, boxShadow: '0 8px 32px rgba(59,130,246,0.5)' }}>
            {username.charAt(0).toUpperCase()}
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{username}</h1>
          <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 16 }}>Class {classLevel} Student</p>
          <div style={{ display: 'inline-flex', gap: 6, padding: '6px 14px', borderRadius: 100, background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)', fontSize: 12, fontWeight: 600 }}>
            ⚡ Level {level} • {xp} XP
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: -30, position: 'relative', zIndex: 3 }}>
        <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: 16, marginBottom: 20 }}>
          {[
            { v: user?.streak || 0, l: 'Day Streak' },
            { v: 0, l: 'Questions Solved' },
            { v: 0, l: 'Tests Done' },
          ].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#3b82f6' }}>{s.v}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>📚 Subject Progress</h2>
        <div className="card" style={{ padding: 32, textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📊</div>
          <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Abhi tak kuch progress nahi</p>
          <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>Practice karo toh yahan progress dikhega</p>
          <Link to="/classes" className="btn btn-primary btn-sm">Start Learning</Link>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>🏆 Achievements</h2>
        <div className="card" style={{ padding: 32, textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎯</div>
          <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Koi achievement nahi</p>
          <p style={{ fontSize: 12, color: '#94a3b8' }}>Padhai karo aur unlock karo!</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <Link to="/notifications" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: 16, textDecoration: 'none' }}>🔔 Notifications</Link>
          <Link to="/friends" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: 16, textDecoration: 'none' }}>👥 Friends</Link>
          <button onClick={logout} className="btn" style={{ justifyContent: 'flex-start', padding: 16, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', cursor: 'pointer' }}>🚪 Logout</button>
        </div>
      </div>
    </div>
  );
}
