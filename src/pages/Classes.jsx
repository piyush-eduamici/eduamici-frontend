import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import classService from '../services/class.service';

export default function Classes() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const myClassLevel = user?.class_level || user?.classLevel || null;

  useEffect(() => {
    classService.getAll()
      .then((data) => {
        setClasses(data.classes || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto' }}></div>
    </div>
  );

  // Filter classes based on user's class
  const myClassNum = myClassLevel ? parseInt(String(myClassLevel).replace(/\D/g, '')) : null;
  const myClasses = myClassNum ? classes.filter(c => c.name.includes(String(myClassNum))) : [];
  const displayClasses = showAll || !myClassNum || myClasses.length === 0 ? classes : myClasses;

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
      {myClassNum && !showAll && myClasses.length > 0 ? (
        <>
          <p className="text-light" style={{ fontSize: 14 }}>Your Class</p>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 2, marginBottom: 8 }}>
            Class {myClassNum}
          </h1>
          <p className="text-light" style={{ fontSize: 14, marginBottom: 20 }}>
            Apne subjects select karo
          </p>
        </>
      ) : (
        <>
          <p className="text-light" style={{ fontSize: 14 }}>Choose your</p>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 2, marginBottom: 8 }}>Class</h1>
          <p className="text-light" style={{ fontSize: 14, marginBottom: 20 }}>
            Apni class select karo aur padhna shuru karo
          </p>
        </>
      )}

      {displayClasses.map((c) => (
        <Link key={c.id} to={`/classes/${c.id}/subjects`}
          style={{ display: 'block', background: c.color, borderRadius: 20, padding: 20, color: 'white', marginBottom: 16, textDecoration: 'none', boxShadow: '0 8px 24px ' + c.color + '40' }}>
          <div style={{ fontSize: 36, marginBottom: 4 }}>{c.emoji}</div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>{c.name}</h2>
          <p style={{ opacity: 0.9, fontSize: 14 }}>{c.tagline}</p>
        </Link>
      ))}

      {myClassNum && myClasses.length > 0 && (
        <button onClick={() => setShowAll(!showAll)}
          style={{
            width: '100%', padding: 14, borderRadius: 12,
            background: showAll ? '#f1f5f9' : '#eff6ff',
            color: showAll ? '#64748b' : '#3b82f6',
            border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 4,
          }}>
          {showAll ? '← Show My Class Only' : '📚 Browse All Classes'}
        </button>
      )}
    </div>
  );
}
