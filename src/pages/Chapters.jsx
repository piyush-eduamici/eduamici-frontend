import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import classService from '../services/class.service';

export default function Chapters() {
  const { subjectId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    classService.getChapters(subjectId)
      .then((data) => {
        setChapters(data.chapters || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [subjectId]);

  if (loading) return (
    <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto' }}></div>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
      <Link to="/classes" style={{ color: '#3b82f6', fontSize: 14, fontWeight: 600 }}>← Back</Link>
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: '12px 0 4px' }}>Chapters</h1>
      <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>{chapters.length} chapters</p>

      {chapters.map((ch) => (
        <Link key={ch.id} to={`/chapters/${ch.id}/lectures`} className="card"
          style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, marginBottom: 12, textDecoration: 'none', color: 'inherit' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
            {ch.number}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{ch.name}</h3>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>
              {ch.lectures_count} lectures • {ch.questions_count} questions
            </p>
          </div>
          <span style={{ color: '#94a3b8', fontSize: 20 }}>›</span>
        </Link>
      ))}
    </div>
  );
}
