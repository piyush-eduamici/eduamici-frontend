import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/admin.service';

const LEVELS = [
  { id: 1, name: '🟢 Level 1 — Foundation' },
  { id: 2, name: '🟡 Level 2 — Exam Practice' },
  { id: 3, name: '🔴 Level 3 — Advanced' },
];

const CATEGORIES = {
  1: [
    { id: 'easy_objective', name: '1.1 Easy Objective', type: 'objective' },
    { id: 'easy_subjective', name: '1.2 Easy Subjective', type: 'subjective' },
    { id: 'explain_concept', name: '1.3 Explain Concept', type: 'subjective' },
  ],
  2: [
    { id: 'moderate_objective', name: '2.1 Moderate Objective', type: 'objective' },
    { id: 'moderate_subjective', name: '2.2 Moderate Subjective', type: 'subjective' },
    { id: 'application', name: '2.3 Application', type: 'subjective' },
  ],
  3: [
    { id: 'advanced_objective', name: '3.1 Advanced Objective', type: 'objective' },
    { id: 'advanced_subjective', name: '3.2 Advanced Subjective', type: 'subjective' },
    { id: 'case_study', name: '3.3 Case Study', type: 'case_study' },
  ],
};

const OBJECTIVE_TYPES = [
  { id: 'mcq', name: 'MCQ' },
  { id: 'fill_blank', name: 'Fill in the blank' },
  { id: 'true_false', name: 'True/False' },
  { id: 'one_word', name: 'One-word' },
  { id: 'assertion_reason', name: 'Assertion-Reason' },
];

const NOTE_TYPES = [
  { id: 'short', name: 'Short Notes' },
  { id: 'revision', name: 'Revision Notes' },
  { id: 'formula', name: 'Formula Sheet' },
  { id: 'important', name: 'Important Points' },
];

