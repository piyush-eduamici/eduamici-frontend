import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a1128 0%, #16224d 50%, #1e2d63 100%)', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 32 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24, textDecoration: 'none' }}>
          <img src="/logo.svg" alt="EduAmici" style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, fontSize: 22, color: 'white' }}>EduAmici</span>
        </Link>

        <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Welcome back</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24, fontSize: 14 }}>Login karo aur padhna continue karo</p>

        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="input" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', marginBottom: 12 }} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="input" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', marginBottom: 12 }} />

          {error && (
            <div style={{ padding: 12, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, color: '#fca5a5', fontSize: 13, marginBottom: 12 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 20, fontSize: 14 }}>
          Account nahi hai? <Link to="/register" style={{ color: '#60a5fa', fontWeight: 600 }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
