import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiBell, FiUser, FiLogOut, FiMessageCircle } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10,17,40,0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div className="container flex items-center justify-between" style={{ height: 60 }}>
        <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <img src="/logo.svg" alt="EduAmici" style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'contain' }} />
          <span className="text-white" style={{ fontWeight: 800, fontSize: 18 }}>EduAmici</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/chat" style={{ color: 'white' }}><FiMessageCircle size={20} /></Link>
              <Link to="/notifications" style={{ color: 'white' }}><FiBell size={20} /></Link>
              <Link to="/profile" style={{ color: 'white' }}><FiUser size={20} /></Link>
              <button onClick={handleLogout} style={{ color: 'white', display: 'flex' }}><FiLogOut size={20} /></button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
