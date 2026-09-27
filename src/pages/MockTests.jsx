import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MockTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/tests')
      .then(r => r.json())
      .then(d => { setTests(d.tests || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>;

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>📝 Mock Tests</h1>
      <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>Real exam pattern practice</p>

      {tests.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ fontSize: 40, marginBottom: 8 }}>📝</p>
          <p style={{ color: '#94a3b8' }}>Abhi koi test nahi hai</p>
        </div>
      ) : (
        tests.map((t) => (
          <Link key={t.id} to={`/mock-tests/${t.id}`} className="card" style={{ display: 'block', padding: 20, marginBottom: 14, textDecoration: 'none', color: 'inherit' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>{t.title}</h2>
              <span style={{ background: '#dbeafe', color: '#1e40af', fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
                {t.duration_minutes}min
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>{t.description || 'Full syllabus test'}</p>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#94a3b8' }}>
              <span>📊 {t.total_questions} questions</span>
              <span>🎯 {t.total_marks} marks</span>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
