import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Play notification sound using Web Audio API (no file needed)
function playSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.value = 1000;
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0.15, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.3);
    }, 120);
  } catch (e) {}
}

export default function Chat() {
  const { userId } = useParams();
  const { user: me } = useAuth();
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [ban, setBan] = useState({ banned: false, until: null, warnings: 0 });
  const [toast, setToast] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const bottomRef = useRef(null);
  const lastCountRef = useRef(0);
  const pollRef = useRef(null);

  const showToast = (msg, color) => {
    setToast({ msg, color: color || '#3b82f6' });
    setTimeout(() => setToast(''), 3500);
  };

  // Load friends
  useEffect(() => {
    if (!me?.id) return;
    fetch(API + '/friends/' + me.id)
      .then(r => r.json())
      .then(d => { setFriends(d.friends || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [me]);

  // Load ban status
  useEffect(() => {
    if (!me?.id) return;
    fetch(API + '/messages/ban-status/' + me.id)
      .then(r => r.json())
      .then(d => {
        if (d.success) setBan({ banned: d.banned, until: d.bannedUntil, warnings: d.warnings || 0 });
      })
      .catch(() => {});
  }, [me]);

  // Load messages + polling
  useEffect(() => {
    if (!userId || !me?.id) return;
    const load = async () => {
      try {
        const r = await fetch(API + '/messages/conversation/' + me.id + '/' + userId);
        const d = await r.json();
        const msgs = d.messages || [];
        // Play sound if new message arrived (not by me)
        if (msgs.length > lastCountRef.current && lastCountRef.current > 0) {
          const lastMsg = msgs[msgs.length - 1];
          if (lastMsg.sender_id !== me.id && !lastMsg.deleted) {
            playSound();
          }
        }
        lastCountRef.current = msgs.length;
        setMessages(msgs);
      } catch (e) {}
    };
    load();
    pollRef.current = setInterval(load, 3000);
    return () => clearInterval(pollRef.current);
  }, [userId, me]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !userId || sending || ban.banned) return;
    const content = text.trim();
    setText('');
    setSending(true);
    try {
      const r = await fetch(API + '/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_id: me.id, receiver_id: parseInt(userId), content }),
      });
      const d = await r.json();
      if (!d.success) {
        if (d.banned) {
          setBan({ banned: true, until: d.until, warnings: d.warnings });
          showToast(d.message, '#ef4444');
        } else if (d.abuse) {
          setBan({ banned: d.banned || false, until: null, warnings: d.warnings });
          showToast(d.message, '#f59e0b');
        } else {
          showToast(d.message || 'Error sending message', '#ef4444');
        }
        setText(content);
      } else {
        const r2 = await fetch(API + '/messages/conversation/' + me.id + '/' + userId);
        const d2 = await r2.json();
        setMessages(d2.messages || []);
      }
    } catch (e) { showToast('Network error', '#ef4444'); }
    setSending(false);
  };

  const deleteMessage = async (msgId) => {
    if (!confirm('Delete this message?')) return;
    setDeletingId(msgId);
    try {
      await fetch(API + '/messages/' + msgId + '/' + me.id, { method: 'DELETE' });
      const r = await fetch(API + '/messages/conversation/' + me.id + '/' + userId);
      const d = await r.json();
      setMessages(d.messages || []);
      showToast('Message deleted', '#22c55e');
    } catch (e) { showToast('Delete failed', '#ef4444'); }
    setDeletingId(null);
  };

  const selected = friends.find(f => f.id === parseInt(userId));

  if (loading) return (
    <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto' }}></div>
    </div>
  );

  // Friends list view
  if (!userId) {
    return (
      <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>💬 Messages</h1>
        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>Friends ke saath chat karo</p>

        {toast && (
          <div style={{ padding: 12, borderRadius: 10, marginBottom: 12, background: toast.color + '20', color: toast.color, fontSize: 13, fontWeight: 600 }}>
            {toast.msg}
          </div>
        )}

        {friends.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>👥</div>
            <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Koi friend nahi</p>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>Pehle friends banao phir chat karo</p>
            <button onClick={() => navigate('/friends')} className="btn btn-primary btn-sm">Find Friends</button>
          </div>
        ) : (
          friends.map(f => (
            <button key={f.id} onClick={() => navigate('/chat/' + f.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: 14, background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, marginBottom: 10, cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 18 }}>
                {f.username.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700 }}>{f.username}</p>
                <p style={{ fontSize: 11, color: '#94a3b8' }}>Class {f.class_level}</p>
              </div>
              <span style={{ color: '#94a3b8', fontSize: 20 }}>›</span>
            </button>
          ))
        )}
      </div>
    );
  }

  // Chat view
  return (
    <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/chat')} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', padding: 0 }}>←</button>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>
          {selected?.username?.charAt(0).toUpperCase() || '?'}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700 }}>{selected?.username || 'User'}</p>
          <p style={{ fontSize: 11, color: '#22c55e' }}>● Online</p>
        </div>
      </div>

      {/* Ban warning */}
      {ban.banned && (
        <div style={{ padding: 12, background: '#fee2e2', borderBottom: '1px solid #fecaca', color: '#b91c1c', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
          🚫 Aapka chat band hai
        </div>
      )}
      {!ban.banned && ban.warnings > 0 && (
        <div style={{ padding: 10, background: '#fef3c7', borderBottom: '1px solid #fde68a', color: '#92400e', fontSize: 12, fontWeight: 600, textAlign: 'center' }}>
          ⚠️ Warning {ban.warnings}/3 — Gaali dena allowed nahi
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#f8fafc' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>💬</p>
            <p style={{ fontSize: 14 }}>Koi message nahi</p>
            <p style={{ fontSize: 12 }}>Hello bol ke shuru karo</p>
          </div>
        ) : (
          messages.map(m => {
            const isMine = m.sender_id === me.id;
            const isDeleted = m.deleted;
            return (
              <div key={m.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: 8 }}
                onDoubleClick={() => isMine && !isDeleted && deleteMessage(m.id)}>
                <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: 16, background: isMine ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'white', color: isMine ? 'white' : '#0f172a', border: isMine ? 'none' : '1px solid #e2e8f0', fontSize: 14, lineHeight: 1.4, opacity: isDeleted ? 0.6 : 1, position: 'relative' }}>
                  <p style={{ wordBreak: 'break-word', fontStyle: isDeleted ? 'italic' : 'normal' }}>{m.content}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginTop: 4 }}>
                    <span style={{ fontSize: 10, opacity: 0.6 }}>
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMine && !isDeleted && (
                      <button onClick={() => deleteMessage(m.id)} disabled={deletingId === m.id}
                        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: 6, padding: '2px 6px', fontSize: 10, cursor: 'pointer' }}>
                        🗑
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ padding: 12, background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8 }}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder={ban.banned ? 'Chat band hai' : 'Type a message...'}
          disabled={ban.banned}
          style={{ flex: 1, padding: 12, borderRadius: 24, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', opacity: ban.banned ? 0.5 : 1 }} />
        <button type="submit" disabled={sending || !text.trim() || ban.banned}
          style={{ width: 44, height: 44, borderRadius: '50%', background: (sending || !text.trim() || ban.banned) ? '#cbd5e1' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', border: 'none', fontSize: 18, cursor: (sending || !text.trim() || ban.banned) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {sending ? '...' : '➤'}
        </button>
      </form>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 70, left: 16, right: 16, padding: 12, background: toast.color, color: 'white', borderRadius: 12, fontSize: 13, fontWeight: 600, textAlign: 'center', zIndex: 999, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
