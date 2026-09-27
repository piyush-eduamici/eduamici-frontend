import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiBookOpen, FiEdit3, FiAward, FiUsers, FiTrendingUp,
  FiFileText, FiZap, FiTarget, FiArrowRight,
} from 'react-icons/fi';

const features = [
  { icon: FiBookOpen, title: 'Video Lectures', desc: 'Chapter-wise lectures by expert teachers', color: '#3b82f6' },
  { icon: FiFileText, title: 'Smart Notes', desc: 'Short, revision & formula notes', color: '#8b5cf6' },
  { icon: FiEdit3, title: 'Practice MCQs', desc: '10,000+ questions with solutions', color: '#22c55e' },
  { icon: FiTarget, title: 'Mock Tests', desc: 'Real exam-like timed tests', color: '#f59e0b' },
  { icon: FiAward, title: 'PYQs', desc: 'Previous year questions solved', color: '#ec4899' },
  { icon: FiZap, title: 'Quiz Battles', desc: 'Challenge friends in real-time', color: '#06b6d4' },
  { icon: FiUsers, title: 'Study Teams', desc: 'Learn together, grow together', color: '#ef4444' },
  { icon: FiTrendingUp, title: 'Track Progress', desc: 'XP, streaks & achievements', color: '#10b981' },
];

const stats = [
  { value: '5', label: 'Classes' },
  { value: '25+', label: 'Subjects' },
  { value: '500+', label: 'Chapters' },
  { value: '10K+', label: 'Questions' },
];

const Home = () => (
  <div>
    <section style={{ background: 'var(--grad-hero)', color: 'white', padding: '60px 0 80px', position: 'relative', overflow: 'hidden' }}>
      <div className="animate-float" style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.4), transparent 70%)', filter: 'blur(40px)' }} />
      <div className="animate-float" style={{ position: 'absolute', bottom: -50, left: -80, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)', filter: 'blur(40px)', animationDelay: '1s' }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div style={{ marginBottom: 20 }}>
            <img src="/logo.svg" alt="EduAmici" style={{ width: 90, height: 90, objectFit: 'contain' }} />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            <FiZap size={14} /> Classes 6–10 • Complete Learning Platform
          </div>

          <h1 style={{ fontSize: 'clamp(30px, 7vw, 56px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: -1, marginBottom: 20, maxWidth: 700 }}>
            Learn Together.{' '}
            <span className="gradient-text">Grow Together.</span>
          </h1>

          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', maxWidth: 560, marginBottom: 32 }}>
            Lectures, notes, MCQs, PYQs, mock tests aur quiz battles — sab ek platform par. Apne dosto ke saath padho, compete karo, aur top karo.
          </p>

          <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn btn-primary btn-lg">Start Learning <FiArrowRight /></Link>
            <Link to="/classes" className="btn btn-ghost btn-lg">Explore Classes</Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 48, maxWidth: 640 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: 'center', padding: '16px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    <section className="container" style={{ padding: '60px 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Sab Kuch Ek Jagah</h2>
        <p className="text-light">Har feature jo tumhe top karne ke liye chahiye</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {features.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4 }} className="card">
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${f.color}18`, color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <f.icon size={22} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{f.title}</h3>
            <p className="text-light" style={{ fontSize: 13 }}>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    <section style={{ background: 'var(--grad-blue)', color: 'white', padding: '60px 16px', textAlign: 'center' }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Ready to Start?</h2>
      <p style={{ opacity: 0.9, marginBottom: 24 }}>Free hai. Sign up karo aur padhna shuru karo.</p>
      <Link to="/register" className="btn btn-lg" style={{ background: 'white', color: 'var(--blue-500)' }}>Create Free Account</Link>
    </section>
  </div>
);

export default Home;
