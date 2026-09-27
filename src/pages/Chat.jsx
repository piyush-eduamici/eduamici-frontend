import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Chat() {
  const { userId } = useParams();
  const { user: me } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  // Load users list
  useEffect(() => {
    fetch('http://localhost:5000/api/messages/users')
      .then(r => r.json())
      .then(d => {
        setUsers((d.users || []).filter(u => u.id !== me?.id));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [me]);

  // Load conversation messages
  useEffect(() => {
    if (!userId || !me?.id) return;
    const load = () => {
      fetch(`http://localhost:5000/api/messages/conversation/${me.id}/${userId}`)
        .then(r => r.json())
        .then(d => setMessages(d.messages || []))
        .catch(() => {});
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [userId, me]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !userId) return;
    const content = text.trim();
    setText('');
    await fetch('http://localhost:5000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender_id: me.id, receiver_id: parseInt(userId), content }),
    });
    // Reload
    const r = await fetch(`http://localhost:5000/api/messages/conversation/${me.id}/${userId}`);
    const d = await r.json();
    setMessages(d.messages || []);
  };

  const selectedUser = users.find(u => u.id === parseInt(userId));

  if (loading) return (
    <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto' }}></div>
    </div>
  );

  return (
    <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      {selectedUser ? (
        <div style={{ padding: '12px 16px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/chat')} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>←</button>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>
            {selectedUser.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700 }}>{selectedUser.username}</p>
            <p style={{ fontSize: 11, color: '#94a3b8' }}>Class {selectedUser.class_level}</p>
          </div>
        </div>
      ) : (
        <div style={{ padding: '12px 16px', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>💬 Messages</h2>
          <p style={{ fontSize: 12, color: '#94a3b8' }}>Choose a friend to chat</p>
        </div>
      )}

      {/* Body */}
      {!userId ? (
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {users.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>👥</div>
              <p style={{ fontWeight: 700, marginBottom: 4 }}>Abhi koi user nahi</p>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>Koi register kare toh yahan dikhega</p>
            </div>
          ) : (
            users.map(u => (
              <button key={u.id} onClick={() => navigate('/chat/' + u.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: 14, background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, marginBottom: 10, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 18 }}>
                  {u.username.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700 }}>{u.username}</p>
                  <p style={{ fontSize: 11, color: '#94a3b8' }}>Class {u.class_level}</p>
                </div>
                <span style={{ color: '#94a3b8', fontSize: 20 }}>›</span>
              </button>
            ))
          )}
        </div>
      ) : (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#f8fafc' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                <p>Koi message nahi</p>
                <p style={{ fontSize: 12 }}>Hello bol ke shuru karo 👋</p>
              </div>
            ) : (
              messages.map(m => {
                const isMine = m.sender_id === me.id;
                return (
                  <div key={m.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                    <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: 16, background: isMine ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'white', color: isMine ? 'white' : '#0f172a', border: isMine ? 'none' : '1px solid #e2e8f0', fontSize: 14, lineHeight: 1.4 }}>
                      <p>{m.content}</p>
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
            <button type="submit" style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', border: 'none', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ➤
            </button>
          </form>
        </>
      )}
    </div>
  );
}
