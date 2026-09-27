import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBook, FiEdit3, FiTarget, FiZap, FiUsers, FiAward, FiTrendingUp, FiFileText } from 'react-icons/fi';

const quickActions = [
  { icon: FiBook, label: 'Lectures', color: '#3b82f6', to: '/classes' },
  { icon: FiFileText, label: 'Notes', color: '#8b5cf6', to: '/notes' },
  { icon: FiEdit3, label: 'Practice', color: '#22c55e', to: '/practice' },
  { icon: FiTarget, label: 'Mock Tests', color: '#f59e0b', to: '/mock-tests' },
  { icon: FiZap, label: 'Quiz Battle', color: '#ec4899', to: '/quiz-battle' },
  { icon: FiAward, label: 'Achievements', color: '#10b981', to: '/achievements' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const xp = user?.xp || 0;
  const level = user?.level || 1;
  const nextLevelXP = level * 100;
  const progressPct = Math.min(100, Math.round((xp / nextLevelXP) * 100));

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
      <p className="text-light" style={{ fontSize: 14 }}>Welcome back,</p>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginTop: 2 }}>{user?.username || 'Student'} 👋</h1>

      {/* XP Card */}
      <div style={{
        background: 'var(--grad-hero)', borderRadius: 20, padding: 20, marginTop: 20,
        color: 'white', position: 'relative', overflow: 'hidden',
      }}>
        <div className="animate-float" style={{
          position: 'absolute', top: -50, right: -50,
          width: 150, height: 150, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.5), transparent 70%)',
          filter: 'blur(30px)',
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 13, opacity: 0.7 }}>Your XP</p>
              <p style={{ fontSize: 32, fontWeight: 800 }}>{xp}</p>
            </div>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--grad-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiZap size={28} />
            </div>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 100, overflow: 'hidden' }}>
            <div style={{ width: progressPct + '%', height: '100%', background: 'var(--grad-blue)', borderRadius: 100, transition: 'width 1s' }} />
          </div>
          <p style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
            Level {level} • {nextLevelXP - xp} XP to Level {level + 1}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 16 }}>
        {[
          { label: 'Streak', value: user?.streak || 0, unit: 'days', color: '#f59e0b' },
          { label: 'Solved', value: 0, unit: 'Qs', color: '#22c55e' },
          { label: 'Tests', value: 0, unit: 'done', color: '#3b82f6' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: 14, textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 4 }}>{s.label}</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 10, color: 'var(--text-light)' }}>{s.unit}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>⚡ Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {quickActions.map((a) => (
            <Link key={a.label} to={a.to} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, textDecoration: 'none', color: 'inherit' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: a.color + '18', color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <a.icon size={22} />
              </div>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Continue Learning - Empty State */}
      <div style={{ marginTop: 28 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Continue Learning</h2>
          <Link to="/classes" style={{ color: 'var(--blue-500)', fontSize: 13, fontWeight: 600 }}>Explore →</Link>
        </div>
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>📚</div>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Abhi tak kuch padha nahi</p>
          <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 16 }}>Class select karo aur padhna shuru karo</p>
          <Link to="/classes" className="btn btn-primary btn-sm">Start Learning</Link>
        </div>
      </div>

      {/* Explore */}
      <div style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>🔍 Explore More</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {[
            { icon: FiUsers, label: 'Friends', color: '#ec4899', to: '/friends' },
            { icon: FiAward, label: 'Achievements', color: '#f59e0b', to: '/achievements' },
            { icon: FiTrendingUp, label: 'Leaderboard', color: '#22c55e', to: '/leaderboard' },
            { icon: FiZap, label: 'Quiz Battle', color: '#8b5cf6', to: '/quiz-battle' },
          ].map((c) => (
            <Link key={c.label} to={c.to} className="card" style={{ padding: 14, textDecoration: 'none', color: 'inherit' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: c.color + '18', color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <c.icon size={18} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 600 }}>{c.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
