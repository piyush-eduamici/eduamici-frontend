import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const classes = [6, 7, 8, 9, 10];

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', class_level: 9 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.email || !form.password) { setError('All fields required'); return; }
    if (form.password.length < 6) { setError('Password min 6 characters'); return; }
    setLoading(true);
    try {
      await register(form);
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

        <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Create Account</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24, fontSize: 14 }}>Learn Together, Grow Together</p>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" value={form.username} onChange={(e) => handleChange('username', e.target.value)}
            className="input" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', marginBottom: 12 }} />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => handleChange('email', e.target.value)}
            className="input" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', marginBottom: 12 }} />
          <input type="password" placeholder="Password (min 6)" value={form.password} onChange={(e) => handleChange('password', e.target.value)}
            className="input" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', marginBottom: 12 }} />

          <div style={{ marginBottom: 12 }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 8 }}>Select Class</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {classes.map((c) => (
                <button key={c} type="button" onClick={() => handleChange('class_level', c)}
                  style={{ padding: '8px 16px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                    background: form.class_level === c ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.08)',
                    color: 'white', border: form.class_level === c ? '1px solid transparent' : '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}>
                  Class {c}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ padding: 12, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, color: '#fca5a5', fontSize: 13, marginBottom: 12 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 20, fontSize: 14 }}>
          Already have account? <Link to="/login" style={{ color: '#60a5fa', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
