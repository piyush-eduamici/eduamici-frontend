import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

export default function QuizRoom() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const pollRef = useRef(null);

  const fetchState = async () => {
    try {
      const r = await fetch(`${API}/quiz/room/${roomId}/state`);
      const d = await r.json();
      if (d.success) setState(d);
    } catch (e) {}
  };

  useEffect(() => {
    fetchState();
    pollRef.current = setInterval(fetchState, 1500);
    return () => clearInterval(pollRef.current);
  }, [roomId]);

  const currentQId = state?.currentQuestion?.id;
  useEffect(() => {
    setAnswered(false);
    setSelected(null);
    setFeedback(null);
  }, [currentQId, state?.room?.current_q_index]);

  const isHost = state?.room?.host_id === user?.id;

  const handleAnswer = async (opt) => {
    if (answered || !state?.currentQuestion) return;
    setSelected(opt);
    setAnswered(true);
    try {
      const r = await fetch(`${API}/quiz/room/${roomId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, question_id: state.currentQuestion.id, selected_option: opt })
      });
      const d = await r.json();
      setFeedback(d);
    } catch (e) {}
  };

  const startGame = async () => {
    await fetch(`${API}/quiz/room/${roomId}/start`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id })
    });
    fetchState();
  };

  const nextQuestion = async () => {
    await fetch(`${API}/quiz/room/${roomId}/next`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id })
    });
    fetchState();
  };

  if (!state) return <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>;

  const { room, participants, currentQuestion, timeLeft, questionsTotal } = state;
  const teamA = participants.filter(p => p.team === 'A');
  const teamB = participants.filter(p => p.team === 'B');
  const scoreA = teamA.reduce((s, p) => s + p.score, 0);
  const scoreB = teamB.reduce((s, p) => s + p.score, 0);

  if (room.status === 'waiting') {
    return (
      <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>🎮 Room: {room.code}</h1>
        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>Share code with friend</p>

        <div className="card" style={{ padding: 20, marginBottom: 16, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>ROOM CODE</p>
          <p style={{ fontSize: 36, fontWeight: 800, letterSpacing: 6, color: '#3b82f6', marginBottom: 12 }}>{room.code}</p>
          <button onClick={() => { navigator.clipboard?.writeText(room.code); alert('Copied!'); }}
            style={{ padding: '8px 16px', borderRadius: 10, background: '#eff6ff', color: '#3b82f6', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            📋 Copy Code
          </button>
        </div>

        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>👥 Players ({participants.length})</p>
          {participants.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 8 }}>
              <span>{p.username} {p.user_id === user.id ? '(You)' : ''}</span>
              <span style={{ fontSize: 12, color: '#64748b' }}>Team {p.team}</span>
            </div>
          ))}
        </div>

        {isHost && (
          <button onClick={startGame} style={{ width: '100%', padding: 14, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' }}>
            ▶️ Start Game
          </button>
        )}
        {!isHost && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Waiting for host...</p>}
      </div>
    );
  }

  if (room.status === 'finished') {
    const sorted = [...participants].sort((a, b) => b.score - a.score);
    return (
      <div className="container" style={{ paddingTop: 40, paddingBottom: 100, textAlign: 'center' }}>
        <div style={{ fontSize: 72, marginBottom: 12 }}>🏆</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Game Finished!</h1>
        <p style={{ color: '#94a3b8', marginBottom: 24 }}>Winner: <b style={{ color: '#3b82f6' }}>{sorted[0]?.username}</b></p>

        <div className="card" style={{ padding: 20, marginBottom: 20, textAlign: 'left' }}>
          <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>📊 Final Scores</p>
          {sorted.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 10, background: p.user_id === user.id ? '#eff6ff' : 'transparent', borderRadius: 8, marginBottom: 4 }}>
              <span>{['🥇','🥈','🥉'][i] || `#${i+1}`} {p.username}</span>
              <b style={{ color: '#3b82f6' }}>{p.score} pts</b>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/quiz-battle')} style={{ width: '100%', padding: 14, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' }}>
          Play Again
        </button>
      </div>
    );
  }

  const options = ['A', 'B', 'C', 'D'];
  const qNum = room.current_q_index + 1;
  const timePct = (timeLeft / room.time_per_question) * 100;

  return (
    <div className="container" style={{ paddingTop: 16, paddingBottom: 100 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', borderRadius: 14, padding: 12, textAlign: 'center' }}>
          <p style={{ fontSize: 11, opacity: 0.8 }}>Team A</p>
          <p style={{ fontSize: 24, fontWeight: 800 }}>{scoreA}</p>
        </div>
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #ec4899, #db2777)', color: 'white', borderRadius: 14, padding: 12, textAlign: 'center' }}>
          <p style={{ fontSize: 11, opacity: 0.8 }}>Team B</p>
          <p style={{ fontSize: 24, fontWeight: 800 }}>{scoreB}</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 700 }}>Q {qNum} / {questionsTotal}</span>
        <span style={{ fontSize: 13, color: timeLeft < 5 ? '#ef4444' : '#3b82f6', fontWeight: 800 }}>⏱ {timeLeft}s</span>
      </div>
      <div style={{ height: 6, background: '#f1f5f9', borderRadius: 100, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ height: '100%', width: timePct + '%', background: timeLeft < 5 ? '#ef4444' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)', transition: 'width 1s linear' }} />
      </div>

      {currentQuestion && (
        <>
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.5 }}>{currentQuestion.question_text}</p>
          </div>

          {options.map(opt => {
            const optText = currentQuestion['option_' + opt.toLowerCase()];
            if (!optText) return null;
            let bg = 'white', border = '#e2e8f0', color = '#0f172a';
            if (feedback && opt === feedback.correct_option) { bg = '#dcfce7'; border = '#22c55e'; color = '#15803d'; }
            else if (feedback && opt === selected && !feedback.isCorrect) { bg = '#fee2e2'; border = '#ef4444'; color = '#b91c1c'; }
            return (
              <button key={opt} onClick={() => handleAnswer(opt)} disabled={answered}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: 14, marginBottom: 10, background: bg, border: '2px solid ' + border, borderRadius: 12, fontSize: 14, fontWeight: 600, color, cursor: answered ? 'default' : 'pointer' }}>
                <b style={{ marginRight: 8 }}>{opt}.</b>{optText}
              </button>
            );
          })}

          {answered && feedback && (
            <div style={{ padding: 12, borderRadius: 12, marginTop: 12, background: feedback.isCorrect ? '#dcfce7' : '#fee2e2', color: feedback.isCorrect ? '#15803d' : '#b91c1c', textAlign: 'center', fontWeight: 700 }}>
              {feedback.isCorrect ? '✅ Correct!' : '❌ Wrong'}
            </div>
          )}

          {isHost && answered && (
            <button onClick={nextQuestion} style={{ width: '100%', padding: 14, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', marginTop: 12 }}>
              {qNum >= questionsTotal ? 'Finish Game' : 'Next Question →'}
            </button>
          )}
        </>
      )}
    </div>
  );
}
