import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
const classes = [
  { id: 6, name: 'Class 6', tagline: 'Foundation Builder', subjects: 5, chapters: 42, color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', emoji: '🌱' },
  { id: 7, name: 'Class 7', tagline: 'Concept Strengthener', subjects: 5, chapters: 48, color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', emoji: '📘' },
  { id: 8, name: 'Class 8', tagline: 'Advanced Learner', subjects: 5, chapters: 52, color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', emoji: '🚀' },
  { id: 9, name: 'Class 9', tagline: 'Board Exam Ready', subjects: 5, chapters: 58, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', emoji: '🎯' },
  { id: 10, name: 'Class 10', tagline: 'Board Topper', subjects: 5, chapters: 62, color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', emoji: '🏆' },
];
const Classes = () => (
  <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <p className="text-light" style={{ fontSize: 14 }}>Choose your</p>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 2, marginBottom: 8 }}>Class</h1>
      <p className="text-light" style={{ fontSize: 14, marginBottom: 24 }}>Apni class select karo aur padhna shuru karo</p>
    </motion.div>
    <div className="flex flex-col gap-4">
      {classes.map((c, i) => (
        <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.4 }}>
          <Link to={`/classes/${c.id}/subjects`} style={{ display: 'block', background: c.gradient, borderRadius: 20, padding: 20, color: 'white', position: 'relative', overflow: 'hidden', boxShadow: `0 8px 24px ${c.color}40` }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
            <div className="flex items-center justify-between" style={{ position: 'relative', zIndex: 2 }}>
              <div>
                <div style={{ fontSize: 36, marginBottom: 4 }}>{c.emoji}</div>
                <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 2 }}>{c.name}</h2>
                <p style={{ fontSize: 13, opacity: 0.9, marginBottom: 12 }}>{c.tagline}</p>
                <div className="flex gap-3" style={{ fontSize: 12, opacity: 0.9 }}>
                  <span>📚 {c.subjects} Subjects</span>
                  <span>📖 {c.chapters} Chapters</span>
                </div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiArrowRight size={22} />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
);
export default Classes;
