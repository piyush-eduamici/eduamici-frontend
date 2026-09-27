import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Friends() {
  const { user: me } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sent, setSent] = useState([]);
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = async () => {
    if (!me?.id) return;
    try {
      const [f, r, s] = await Promise.all([
        fetch(API + '/friends/' + me.id).then(x => x.json()),
        fetch(API + '/friends/' + me.id + '/requests').then(x => x.json()),
        fetch(API + '/friends/' + me.id + '/sent').then(x => x.json()),
      ]);
      setFriends(f.friends || []);
      setRequests(r.requests || []);
      setSent(s.sent || []);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [me]);

  useEffect(() => {
    if (!me?.id) return;
    if (searchQ.trim().length < 1) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const r = await fetch(API + '/friends/' + me.id + '/search?q=' + encodeURIComponent(searchQ));
        const d = await r.json();
        setSearchResults(d.users || []);
      } catch (e) {}
    }, 300);
    return () => clearTimeout(t);
  }, [searchQ, me]);

  const showMsg = (t) => { setMsg(t); setTimeout(() => setMsg(''), 2500); };

  const sendRequest = async (friendId) => {
    const r = await fetch(API + '/friends/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: me.id, friend_id: friendId }),
    });
    const d = await r.json();
    if (d.success) { showMsg('Request sent!'); load(); }
    else showMsg(d.message);
  };

  const accept = async (reqId) => {
    await fetch(API + '/friends/accept/' + reqId, { method: 'POST' });
    showMsg('Friend added!'); load();
  };

  const reject = async (reqId) => {
    await fetch(API + '/friends/reject/' + reqId, { method: 'POST' });
    showMsg('Request rejected'); load();
  };

  const removeFriend = async (friendId) => {
    if (!confirm('Remove this friend?')) return;
    await fetch(API + '/friends/' + me.id + '/' + friendId, { method: 'DELETE' });
    showMsg('Removed'); load();
  };

  if (loading) return (
    <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto' }}></div>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Friends</h1>
      <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>
        {friends.length} friends - {requests.length} pending
      </p>

      {msg && <div style={{ padding: 12, borderRadius: 10, marginBottom: 12, background: '#eff6ff', color: '#1e40af', fontSize: 13, fontWeight: 600 }}>{msg}</div>}

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, background: '#f1f5f9', padding: 4, borderRadius: 12 }}>
        {[
          { id: 'friends', label: 'Friends (' + friends.length + ')' },
          { id: 'requests', label: 'Requests (' + requests.length + ')' },
          { id: 'find', label: 'Find' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: 10, borderRadius: 10, fontSize: 12, fontWeight: 700, background: tab === t.id ? 'white' : 'transparent', color: tab === t.id ? '#3b82f6' : '#64748b', border: 'none', cursor: 'pointer' }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'friends' && (
        friends.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>👥</div>
            <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Abhi koi friend nahi</p>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>Find tab pe jao aur dost banao</p>
            <button onClick={() => setTab('find')} className="btn btn-primary btn-sm">Find Friends</button>
          </div>
        ) : (
          friends.map(f => (
            <div key={f.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, marginBottom: 10 }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 18 }}>
                {f.username.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700 }}>{f.username}</p>
                <p style={{ fontSize: 11, color: '#94a3b8' }}>Class {f.class_level}</p>
              </div>
              <button onClick={() => navigate('/chat/' + f.id)}
                style={{ padding: '8px 12px', borderRadius: 10, background: '#eff6ff', color: '#3b82f6', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', marginRight: 4 }}>
                Chat
              </button>
              <button onClick={() => removeFriend(f.id)}
                style={{ padding: '8px 12px', borderRadius: 10, background: '#fee2e2', color: '#b91c1c', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                X
              </button>
            </div>
          ))
        )
      )}

      {tab === 'requests' && (
        requests.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>📬</div>
            <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Koi request nahi</p>
            <p style={{ fontSize: 13, color: '#94a3b8' }}>Jab koi request bhejega toh yahan aayegi</p>
          </div>
        ) : (
          requests.map(r => (
            <div key={r.request_id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, marginBottom: 10 }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 18 }}>
                {r.username.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700 }}>{r.username}</p>
                <p style={{ fontSize: 11, color: '#94a3b8' }}>Class {r.class_level}</p>
              </div>
              <button onClick={() => accept(r.request_id)}
                style={{ padding: '8px 12px', borderRadius: 10, background: '#22c55e', color: 'white', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', marginRight: 4 }}>
                Accept
              </button>
              <button onClick={() => reject(r.request_id)}
                style={{ padding: '8px 12px', borderRadius: 10, background: '#f1f5f9', color: '#64748b', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                Reject
              </button>
            </div>
          ))
        )
      )}

      {tab === 'find' && (
        <div>
          <input className="input" placeholder="Search username..." value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ marginBottom: 16 }} />

          {searchQ.trim().length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🔍</div>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Username type karo</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: '#94a3b8' }}>Koi user nahi mila</p>
            </div>
          ) : (
            searchResults.map(u => {
              const alreadySent = sent.some(s => s.id === u.id);
              return (
                <div key={u.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, marginBottom: 10 }}>
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #22c55e, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 18 }}>
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700 }}>{u.username}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8' }}>Class {u.class_level}</p>
                  </div>
                  {alreadySent ? (
                    <span style={{ padding: '8px 12px', borderRadius: 10, background: '#fef3c7', color: '#92400e', fontSize: 11, fontWeight: 700 }}>Sent</span>
                  ) : (
                    <button onClick={() => sendRequest(u.id)}
                      style={{ padding: '8px 14px', borderRadius: 10, background: '#3b82f6', color: 'white', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                      + Add
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
