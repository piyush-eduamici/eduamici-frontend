import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import classService from '../services/class.service';

export default function Practice() {
  const [searchParams] = useSearchParams();
  const chapterId = searchParams.get('chapter') || 1;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    classService.getQuestions(chapterId)
      .then((data) => {
        setQuestions(data.questions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [chapterId]);

  const q = questions[current];

  const handleSelect = (i) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    const correctIndex = q.correct_option.charCodeAt(0) - 65;
    if (i === correctIndex) setScore(score + 1);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(current + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  if (loading) return (
    <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto' }}></div>
      <p style={{ marginTop: 16, color: '#94a3b8' }}>Loading questions...</p>
    </div>
  );

  if (questions.length === 0) return (
    <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
      <p style={{ color: '#94a3b8' }}>No questions found for this chapter.</p>
    </div>
  );

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="container" style={{ paddingTop: 40, paddingBottom: 100, textAlign: 'center' }}>
        <div style={{ fontSize: 60, marginBottom: 12 }}>
          {pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Quiz Complete!</h1>
        <p style={{ color: '#94a3b8', marginBottom: 24 }}>Yahan tumhara result hai</p>
        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ fontSize: 48, fontWeight: 800, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {score}/{questions.length}
          </div>
          <p style={{ color: '#94a3b8', marginTop: 4 }}>{pct}% correct</p>
        </div>
        <button onClick={handleRestart} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>Question {current + 1} of {questions.length}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6' }}>Score: {score}</span>
      </div>

      <div style={{ height: 6, background: '#e2e8f0', borderRadius: 100, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ height: '100%', width: ((current + 1) / questions.length * 100) + '%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', transition: 'width 0.4s' }} />
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.5 }}>{q.question_text}</p>
      </div>

      {[q.option_a, q.option_b, q.option_c, q.option_d].map((opt, i) => {
        const correctIndex = q.correct_option.charCodeAt(0) - 65;
        let bg = 'white';
        let border = '#e2e8f0';
        let color = '#0f172a';
        if (answered) {
          if (i === correctIndex) { bg = '#dcfce7'; border = '#22c55e'; color = '#15803d'; }
          else if (i === selected) { bg = '#fee2e2'; border = '#ef4444'; color = '#b91c1c'; }
        }
        return (
          <button key={i} onClick={() => handleSelect(i)}
            style={{ display: 'block', width: '100%', textAlign: 'left', padding: 16, marginBottom: 10, background: bg, border: '2px solid ' + border, borderRadius: 14, color: color, fontSize: 15, fontWeight: 600, transition: 'all 0.2s' }}>
            <span style={{ display: 'inline-block', width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.06)', textAlign: 'center', lineHeight: '24px', marginRight: 10, fontSize: 13 }}>
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        );
      })}

      {answered && q.explanation && (
        <div className="card" style={{ padding: 16, background: '#f0f9ff', border: '1px solid #bae6fd', marginTop: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#0369a1', marginBottom: 4 }}>💡 Explanation</p>
          <p style={{ fontSize: 14, color: '#0c4a6e', lineHeight: 1.5 }}>{q.explanation}</p>
        </div>
      )}

      {answered && (
        <button onClick={handleNext} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 20 }}>
          {current + 1 >= questions.length ? 'See Result' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}
