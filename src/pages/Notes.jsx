import { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

export default function Notes() {
  const { chapterId } = useParams();
  const [searchParams] = useSearchParams();
  const cid = chapterId || searchParams.get('chapter');
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  // For list mode (no chapter selected)
  const [myClasses, setMyClasses] = useState([]);
  const [mySubjects, setMySubjects] = useState([]);
  const [myChapters, setMyChapters] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const myClassLevel = user?.class_level || user?.classLevel || null;

  // Load classes on mount
  useEffect(() => {
    fetch(API + '/classes').then(r => r.json()).then(d => {
      const cls = d.classes || [];
      setMyClasses(cls);
      // Auto-select user's class
      const myNum = myClassLevel ? parseInt(String(myClassLevel).replace(/\D/g, '')) : null;
      if (myNum) {
        const my = cls.find(c => c.name.includes(String(myNum)));
        if (my) setSelectedClass(my);
      }
    }).catch(() => {});
  }, [myClassLevel]);

  // Load subjects when class selected
  useEffect(() => {
    if (!selectedClass) return;
    fetch(API + '/subjects/class/' + selectedClass.id).then(r => r.json()).then(d => {
      setMySubjects(d.subjects || []);
      setSelectedSubject(null);
      setMyChapters([]);
    }).catch(() => {});
  }, [selectedClass]);

  // Load chapters when subject selected
  useEffect(() => {
    if (!selectedSubject) return;
    fetch(API + '/chapters/subject/' + selectedSubject.id).then(r => r.json()).then(d => {
      setMyChapters(d.chapters || []);
    }).catch(() => {});
  }, [selectedSubject]);

  // Load notes when chapter selected (via URL)
  useEffect(() => {
    if (!cid) { setLoading(false); return; }
    setLoading(true);
    fetch(API + '/notes/chapter/' + cid)
      .then(r => r.json())
      .then(d => { setNotes(d.notes || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [cid]);

  const typeColors = {
    short: { bg: '#eff6ff', color: '#1e40af', icon: '📝', label: 'Short Notes' },
    revision: { bg: '#f5f3ff', color: '#6b21a8', icon: '🔄', label: 'Revision' },
    formula: { bg: '#fef3c7', color: '#92400e', icon: '📐', label: 'Formula Sheet' },
    important: { bg: '#fee2e2', color: '#b91c1c', icon: '⭐', label: 'Important Points' },
  };

  // ========== CHAPTER MODE — show notes list ==========
  if (cid) {
    if (loading) return (
      <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto' }}></div>
      </div>
    );

    return (
      <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
        <Link to="/notes" style={{ color: '#3b82f6', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>← All Chapters</Link>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '12px 0 6px' }}>📚 Chapter Notes</h1>
        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>{notes.length} notes</p>

        {notes.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>📝</div>
            <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Is chapter mein notes nahi</p>
            <p style={{ fontSize: 13, color: '#94a3b8' }}>Jaldi hi add honge!</p>
          </div>
        ) : (
          notes.map((n) => {
            const t = typeColors[n.type] || typeColors.short;
            const isOpen = expanded === n.id;
            return (
              <div key={n.id} className="card" style={{ padding: 0, marginBottom: 12, overflow: 'hidden' }}>
                <button onClick={() => setExpanded(isOpen ? null : n.id)}
                  style={{ width: '100%', padding: 16, background: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: t.bg, color: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{t.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{n.title}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8' }}>{t.label}</p>
                  </div>
                  <span style={{ color: '#94a3b8', fontSize: 20, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
                </button>

                {isOpen && (
                  <div style={{ padding: '0 16px 16px' }}>
                    {n.image_url && <img src={n.image_url} alt={n.title} style={{ width: '100%', borderRadius: 12, marginBottom: 12 }} />}
                    <div style={{ background: '#f8fafc', borderRadius: 12, padding: 14, fontSize: 14, lineHeight: 1.7, color: '#334155', whiteSpace: 'pre-wrap' }}>
                      {n.content}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    );
  }

  // ========== LIST MODE — show classes/subjects/chapters ==========
  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>📚 Notes</h1>
      <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>
        Chapter-wise notes padho
      </p>

      {/* Class Selection */}
      <h2 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Class</h2>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 16 }}>
        {myClasses.map(c => (
          <button key={c.id} onClick={() => setSelectedClass(c)}
            style={{
              padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
              background: selectedClass?.id === c.id ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'white',
              color: selectedClass?.id === c.id ? 'white' : '#64748b',
              border: selectedClass?.id === c.id ? 'none' : '1px solid #e2e8f0',
              cursor: 'pointer',
            }}>
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      {/* Subject Selection */}
      {selectedClass && (
        <>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Subject</h2>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 16 }}>
            {mySubjects.map(s => (
              <button key={s.id} onClick={() => setSelectedSubject(s)}
                style={{
                  padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
                  background: selectedSubject?.id === s.id ? s.color : 'white',
                  color: selectedSubject?.id === s.id ? 'white' : '#64748b',
                  border: selectedSubject?.id === s.id ? 'none' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                }}>
                {s.emoji} {s.name}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Chapter List */}
      {selectedSubject && (
        <>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Chapters</h2>
          {myChapters.length === 0 ? (
            <div className="card" style={{ padding: 30, textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', fontSize: 13 }}>Koi chapter nahi</p>
            </div>
          ) : (
            myChapters.map(ch => (
              <Link key={ch.id} to={`/chapters/${ch.id}/notes`}
                className="card"
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, marginBottom: 10, textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 15 }}>
                  {ch.number}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700 }}>{ch.name}</p>
                  <p style={{ fontSize: 11, color: '#94a3b8' }}>Tap to view notes</p>
                </div>
                <span style={{ color: '#94a3b8', fontSize: 20 }}>›</span>
              </Link>
            ))
          )}
        </>
      )}

      {!selectedClass && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>📚</div>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Class select karo</p>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>Upar se apni class choose karo</p>
        </div>
      )}
    </div>
  );
}
