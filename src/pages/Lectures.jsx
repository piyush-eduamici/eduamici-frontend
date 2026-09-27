import { Link, useParams } from "react-router-dom";

const lecturesData = {
  1: [
    { id: 1, title: "Introduction to Number Systems", teacher: "Priya Sharma", duration: "12:45", desc: "Basics of rational and irrational numbers", color: "#3b82f6" },
    { id: 2, title: "Rational Numbers Explained", teacher: "Priya Sharma", duration: "15:20", desc: "Deep dive into rational numbers", color: "#8b5cf6" },
    { id: 3, title: "Irrational Numbers", teacher: "Rajesh Kumar", duration: "11:30", desc: "Understanding irrational numbers", color: "#22c55e" },
    { id: 4, title: "Real Numbers & Number Line", teacher: "Rajesh Kumar", duration: "18:15", desc: "Representation on number line", color: "#f59e0b" },
  ],
  2: [
    { id: 1, title: "Introduction to Polynomials", teacher: "Amit Singh", duration: "14:20", desc: "What are polynomials", color: "#3b82f6" },
    { id: 2, title: "Degree of Polynomial", teacher: "Amit Singh", duration: "12:10", desc: "Linear, quadratic, cubic", color: "#8b5cf6" },
    { id: 3, title: "Zeroes of Polynomial", teacher: "Neha Verma", duration: "16:30", desc: "Finding zeroes", color: "#22c55e" },
    { id: 4, title: "Remainder Theorem", teacher: "Neha Verma", duration: "13:45", desc: "Remainder theorem explained", color: "#ec4899" },
    { id: 5, title: "Factor Theorem", teacher: "Amit Singh", duration: "15:00", desc: "Factor theorem with examples", color: "#f59e0b" },
  ],
};

export default function Lectures() {
  const { chapterId } = useParams();
  const lectures = lecturesData[chapterId] || lecturesData[1];

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 100 }}>
      <Link to="/subjects/maths/chapters" style={{ color: "#3b82f6", fontSize: 14, fontWeight: 600 }}>
        ← Back to Chapters
      </Link>
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: "12px 0 4px" }}>
        Chapter {chapterId} Lectures
      </h1>
      <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20 }}>
        {lectures.length} video lectures
      </p>

      {lectures.map((lec, i) => (
        <Link
          key={lec.id}
          to={`/lectures/${lec.id}/watch`}
          className="card"
          style={{
            display: "block",
            padding: 0,
            marginBottom: 14,
            overflow: "hidden",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div style={{
            height: 140,
            background: "linear-gradient(135deg, " + lec.color + " 0%, " + lec.color + "cc 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              color: "white",
            }}>
              ▶
            </div>
            <div style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              background: "rgba(0,0,0,0.7)",
              color: "white",
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
            }}>
              {lec.duration}
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
              {lec.title}
            </h3>
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>
              👨‍🏫 {lec.teacher}
            </p>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.4 }}>
              {lec.desc}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
