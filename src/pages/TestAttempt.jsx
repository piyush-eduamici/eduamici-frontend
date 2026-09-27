import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TestAttempt() {
  const { testId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/tests/' + testId)
      .then(r => r.json())
      .then(d => {
        setTest(d.test);
        setQuestions(d.questions || []);
        setTimeLeft((d.test?.duration_minutes || 180) * 60);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [testId]);

  useEffect(() => {
    if (timeLeft <= 0 || submitted || !test) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted, test]);

  useEffect(() => {
    if (timeLeft === 0 && !submitted && test) handleSubmit();
  }, [timeLeft]);

  const handleSubmit = async () => {
    setSubmitted(true);
    const r = await fetch(`http://localhost:5000/api/tests/${testId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user?.id, answers }),
    });
    const d = await r.json();
    setResult(d);
  };

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  if (loading) return <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>;
  if (!test) return <div className="container" style={{ paddingTop: 40 }}>Test not found</div>;

  if (result) {
    return (
      <div className="container" style={{ paddingTop: 40, paddingBottom: 100, textAlign: 'center' }}>
        <div style={{ fontSize: 60, marginBottom: 12 }}>{result.percentage >= 80 ? '🏆' : result.percentage >= 50 ? '👍' : '💪'}</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Test Complete!</h1>
        <div className="card" style={{ padding: 28, marginBottom: 20, marginTop: 20 }}>
          <div style={{ fontSize: 48, fontWeight: 800, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {result.score}/{result.total}
          </div>
          <p style={{ color: '#94a3b8', marginTop: 4 }}>{result.percentage}% score</p>
        </div>
        <button onClick={() => navigate('/mock-tests')} className="btn btn-primary btn-lg" style={{ width: '100%' }}>Back to Tests</button>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ position: 'sticky', top: 60, background: 'white', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 12, color: '#64748b' }}>{test.title}</p>
          <p style={{ fontSize: 14, fontWeight: 700 }}>{Object.keys(answers).length}/{questions.length} answered</p>
        </div>
        <div style={{ background: timeLeft < 300 ? '#fee2e2' : '#eff6ff', color: timeLeft < 300 ? '#b91c1c' : '#1e40af', padding: '8px 12px', borderRadius: 10, fontWeight: 800, fontSize: 14, fontFamily: 'monospace' }}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      <div className="container" style={{ paddingTop: 20 }}>
        {questions.map((q, idx) => (
          <div key={q.id} className="card" style={{ padding: 20, marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Q{idx + 1} • {q.marks} marks</p>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, lineHeight: 1.5 }}>{q.question_text}</p>
            {q.option_a && (
              <>
                {['A', 'B', 'C', 'D'].map((opt) => {
                  const val = q['option_' + opt.toLowerCase()];
                  if (!val) return null;
                  return (
                    <button key={opt} onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: 12, marginBottom: 8, background: answers[q.id] === opt ? '#eff6ff' : 'white', border: answers[q.id] === opt ? '2px solid #3b82f6' : '1px solid #e2e8f0', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                      <b style={{ marginRight: 8 }}>{opt}.</b>{val}
                    </button>
                  );
                })}
              </>
            )}
          </div>
        ))}

        <button onClick={handleSubmit} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 20 }}>
          Submit Test
        </button>
      </div>
    </div>
  );
}
