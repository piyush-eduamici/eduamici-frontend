import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiFileText, FiEdit3, FiAward } from 'react-icons/fi';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: FiHome },
  { path: '/classes', label: 'Learn', icon: FiBook },
  { path: '/notes', label: 'Notes', icon: FiFileText },
  { path: '/practice', label: 'Practice', icon: FiEdit3 },
  { path: '/leaderboard', label: 'Ranks', icon: FiAward },
];

const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: 64,
      background: 'rgba(10,17,40,0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {navItems.map(({ path, label, icon: Icon }) => {
        const active = pathname === path || pathname.startsWith(path + '/');
        return (
          <Link key={path} to={path} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            color: active ? 'var(--blue-400)' : 'rgba(255,255,255,0.55)',
            transition: 'all 0.2s ease',
            padding: '6px 10px', borderRadius: 12,
            background: active ? 'rgba(59,130,246,0.12)' : 'transparent',
          }}>
            <Icon size={19} />
            <span style={{ fontSize: 10, fontWeight: 600 }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
