import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Chat() {
  const { userId } = useParams();
  const { user: me } = useAuth();
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    if (!me?.id) return;
    fetch(API + '/friends/' + me.id)
      .then(r => r.json())
      .then(d => { setFriends(d.friends || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [me]);

  useEffect(() => {
    if (!userId || !me?.id) return;
    const load = () => {
      fetch(API + '/messages/conversation/' + me.id + '/' + userId)
        .then(r => r.json())
        .then(d => setMessages(d.messages || []))
        .catch(() => {});
    };
    load();
    pollRef.current = setInterval(load, 2500);
    return () => clearInterval(pollRef.current);
  }, [userId, me]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !userId || sending) return;
    const content = text.trim();
    setText('');
    setSending(true);
    try {
      await fetch(API + '/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_id: me.id, receiver_id: parseInt(userId), content }),
      });
      const r = await fetch(API + '/messages/conversation/' + me.id + '/' + userId);
      const d = await r.json();
      setMessages(d.messages || []);
    } catch (e) {}
    setSending(false);
  };

  const selected = friends.find(f => f.id === parseInt(userId));

  if (loading) return (
    <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto' }}></div>
    </div>
  );

  if (!userId) {
    return (
      <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Messages</h1>
        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>Friends ke saath chat karo</p>

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

  return (
    <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/chat')} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', padding: 0 }}>←</button>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>
          {selected?.username?.charAt(0).toUpperCase() || '?'}
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700 }}>{selected?.username || 'User'}</p>
          <p style={{ fontSize: 11, color: '#94a3b8' }}>{selected ? 'Class ' + selected.class_level : ''}</p>
        </div>
      </div>

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
            return (
              <div key={m.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: 16, background: isMine ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'white', color: isMine ? 'white' : '#0f172a', border: isMine ? 'none' : '1px solid #e2e8f0', fontSize: 14, lineHeight: 1.4 }}>
                  <p style={{ wordBreak: 'break-word' }}>{m.content}</p>
                  <p style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: 'right' }}>
                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} style={{ padding: 12, background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8 }}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message..."
          style={{ flex: 1, padding: 12, borderRadius: 24, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
        <button type="submit" disabled={sending || !text.trim()}
          style={{ width: 44, height: 44, borderRadius: '50%', background: sending || !text.trim() ? '#cbd5e1' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', border: 'none', fontSize: 18, cursor: sending || !text.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {sending ? '...' : '➤'}
        </button>
      </form>
    </div>
  );
}
