import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import classService from '../services/class.service';

export default function Classes() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const myClassLevel = user?.class_level || user?.classLevel;

  useEffect(() => {
    classService.getAll()
      .then((data) => {
        const all = data.classes || [];
        const myNum = myClassLevel ? parseInt(String(myClassLevel).replace(/\D/g, '')) : null;
        const filtered = myNum ? all.filter(c => c.name.includes(String(myNum))) : all;
        setClasses(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [myClassLevel]);

  if (loading) return <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>;

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
      <p className="text-light" style={{ fontSize: 14 }}>Your Class</p>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 2, marginBottom: 8 }}>Class {myClassLevel}</h1>
      <p className="text-light" style={{ fontSize: 14, marginBottom: 24 }}>Apne subjects select karo</p>
      {classes.map((c) => (
        <Link key={c.id} to={`/classes/${c.id}/subjects`} style={{ display: 'block', background: c.color, borderRadius: 20, padding: 20, color: 'white', marginBottom: 16, textDecoration: 'none', boxShadow: '0 8px 24px ' + c.color + '40' }}>
          <div style={{ fontSize: 36, marginBottom: 4 }}>{c.emoji}</div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>{c.name}</h2>
          <p style={{ opacity: 0.9, fontSize: 14 }}>{c.tagline}</p>
        </Link>
      ))}
    </div>
  );
}
