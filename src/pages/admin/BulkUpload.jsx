import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function BulkUpload() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('chapters');
  const [subjects, setSubjects] = useState([]);
  const [selSubject, setSelSubject] = useState(null);
  const [selChapter, setSelChapter] = useState(null);
  const [chaptersText, setChaptersText] = useState('');
  const [questionsText, setQuestionsText] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const getPwd = () => sessionStorage.getItem('admin_password');

  const loadSubjects = async () => {
    try {
      const r = await fetch(API + '/bulk/subjects-chapters', {
        headers: { 'x-admin-password': getPwd() },
      });
      const d = await r.json();
      if (d.success) setSubjects(d.subjects || []);
    } catch (e) {}
  };

  useEffect(() => {
    if (!getPwd()) { navigate('/admin'); return; }
    loadSubjects();
  }, []);

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 4000);
  };

  const handleAddChapters = async () => {
    if (!selSubject) return showMsg('error', 'Subject select karo');
    const lines = chaptersText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return showMsg('error', 'Chapters likho — ek line mein ek');

    setLoading(true);
    try {
      const r = await fetch(API + '/bulk/chapters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': getPwd(),
        },
        body: JSON.stringify({ subject_id: selSubject.id, chapters: lines }),
      });
      const d = await r.json();
      if (d.success) {
        showMsg('success', `✅ ${d.added} chapters added!`);
        setChaptersText('');
        loadSubjects();
      } else {
        showMsg('error', d.message || 'Error');
      }
    } catch (e) {
      showMsg('error', 'Network error');
    }
    setLoading(false);
  };

  const handleAddQuestions = async () => {
    if (!selChapter) return showMsg('error', 'Chapter select karo');
    const lines = questionsText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return showMsg('error', 'Questions likho');

    const questions = [];
    const errors = [];

    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split('|').map(p => p.trim());
      if (parts.length < 6) {
        errors.push(`Line ${i + 1}: at least 6 parts chahiye`);
        continue;
      }
      questions.push({
        question_text: parts[0],
        option_a: parts[1],
        option_b: parts[2],
        option_c: parts[3],
        option_d: parts[4],
        correct_option: (parts[5] || 'A').toUpperCase(),
        explanation: parts[6] || '',
        difficulty: parts[7] || 'Easy',
      });
    }

    if (questions.length === 0) return showMsg('error', 'Valid questions nahi mile — format check karo');

    setLoading(true);
    try {
      const r = await fetch(API + '/bulk/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': getPwd(),
        },
        body: JSON.stringify({ chapter_id: selChapter.id, questions }),
      });
      const d = await r.json();
      if (d.success) {
        showMsg('success', `✅ ${d.added} questions added! (${d.failed || 0} failed)`);
        setQuestionsText('');
      } else {
        showMsg('error', d.message || 'Error');
      }
    } catch (e) {
      showMsg('error', 'Network error');
    }
    setLoading(false);
  };

  const inputStyle = { width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 10, fontSize: 14, background: 'white' };
  const btnPrimary = { width: '100%', padding: 14, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: 40 }}>
      <div style={{ background: 'linear-gradient(135deg, #0a1128, #1e2d63)', padding: '16px 20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800 }}>📦 Bulk Upload</h1>
          <p style={{ fontSize: 11, opacity: 0.7 }}>Chapters & Questions ek saath</p>
        </div>
        <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          ← Back
        </button>
      </div>

      <div style={{ display: 'flex', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        {[
          { id: 'chapters', label: '📚 Bulk Chapters' },
          { id: 'questions', label: '❓ Bulk Questions' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: 14, background: 'none', border: 'none', borderBottom: tab === t.id ? '3px solid #3b82f6' : '3px solid transparent', color: tab === t.id ? '#3b82f6' : '#64748b', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 20, maxWidth: 700, margin: '0 auto' }}>
        {msg.text && (
          <div style={{ padding: 12, borderRadius: 10, marginBottom: 16, background: msg.type === 'success' ? '#dcfce7' : '#fee2e2', color: msg.type === 'success' ? '#15803d' : '#b91c1c', fontSize: 14, fontWeight: 600 }}>
            {msg.text}
          </div>
        )}

        {/* ===== BULK CHAPTERS ===== */}
        {tab === 'chapters' && (
          <div style={{ background: 'white', padding: 20, borderRadius: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Add Multiple Chapters</h2>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
              Subject select karo → chapters line by line likho (auto-number ho jayega)
            </p>

            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>SUBJECT</label>
            <select style={inputStyle} value={selSubject?.id || ''} onChange={e => setSelSubject(subjects.find(s => s.id === parseInt(e.target.value)))}>
              <option value="">-- Subject select karo --</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.class_name} → {s.subject_name}</option>
              ))}
            </select>

            {selSubject && (
              <div style={{ background: '#f1f5f9', padding: 10, borderRadius: 8, marginBottom: 12, fontSize: 12 }}>
                <strong>Current chapters ({selSubject.chapters?.length || 0}):</strong>
                {selSubject.chapters?.length > 0 ? (
                  <ul style={{ marginTop: 6, paddingLeft: 20 }}>
                    {selSubject.chapters.map(c => <li key={c.id}>{c.number}. {c.name}</li>)}
                  </ul>
                ) : <p style={{ marginTop: 4, color: '#94a3b8' }}>Koi chapter nahi</p>}
              </div>
            )}

            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>CHAPTERS (ek line mein ek)</label>
            <textarea
              value={chaptersText}
              onChange={e => setChaptersText(e.target.value)}
              placeholder="Number Systems&#10;Polynomials&#10;Coordinate Geometry&#10;Linear Equations"
              style={{ ...inputStyle, minHeight: 200, fontFamily: 'monospace' }}
            />

            <button onClick={handleAddChapters} disabled={loading} style={btnPrimary}>
              {loading ? 'Adding...' : '➕ Add Chapters'}
            </button>
          </div>
        )}

        {/* ===== BULK QUESTIONS ===== */}
        {tab === 'questions' && (
          <div style={{ background: 'white', padding: 20, borderRadius: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Add Multiple Questions</h2>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
              Subject → Chapter select karo → questions paste karo
            </p>

            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>SUBJECT</label>
            <select style={inputStyle} value={selSubject?.id || ''} onChange={e => { setSelSubject(subjects.find(s => s.id === parseInt(e.target.value))); setSelChapter(null); }}>
              <option value="">-- Subject select karo --</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.class_name} → {s.subject_name}</option>
              ))}
            </select>

            {selSubject && (
              <>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>CHAPTER</label>
                <select style={inputStyle} value={selChapter?.id || ''} onChange={e => setSelChapter(selSubject.chapters.find(c => c.id === parseInt(e.target.value)))}>
                  <option value="">-- Chapter select karo --</option>
                  {selSubject.chapters.map(c => (
                    <option key={c.id} value={c.id}>{c.number}. {c.name}</option>
                  ))}
                </select>
              </>
            )}

            <div style={{ background: '#fef3c7', padding: 12, borderRadius: 8, marginBottom: 12, fontSize: 12, color: '#92400e' }}>
              <strong>Format (pipe `|` se alag):</strong>
              <br />
              Question | A | B | C | D | Correct | Explanation | Difficulty
              <br /><br />
              <strong>Example:</strong>
              <br />
              What is 2+2? | 3 | 4 | 5 | 6 | B | Basic addition | Easy
              <br />
              Which is prime? | 4 | 6 | 7 | 9 | C | 7 is prime | Easy
            </div>

            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>QUESTIONS (ek line mein ek)</label>
            <textarea
              value={questionsText}
              onChange={e => setQuestionsText(e.target.value)}
              placeholder="What is 2+2? | 3 | 4 | 5 | 6 | B | Basic addition | Easy&#10;Which is prime? | 4 | 6 | 7 | 9 | C | 7 is prime | Easy"
              style={{ ...inputStyle, minHeight: 250, fontFamily: 'monospace', fontSize: 12 }}
            />

            <button onClick={handleAddQuestions} disabled={loading} style={btnPrimary}>
              {loading ? 'Adding...' : '➕ Add Questions'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
