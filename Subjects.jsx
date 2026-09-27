import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiChevronRight } from 'react-icons/fi';
const subjectsData = {
  6: [{ id: 'maths', name: 'Mathematics', color: '#3b82f6', chapters: 14, emoji: '🔢' }, { id: 'science', name: 'Science', color: '#22c55e', chapters: 16, emoji: '⚗️' }, { id: 'social', name: 'Social Science', color: '#f59e0b', chapters: 12, emoji: '🏛️' }, { id: 'english', name: 'English', color: '#ec4899', chapters: 10, emoji: '✍️' }, { id: 'hindi', name: 'Hindi', color: '#8b5cf6', chapters: 12, emoji: '📜' }],
  7: [{ id: 'maths', name: 'Mathematics', color: '#3b82f6', chapters: 15, emoji: '🔢' }, { id: 'science', name: 'Science', color: '#22c55e', chapters: 18, emoji: '⚗️' }, { id: 'social', name: 'Social Science', color: '#f59e0b', chapters: 14, emoji: '🏛️' }, { id: 'english', name: 'English', color: '#ec4899', chapters: 11, emoji: '✍️' }, { id: 'hindi', name: 'Hindi', color: '#8b5cf6', chapters: 13, emoji: '📜' }],
  8: [{ id: 'maths', name: 'Mathematics', color: '#3b82f6', chapters: 16, emoji: '🔢' }, { id: 'science', name: 'Science', color: '#22c55e', chapters: 18, emoji: '⚗️' }, { id: 'social', name: 'Social Science', color: '#f59e0b', chapters: 15, emoji: '🏛️' }, { id: 'english', name: 'English', color: '#ec4899', chapters: 12, emoji: '✍️' }, { id: 'hindi', name: 'Hindi', color: '#8b5cf6', chapters: 14, emoji: '📜' }],
  9: [{ id: 'maths', name: 'Mathematics', color: '#3b82f6', chapters: 15, emoji: '🔢' }, { id: 'science', name: 'Science', color: '#22c55e', chapters: 15, emoji: '⚗️' }, { id: 'social', name: 'Social Science', color: '#f59e0b', chapters: 20, emoji: '🏛️' }, { id: 'english', name: 'English', color: '#ec4899', chapters: 11, emoji: '✍️' }, { id: 'hindi', name: 'Hindi', color: '#8b5cf6', chapters: 14, emoji: '📜' }],
  10: [{ id: 'maths', name: 'Mathematics', color: '#3b82f6', chapters: 14, emoji: '🔢' }, { id: 'science', name: 'Science', color: '#22c55e', chapters: 16, emoji: '⚗️' }, { id: 'social', name: 'Social Science', color: '#f59e0b', chapters: 22, emoji: '🏛️' }, { id: 'english', name: 'English', color: '#ec4899', chapters: 11, emoji: '✍️' }, { id: 'hindi', name: 'Hindi', color: '#8b5cf6', chapters: 17, emoji: '📜' }],
};
const Subjects = () => {
  const { classId } = useParams();
  const subjects = subjectsData[classId] || subjectsData[9];
  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/classes" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--blue-500)', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
          <FiArrowLeft size={16} /> Back to Classes
        </Link>
        <p className="text-light" style={{ fontSize: 14 }}>Class {classId}</p>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 2, marginBottom: 8 }}>Subjects</h1>
        <p className="text-light" style={{ fontSize: 14, marginBottom: 24 }}>Subject choose karo aur padhna shuru karo</p>
      </motion.div>
      <div className="flex flex-col gap-3">
        {subjects.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06, duration: 0.35 }}>
            <Link to={`/subjects/${s.id}/chapters`} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{s.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{s.name}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-light)' }}>{s.chapters} chapters</p>
              </div>
              <FiChevronRight size={20} color="var(--text-light)" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default Subjects;
