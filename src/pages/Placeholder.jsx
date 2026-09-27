const Placeholder = ({ title = 'Coming Soon' }) => (
  <div className="container" style={{ padding: '80px 16px', textAlign: 'center' }}>
    <h1 className="gradient-text" style={{ fontSize: 32, fontWeight: 800 }}>{title}</h1>
    <p className="text-light mt-4">Ye page jaldi ban raha hai 🚧</p>
  </div>
);

export default Placeholder;