// Cascading chapter selector
function ChapterSelector({ onSelect }) {
  const [boards, setBoards] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [sel, setSel] = useState({ board: '', cls: '', subj: '', chap: '' });

  useEffect(() => {
    adminService.getBoards().then(d => setBoards(d.boards || [])).catch(() => {});
  }, []);

  const loadClasses = async (boardId) => {
    setSel({ board: boardId, cls: '', subj: '', chap: '' });
    setClasses([]); setSubjects([]); setChapters([]);
    onSelect('');
    if (boardId) {
      const d = await adminService.getClassesByBoard(boardId);
      setClasses(d.classes || []);
    }
  };

  const loadSubjects = async (classId) => {
    setSel(s => ({ ...s, cls: classId, subj: '', chap: '' }));
    setSubjects([]); setChapters([]);
    onSelect('');
    if (classId) {
      const d = await adminService.getSubjectsByClass(classId);
      setSubjects(d.subjects || []);
    }
  };

  const loadChapters = async (subjectId) => {
    setSel(s => ({ ...s, subj: subjectId, chap: '' }));
    setChapters([]);
    onSelect('');
    if (subjectId) {
      const d = await adminService.getChaptersBySubject(subjectId);
      setChapters(d.chapters || []);
    }
  };

  const inputStyle = { width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 8, fontSize: 14, background: 'white' };
  const labelStyle = { fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4, display: 'block', textTransform: 'uppercase' };

  return (
    <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, marginBottom: 16 }}>
      <label style={labelStyle}>Board</label>
      <select value={sel.board} onChange={(e) => loadClasses(e.target.value)} style={inputStyle} required>
        <option value="">-- Select Board --</option>
        {boards.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
      </select>

      <label style={labelStyle}>Class</label>
      <select value={sel.cls} onChange={(e) => loadSubjects(e.target.value)} style={inputStyle} disabled={!sel.board} required>
        <option value="">-- Select Class --</option>
        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <label style={labelStyle}>Subject</label>
      <select value={sel.subj} onChange={(e) => loadChapters(e.target.value)} style={inputStyle} disabled={!sel.cls} required>
        <option value="">-- Select Subject --</option>
        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      <label style={labelStyle}>Chapter</label>
      <select value={sel.chap} onChange={(e) => { setSel(s => ({ ...s, chap: e.target.value })); onSelect(e.target.value); }} style={{ ...inputStyle, marginBottom: 0 }} disabled={!sel.subj} required>
        <option value="">-- Select Chapter --</option>
        {chapters.map(c => <option key={c.id} value={c.id}>Ch {c.number}: {c.name}</option>)}
      </select>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('structure');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState({ level: 1, category: 'easy_objective' });
  const [isPyq, setIsPyq] = useState(false);
  const navigate = useNavigate();

  // Structure lists
  const [boards, setBoards] = useState([]);
  const [classesAll, setClassesAll] = useState([]);
  const [subjectsAll, setSubjectsAll] = useState([]);
  const [chaptersAll, setChaptersAll] = useState([]);
  const [structView, setStructView] = useState('boards');

  // Forms
  const [bForm, setBForm] = useState({ name: '', slug: '', description: '' });
  const [cForm, setCForm] = useState({ board_id: '', name: '', tagline: '', color: '#3b82f6', emoji: '📘' });
  const [sForm, setSForm] = useState({ class_id: '', name: '', slug: '', color: '#3b82f6', emoji: '📚' });
  const [chForm, setChForm] = useState({ subject_id: '', number: 1, name: '' });

  const [qForm, setQForm] = useState({
    chapter_id: '', level: 1, category: 'easy_objective', question_type: 'mcq',
    question_text: '', option_a: '', option_b: '', option_c: '', option_d: '',
    correct_option: 'A', answer_text: '', case_passage: '',
    explanation: '', difficulty: 'Easy', marks: 1,
    exam_year: '', exam_board: '', is_pyq: false,
  });

  const [nForm, setNForm] = useState({ chapter_id: '', title: '', content: '', type: 'short', image_url: '' });
  const [lForm, setLForm] = useState({ chapter_id: '', title: '', teacher: '', duration: '', description: '', youtube_id: '', video_url: '' });

  useEffect(() => {
    if (!sessionStorage.getItem('admin_password')) { navigate('/admin'); return; }
    loadAll();
  }, [navigate]);

  const loadAll = async () => {
    adminService.getQuestions().then(d => setQuestions(d.questions || [])).catch(() => {});
    adminService.getBoards().then(d => setBoards(d.boards || [])).catch(() => {});
    adminService.getClassesAll().then(d => setClassesAll(d.classes || [])).catch(() => {});
    adminService.getSubjectsAll().then(d => setSubjectsAll(d.subjects || [])).catch(() => {});
    adminService.getChaptersAll().then(d => setChaptersAll(d.chapters || [])).catch(() => {});
  };

  const showMsg = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type: '', text: '' }), 3000); };

  const handleStructureAdd = async (type) => {
    try {
      if (type === 'board') { await adminService.addBoard(bForm); setBForm({ name: '', slug: '', description: '' }); }
      if (type === 'class') { await adminService.addClass(cForm); setCForm({ board_id: '', name: '', tagline: '', color: '#3b82f6', emoji: '📘' }); }
      if (type === 'subject') { await adminService.addSubject(sForm); setSForm({ class_id: '', name: '', slug: '', color: '#3b82f6', emoji: '📚' }); }
      if (type === 'chapter') { await adminService.addChapter(chForm); setChForm({ subject_id: '', number: 1, name: '' }); }
      showMsg('success', '✅ Added!');
      loadAll();
    } catch (err) { showMsg('error', '❌ ' + err.message); }
  };

  const handleDelete = async (type, id, name) => {
    if (!confirm(`Delete "${name}"?\n\n⚠️ Iss se iske andar ka saara content bhi delete ho jayega!`)) return;
    try {
      if (type === 'board') await adminService.deleteBoard(id);
      if (type === 'class') await adminService.deleteClass(id);
      if (type === 'subject') await adminService.deleteSubject(id);
      if (type === 'chapter') await adminService.deleteChapter(id);
      showMsg('success', `✅ ${type} deleted!`);
      loadAll();
    } catch (err) { showMsg('error', '❌ ' + err.message); }
  };

  const handleQSubmit = async (e) => {
    e.preventDefault();
    if (!qForm.chapter_id) return showMsg('error', '❌ Chapter select karo');
    try {
      await adminService.addQuestion(qForm);
      showMsg('success', '✅ Question added!');
      setQForm({ ...qForm, question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', answer_text: '', case_passage: '', explanation: '' });
      loadAll();
    } catch (err) { showMsg('error', '❌ ' + err.message); }
  };

  const handleNSubmit = async (e) => {
    e.preventDefault();
    if (!nForm.chapter_id) return showMsg('error', '❌ Chapter select karo');
    try {
      await adminService.addNote(nForm);
      showMsg('success', '✅ Note added!');
      setNForm({ ...nForm, chapter_id: '', title: '', content: '', image_url: '' });
    } catch (err) { showMsg('error', '❌ ' + err.message); }
  };

  const handleLSubmit = async (e) => {
    e.preventDefault();
    if (!lForm.chapter_id) return showMsg('error', '❌ Chapter select karo');
    try {
      await adminService.addLecture(lForm);
      showMsg('success', '✅ Lecture added!');
      setLForm({ ...lForm, chapter_id: '', title: '', teacher: '', duration: '', description: '', youtube_id: '', video_url: '' });
    } catch (err) { showMsg('error', '❌ ' + err.message); }
  };

  const currentCat = CATEGORIES[filter.level].find(c => c.id === filter.category);
  const isObjective = currentCat?.type === 'objective';
  const isCaseStudy = currentCat?.type === 'case_study';
  const isSubjective = currentCat?.type === 'subjective';

  const inputStyle = { width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 10, fontSize: 14, background: 'white' };
  const btnPrimary = { width: '100%', padding: 14, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: 40 }}>
      <div style={{ background: 'linear-gradient(135deg, #0a1128, #1e2d63)', padding: '16px 20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800 }}>⚙️ Admin Panel</h1>
          <p style={{ fontSize: 11, opacity: 0.7 }}>Content Manager</p>
        </div>
        <button onClick={() => { sessionStorage.removeItem('admin_password'); navigate('/admin'); }} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Logout</button>
      </div>

      <div style={{ display: 'flex', background: 'white', borderBottom: '1px solid #e2e8f0', overflowX: 'auto' }}>
        {[
          { id: 'structure', label: '📂 Structure' },
          { id: 'question', label: '❓ Question' },
          { id: 'note', label: '📝 Note' },
          { id: 'lecture', label: '🎥 Lecture' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, minWidth: 90, padding: 14, background: 'none', border: 'none', borderBottom: tab === t.id ? '3px solid #3b82f6' : '3px solid transparent', color: tab === t.id ? '#3b82f6' : '#64748b', fontWeight: 700, fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 20, maxWidth: 700, margin: '0 auto' }}>
        {msg.text && <div style={{ padding: 12, borderRadius: 10, marginBottom: 16, background: msg.type === 'success' ? '#dcfce7' : '#fee2e2', color: msg.type === 'success' ? '#15803d' : '#b91c1c', fontSize: 14, fontWeight: 600 }}>{msg.text}</div>}

        {/* ========== STRUCTURE TAB ========== */}
        {tab === 'structure' && (
          <div>
            {/* Sub tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, background: '#f1f5f9', padding: 4, borderRadius: 12 }}>
              {[
                { id: 'boards', label: `🏛️ Boards (${boards.length})` },
                { id: 'classes', label: `🎓 Classes (${classesAll.length})` },
                { id: 'subjects', label: `📚 Subjects (${subjectsAll.length})` },
                { id: 'chapters', label: `📄 Chapters (${chaptersAll.length})` },
              ].map(t => (
                <button key={t.id} onClick={() => setStructView(t.id)}
                  style={{ flex: 1, padding: 8, borderRadius: 10, fontSize: 11, fontWeight: 700, background: structView === t.id ? 'white' : 'transparent', color: structView === t.id ? '#3b82f6' : '#64748b', border: 'none', cursor: 'pointer', boxShadow: structView === t.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', whiteSpace: 'nowrap' }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* BOARDS */}
            {structView === 'boards' && (
              <>
                <div style={{ background: 'white', padding: 16, borderRadius: 16, marginBottom: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>➕ Add Board</h3>
                  <input placeholder="Board name" value={bForm.name} onChange={e => setBForm({ ...bForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} style={inputStyle} />
                  <button onClick={() => handleStructureAdd('board')} style={btnPrimary}>Add Board</button>
                </div>

                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Existing Boards</h3>
                {boards.map(b => (
                  <div key={b.id} style={{ background: 'white', padding: 14, borderRadius: 12, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700 }}>🏛️ {b.name}</p>
                      <p style={{ fontSize: 11, color: '#94a3b8' }}>slug: {b.slug}</p>
                    </div>
                    <button onClick={() => handleDelete('board', b.id, b.name)} style={{ background: '#fee2e2', color: '#b91c1c', padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>🗑️ Delete</button>
                  </div>
                ))}
              </>
            )}

            {/* CLASSES */}
            {structView === 'classes' && (
              <>
                <div style={{ background: 'white', padding: 16, borderRadius: 16, marginBottom: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>➕ Add Class</h3>
                  <select value={cForm.board_id} onChange={e => setCForm({ ...cForm, board_id: e.target.value })} style={inputStyle}>
                    <option value="">Select Board</option>
                    {boards.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                  <input placeholder="Class name (Class 11)" value={cForm.name} onChange={e => setCForm({ ...cForm, name: e.target.value })} style={inputStyle} />
                  <input placeholder="Tagline (Foundation Builder)" value={cForm.tagline} onChange={e => setCForm({ ...cForm, tagline: e.target.value })} style={inputStyle} />
                  <input placeholder="Emoji" value={cForm.emoji} onChange={e => setCForm({ ...cForm, emoji: e.target.value })} style={inputStyle} />
                  <button onClick={() => handleStructureAdd('class')} style={btnPrimary}>Add Class</button>
                </div>

                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Existing Classes</h3>
                {classesAll.map(c => (
                  <div key={c.id} style={{ background: 'white', padding: 14, borderRadius: 12, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700 }}>{c.emoji || '🎓'} {c.name}</p>
                      <p style={{ fontSize: 11, color: '#94a3b8' }}>Board: {c.board_name || 'None'}</p>
                    </div>
                    <button onClick={() => handleDelete('class', c.id, c.name)} style={{ background: '#fee2e2', color: '#b91c1c', padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>🗑️ Delete</button>
                  </div>
                ))}
              </>
            )}

            {/* SUBJECTS */}
            {structView === 'subjects' && (
              <>
                <div style={{ background: 'white', padding: 16, borderRadius: 16, marginBottom: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>➕ Add Subject</h3>
                  <select value={sForm.class_id} onChange={e => setSForm({ ...sForm, class_id: e.target.value })} style={inputStyle}>
                    <option value="">Select Class</option>
                    {classesAll.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <input placeholder="Subject name" value={sForm.name} onChange={e => setSForm({ ...sForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} style={inputStyle} />
                  <input placeholder="Emoji" value={sForm.emoji} onChange={e => setSForm({ ...sForm, emoji: e.target.value })} style={inputStyle} />
                  <button onClick={() => handleStructureAdd('subject')} style={btnPrimary}>Add Subject</button>
                </div>

                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Existing Subjects</h3>
                {subjectsAll.map(s => (
                  <div key={s.id} style={{ background: 'white', padding: 14, borderRadius: 12, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700 }}>{s.emoji || '📚'} {s.name}</p>
                      <p style={{ fontSize: 11, color: '#94a3b8' }}>Class: {s.class_name || 'None'}</p>
                    </div>
                    <button onClick={() => handleDelete('subject', s.id, s.name)} style={{ background: '#fee2e2', color: '#b91c1c', padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>🗑️ Delete</button>
                  </div>
                ))}
              </>
            )}

            {/* CHAPTERS */}
            {structView === 'chapters' && (
              <>
                <div style={{ background: 'white', padding: 16, borderRadius: 16, marginBottom: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>➕ Add Chapter</h3>
                  <select value={chForm.subject_id} onChange={e => setChForm({ ...chForm, subject_id: e.target.value })} style={inputStyle}>
                    <option value="">Select Subject</option>
                    {subjectsAll.map(s => <option key={s.id} value={s.id}>{s.class_name} → {s.name}</option>)}
                  </select>
                  <input type="number" placeholder="Chapter number" value={chForm.number} onChange={e => setChForm({ ...chForm, number: parseInt(e.target.value) || 1 })} style={inputStyle} />
                  <input placeholder="Chapter name" value={chForm.name} onChange={e => setChForm({ ...chForm, name: e.target.value })} style={inputStyle} />
                  <button onClick={() => handleStructureAdd('chapter')} style={btnPrimary}>Add Chapter</button>
                </div>

                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Existing Chapters ({chaptersAll.length})</h3>
                {chaptersAll.map(c => (
                  <div key={c.id} style={{ background: 'white', padding: 14, borderRadius: 12, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}>Ch {c.number}: {c.name}</p>
                      <p style={{ fontSize: 10, color: '#94a3b8' }}>{c.class_name} → {c.subject_name}</p>
                    </div>
                    <button onClick={() => handleDelete('chapter', c.id, c.name)} style={{ background: '#fee2e2', color: '#b91c1c', padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', marginLeft: 8 }}>🗑️</button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ========== QUESTION TAB ========== */}
        {tab === 'question' && (
          <form onSubmit={handleQSubmit} style={{ background: 'white', padding: 20, borderRadius: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, background: isPyq ? '#fef3c7' : '#f1f5f9', borderRadius: 10, marginBottom: 16, cursor: 'pointer' }}>
              <input type="checkbox" checked={isPyq} onChange={e => { setIsPyq(e.target.checked); setQForm({ ...qForm, is_pyq: e.target.checked }); }} />
              <span style={{ fontWeight: 700, fontSize: 13 }}>📅 Mark as PYQ</span>
            </label>

            {isPyq && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input type="number" placeholder="Year" value={qForm.exam_year} onChange={e => setQForm({ ...qForm, exam_year: e.target.value })} style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
                <input placeholder="Board" value={qForm.exam_board} onChange={e => setQForm({ ...qForm, exam_board: e.target.value })} style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
              </div>
            )}

            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>SELECT CHAPTER</h3>
            <ChapterSelector onSelect={(chapId) => setQForm({ ...qForm, chapter_id: chapId })} />

            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginTop: 12, marginBottom: 6 }}>Level</h3>
            <div style={{ display: 'grid', gap: 6, marginBottom: 10 }}>
              {LEVELS.map(l => (
                <button type="button" key={l.id} onClick={() => { const fc = CATEGORIES[l.id][0]; setFilter({ level: l.id, category: fc.id }); setQForm({ ...qForm, level: l.id, category: fc.id, question_type: fc.type === 'objective' ? 'mcq' : fc.type === 'case_study' ? 'case_study' : 'short_answer' }); }}
                  style={{ padding: 10, borderRadius: 10, border: filter.level === l.id ? '2px solid #3b82f6' : '1px solid #e2e8f0', background: filter.level === l.id ? '#eff6ff' : 'white', textAlign: 'left', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>{l.name}</button>
              ))}
            </div>

            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginTop: 12, marginBottom: 6 }}>Category</h3>
            <div style={{ display: 'grid', gap: 6, marginBottom: 10 }}>
              {CATEGORIES[filter.level].map(c => (
                <button type="button" key={c.id} onClick={() => { setFilter({ ...filter, category: c.id }); setQForm({ ...qForm, category: c.id, question_type: c.type === 'objective' ? 'mcq' : c.type === 'case_study' ? 'case_study' : 'short_answer' }); }}
                  style={{ padding: 10, borderRadius: 10, border: filter.category === c.id ? '2px solid #8b5cf6' : '1px solid #e2e8f0', background: filter.category === c.id ? '#f5f3ff' : 'white', textAlign: 'left', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>{c.name}</button>
              ))}
            </div>

            {isObjective && (
              <select value={qForm.question_type} onChange={e => setQForm({ ...qForm, question_type: e.target.value })} style={inputStyle}>
                {OBJECTIVE_TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            )}

            <textarea placeholder="Question text..." value={qForm.question_text} onChange={e => setQForm({ ...qForm, question_text: e.target.value })} style={{ ...inputStyle, minHeight: 80 }} required />

            {isObjective && qForm.question_type !== 'true_false' && (
              <>
                <input placeholder="Option A" value={qForm.option_a} onChange={e => setQForm({ ...qForm, option_a: e.target.value })} style={inputStyle} required />
                <input placeholder="Option B" value={qForm.option_b} onChange={e => setQForm({ ...qForm, option_b: e.target.value })} style={inputStyle} required />
                <input placeholder="Option C" value={qForm.option_c} onChange={e => setQForm({ ...qForm, option_c: e.target.value })} style={inputStyle} required />
                <input placeholder="Option D" value={qForm.option_d} onChange={e => setQForm({ ...qForm, option_d: e.target.value })} style={inputStyle} required />
                <select value={qForm.correct_option} onChange={e => setQForm({ ...qForm, correct_option: e.target.value })} style={inputStyle}>
                  <option value="A">Correct: A</option><option value="B">Correct: B</option><option value="C">Correct: C</option><option value="D">Correct: D</option>
                </select>
              </>
            )}

            {isObjective && qForm.question_type === 'true_false' && (
              <select value={qForm.correct_option} onChange={e => setQForm({ ...qForm, correct_option: e.target.value })} style={inputStyle}>
                <option value="True">True</option><option value="False">False</option>
              </select>
            )}

            {(isCaseStudy || isSubjective) && (
              <>
                {isCaseStudy && <textarea placeholder="Case passage..." value={qForm.case_passage} onChange={e => setQForm({ ...qForm, case_passage: e.target.value })} style={{ ...inputStyle, minHeight: 100 }} required />}
                <textarea placeholder="Answer text..." value={qForm.answer_text} onChange={e => setQForm({ ...qForm, answer_text: e.target.value })} style={{ ...inputStyle, minHeight: 100 }} required />
              </>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <select value={qForm.marks} onChange={e => setQForm({ ...qForm, marks: parseInt(e.target.value) })} style={{ ...inputStyle, flex: 1, marginBottom: 0 }}>
                <option value={1}>Marks: 1</option><option value={2}>Marks: 2</option><option value={3}>Marks: 3</option><option value={5}>Marks: 5</option>
              </select>
              <select value={qForm.difficulty} onChange={e => setQForm({ ...qForm, difficulty: e.target.value })} style={{ ...inputStyle, flex: 1, marginBottom: 0 }}>
                <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
              </select>
            </div>

            <textarea placeholder="Explanation..." value={qForm.explanation} onChange={e => setQForm({ ...qForm, explanation: e.target.value })} style={{ ...inputStyle, minHeight: 60, marginTop: 10 }} />

            <button type="submit" style={btnPrimary}>➕ Add Question</button>
          </form>
        )}

        {/* ========== NOTES TAB ========== */}
        {tab === 'note' && (
          <form onSubmit={handleNSubmit} style={{ background: 'white', padding: 20, borderRadius: 16 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>SELECT CHAPTER</h3>
            <ChapterSelector onSelect={(chapId) => setNForm({ ...nForm, chapter_id: chapId })} />

            <select value={nForm.type} onChange={e => setNForm({ ...nForm, type: e.target.value })} style={inputStyle}>
              {NOTE_TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>

            <input placeholder="Note title" value={nForm.title} onChange={e => setNForm({ ...nForm, title: e.target.value })} style={inputStyle} required />
            <textarea placeholder="Note content..." value={nForm.content} onChange={e => setNForm({ ...nForm, content: e.target.value })} style={{ ...inputStyle, minHeight: 180 }} required />
            <input placeholder="Image URL (optional)" value={nForm.image_url} onChange={e => setNForm({ ...nForm, image_url: e.target.value })} style={inputStyle} />

            <button type="submit" style={btnPrimary}>📝 Add Note</button>
          </form>
        )}

        {/* ========== LECTURES TAB ========== */}
        {tab === 'lecture' && (
          <form onSubmit={handleLSubmit} style={{ background: 'white', padding: 20, borderRadius: 16 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>SELECT CHAPTER</h3>
            <ChapterSelector onSelect={(chapId) => setLForm({ ...lForm, chapter_id: chapId })} />

            <input placeholder="Lecture title" value={lForm.title} onChange={e => setLForm({ ...lForm, title: e.target.value })} style={inputStyle} required />
            <input placeholder="Teacher name" value={lForm.teacher} onChange={e => setLForm({ ...lForm, teacher: e.target.value })} style={inputStyle} />
            <input placeholder="Duration (12:45)" value={lForm.duration} onChange={e => setLForm({ ...lForm, duration: e.target.value })} style={inputStyle} />
            <input placeholder="YouTube URL or Video ID" value={lForm.youtube_id} onChange={e => {
              const val = e.target.value;
              const m = val.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
              const id = m ? m[1] : val;
              setLForm({ ...lForm, youtube_id: id, video_url: 'https://youtube.com/watch?v=' + id });
            }} style={inputStyle} />
            <textarea placeholder="Description..." value={lForm.description} onChange={e => setLForm({ ...lForm, description: e.target.value })} style={{ ...inputStyle, minHeight: 80 }} />

            <button type="submit" style={btnPrimary}>🎥 Add Lecture</button>
          </form>
        )}
      </div>
    </div>
  );
}
