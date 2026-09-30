import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const r = await fetch(API + '/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const d = await r.json();
      if (d.success) {
        setDemoOtp(d.otp_demo || '');
        setStep(2);
      } else {
        setError(d.message);
      }
    } catch (e) {
      setError('Network error. Backend chal raha hai?');
    }
    setLoading(false);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const r = await fetch(API + '/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const d = await r.json();
      if (d.success) {
        setSuccess('Password reset successful! Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(d.message);
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'white',
    marginBottom: 12,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a1128 0%, #16224d 50%, #1e2d63 100%)', padding: 20 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 420, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 32 }}
      >
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24, textDecoration: 'none' }}>
          <img src="/logo.svg" alt="EduAmici" style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, fontSize: 22, color: 'white' }}>EduAmici</span>
        </Link>

        {step === 1 && (
          <>
            <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Forgot Password?</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24, fontSize: 14 }}>Email daalo — hum OTP bhejenge</p>
            <form onSubmit={handleSendOtp}>
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="input" style={inputStyle} required />
              {error && (
                <div style={{ padding: 12, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, color: '#fca5a5', fontSize: 13, marginBottom: 12 }}>{error}</div>
              )}
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }}>
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Enter OTP</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 16, fontSize: 14 }}>6-digit OTP daalo</p>
            {demoOtp && (
              <div style={{ padding: 12, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, color: '#86efac', fontSize: 12, marginBottom: 16 }}>
                <strong>Demo OTP:</strong> {demoOtp}
              </div>
            )}
            <form onSubmit={handleReset}>
              <input type="text" placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} className="input" style={{ ...inputStyle, textAlign: 'center', fontSize: 20, letterSpacing: 6, fontWeight: 800 }} required />
              <input type="password" placeholder="New password (min 6)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input" style={inputStyle} required />
              {error && (
                <div style={{ padding: 12, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, color: '#fca5a5', fontSize: 13, marginBottom: 12 }}>{error}</div>
              )}
              {success && (
                <div style={{ padding: 12, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, color: '#86efac', fontSize: 13, marginBottom: 12, fontWeight: 600 }}>{success}</div>
              )}
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}

        <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 20, fontSize: 14 }}>
          Yaad aaya? <Link to="/login" style={{ color: '#60a5fa', fontWeight: 600 }}>Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
