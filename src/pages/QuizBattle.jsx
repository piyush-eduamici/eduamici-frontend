import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

export default function QuizBattle() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('create');
  const [code, setCode] = useState('');
  const [mode, setMode] = useState('solo');
  const [qCount, setQCount] = useState(5);
  const [qTime, setQTime] = useState(30);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selClass, setSelClass] = useState(null);
  const [selSubject, setSelSubject] = useState(null);
  const [selChapter, setSelChapter] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const myClassLevel = user?.class_level || user?.classLevel;

  useEffect(() => {
    fetch(API + '/classes').then(r => r.json()).then(d => {
      const cls = d.classes || [];
      setClasses(cls);
      const myNum = myClassLevel ? parseInt(String(myClassLevel).replace(/\D/g, '')) : null;
      if (myNum) {
        const my = cls.find(c => c.name.includes(String(myNum)));
        if (my) setSelClass(my);
      }
    }).catch(() => {});
  }, [myClassLevel]);

  useEffect(() => {
    if (!selClass) return;
    fetch(API + '/subjects/class/' + selClass.id).then(r => r.json()).then(d => {
      setSubjects(d.subjects || []);
      setSelSubject(null);
      setChapters([]);
      setSelChapter(null);
    }).catch(() => {});
  }, [selClass]);

  useEffect(() => {
    if (!selSubject) return;
    fetch(API + '/chapters/subject/' + selSubject.id).then(r => r.json()).then(d => {
      setChapters(d.chapters || []);
      setSelChapter(null);
    }).catch(() => {});
  }, [selSubject]);

  const showMsg = (t) => { setMsg(t); setTimeout(() => setMsg(''), 2500); };

  const createRoom = async () => {
    if (!selChapter) return showMsg('⚠️ Chapter select karo');
    if (qTime < 10 || qTime > 300) return showMsg('⚠️ Time 10-300 sec ke beech hona chahiye');
    setLoading(true);
    try {
      const r = await fetch(API + '/quiz/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host_id: user.id, chapter_id: selChapter.id, mode, questions_count: qCount, time_per_question: qTime })
      });
      const d = await r.json();
      if (d.success) navigate('/quiz-room/' + d.room.id);
      else showMsg('❌ ' + d.message);
    } catch (e) { showMsg('❌ Server error'); }
    setLoading(false);
  };

  const joinRoom = async () => {
    if (!code.trim()) return showMsg('⚠️ Room code daalo');
    setLoading(true);
    try {
      const r = await fetch(API + '/quiz/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), user_id: user.id, team: 'B' })
      });
      const d = await r.json();
      if (d.success) navigate('/quiz-room/' + d.room.id);
      else showMsg('❌ ' + d.message);
    } catch (e) { showMsg('❌ Server error'); }
    setLoading(false);
  };

  const inputStyle = { width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 10, fontSize: 14, background: 'white' };
  const btnPrimary = { width: '100%', padding: 14, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' };

  const timePresets = [10, 15, 20, 30, 45, 60, 90, 120, 180, 300];

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>⚡ Quiz Battle</h1>
      <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>Challenge friends — same questions, same timer</p>

      {msg && <div style={{ padding: 12, borderRadius: 10, marginBottom: 12, background: '#fee2e2', color: '#b91c1c', fontSize: 13, fontWeight: 600 }}>{msg}</div>}

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, background: '#f1f5f9', padding: 4, borderRadius: 12 }}>
        {[{ id: 'create', label: '🎮 Create' }, { id: 'join', label: '🔗 Join' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: 10, borderRadius: 10, fontSize: 13, fontWeight: 700, background: tab === t.id ? 'white' : 'transparent', color: tab === t.id ? '#3b82f6' : '#64748b', border: 'none', cursor: 'pointer' }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'create' && (
        <div style={{ background: 'white', padding: 20, borderRadius: 16 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Mode</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[{ id: 'solo', label: '👤 Solo' }, { id: 'team', label: '👥 Team' }].map(m => (
              <button key={m.id} onClick={() => setMode(m.id)}
                style={{ flex: 1, padding: 12, borderRadius: 10, fontSize: 14, fontWeight: 700, background: mode === m.id ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : '#f1f5f9', color: mode === m.id ? 'white' : '#64748b', border: 'none', cursor: 'pointer' }}>
                {m.label}
              </button>
            ))}
          </div>

          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Class</h3>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 12 }}>
            {classes.map(c => (
              <button key={c.id} onClick={() => setSelClass(c)}
                style={{ padding: '10px 16px', borderRadius: 12, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', background: selClass?.id === c.id ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : '#f1f5f9', color: selClass?.id === c.id ? 'white' : '#64748b', border: 'none', cursor: 'pointer' }}>
                {c.emoji} {c.name}
              </button>
            ))}
          </div>

          {selClass && (
            <>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Subject</h3>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 12 }}>
                {subjects.map(s => (
                  <button key={s.id} onClick={() => setSelSubject(s)}
                    style={{ padding: '10px 16px', borderRadius: 12, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', background: selSubject?.id === s.id ? s.color : '#f1f5f9', color: selSubject?.id === s.id ? 'white' : '#64748b', border: 'none', cursor: 'pointer' }}>
                    {s.emoji} {s.name}
                  </button>
                ))}
              </div>
            </>
          )}

          {selSubject && (
            <>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Chapter</h3>
              <select value={selChapter?.id || ''} onChange={e => setSelChapter(chapters.find(c => c.id === parseInt(e.target.value)))} style={inputStyle}>
                <option value="">-- Select Chapter --</option>
                {chapters.map(c => <option key={c.id} value={c.id}>Ch {c.number}: {c.name}</option>)}
              </select>
            </>
          )}

          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginTop: 16, marginBottom: 8, textTransform: 'uppercase' }}>⚙️ Settings</h3>

          {/* Questions count */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 6, display: 'block' }}>
              Number of Questions
            </label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[3, 5, 10, 15, 20, 25, 30].map(n => (
                <button key={n} onClick={() => setQCount(n)}
                  style={{
                    padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                    background: qCount === n ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : '#f1f5f9',
                    color: qCount === n ? 'white' : '#64748b',
                    border: 'none', cursor: 'pointer', minWidth: 50,
                  }}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Time per question */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 6, display: 'block' }}>
              Time per Question: <span style={{ color: '#3b82f6', fontSize: 16 }}>{qTime} sec</span>
            </label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              {timePresets.map(t => (
                <button key={t} onClick={() => setQTime(t)}
                  style={{
                    padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                    background: qTime === t ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : '#f1f5f9',
                    color: qTime === t ? 'white' : '#64748b',
                    border: 'none', cursor: 'pointer', minWidth: 55,
                  }}>
                  {t}s
                </button>
              ))}
            </div>

            {/* Custom time input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: '#f8fafc', borderRadius: 10 }}>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 700, whiteSpace: 'nowrap' }}>Custom:</span>
              <input
                type="number"
                min={10}
                max={300}
                value={qTime}
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 0;
                  setQTime(v);
                }}
                style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16, fontWeight: 800, textAlign: 'center', color: '#3b82f6' }}
              />
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 700 }}>sec</span>
            </div>
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
              Min: 10 sec • Max: 300 sec (5 min)
            </p>
          </div>

          <button onClick={createRoom} disabled={loading} style={btnPrimary}>
            {loading ? 'Creating...' : '🎮 Create Room'}
          </button>
        </div>
      )}

      {tab === 'join' && (
        <div style={{ background: 'white', padding: 20, borderRadius: 16 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Room Code</h3>
          <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="ABC123"
            style={{ ...inputStyle, textAlign: 'center', fontSize: 24, fontWeight: 800, letterSpacing: 4 }} />
          <button onClick={joinRoom} disabled={loading} style={btnPrimary}>
            {loading ? 'Joining...' : '🔗 Join Room'}
          </button>
        </div>
      )}
    </div>
  );
}
