import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import classService from '../services/class.service';

export default function Subjects() {
  const { classId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    classService.getSubjects(classId)
      .then((data) => {
        setSubjects(data.subjects || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [classId]);

  if (loading) return (
    <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto' }}></div>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
      <Link to="/classes" style={{ color: '#3b82f6', fontSize: 14, fontWeight: 600 }}>← Back</Link>
      <h1 style={{ fontSize: 26, fontWeight: 800, margin: '12px 0 20px' }}>Subjects</h1>

      {subjects.map((s) => (
        <Link key={s.id} to={`/subjects/${s.id}/chapters`} className="card"
          style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, marginBottom: 12, textDecoration: 'none', color: 'inherit' }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: s.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
            {s.emoji}
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, flex: 1 }}>{s.name}</span>
          <span style={{ color: '#94a3b8', fontSize: 20 }}>›</span>
        </Link>
      ))}
    </div>
  );
}
