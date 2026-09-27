import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/admin.service';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminService.verify(password);
      sessionStorage.setItem('admin_password', password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Wrong password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a1128 0%, #16224d 50%, #1e2d63 100%)', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🔐</div>
          <h1 style={{ color: 'white', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Admin Access</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Enter admin password to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', marginBottom: 12, textAlign: 'center', letterSpacing: 2 }}
          />

          {error && (
            <div style={{ padding: 12, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, color: '#fca5a5', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
