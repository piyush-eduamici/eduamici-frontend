import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';

const MainLayout = () => (
  <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
    <Navbar />
    <main className="page-enter">
      <Outlet />
    </main>
    <BottomNav />
  </div>
);

export default MainLayout;
