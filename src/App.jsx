import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import Subjects from './pages/Subjects';
import Chapters from './pages/Chapters';
import Lectures from './pages/Lectures';
import Practice from './pages/Practice';
import Notes from './pages/Notes';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Friends from './pages/Friends';
import Notifications from './pages/Notifications';
import Chat from './pages/Chat';
import MockTests from './pages/MockTests';
import TestAttempt from './pages/TestAttempt';
import QuizBattle from './pages/QuizBattle';
import QuizRoom from './pages/QuizRoom';
import Achievements from './pages/Achievements';
import Placeholder from './pages/Placeholder';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import BulkUpload from './pages/admin/BulkUpload';

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/admin" element={<AdminLogin />} />
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/bulk" element={<BulkUpload />} />

    <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/classes" element={<Classes />} />
      <Route path="/classes/:classId/subjects" element={<Subjects />} />
      <Route path="/subjects/:subjectId/chapters" element={<Chapters />} />
      <Route path="/chapters/:chapterId/lectures" element={<Lectures />} />
      <Route path="/chapters/:chapterId/notes" element={<Notes />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/practice" element={<Practice />} />
      <Route path="/mock-tests" element={<MockTests />} />
      <Route path="/mock-tests/:testId" element={<TestAttempt />} />
      <Route path="/quiz-battle" element={<QuizBattle />} />
      <Route path="/quiz-room/:roomId" element={<QuizRoom />} />
      <Route path="/achievements" element={<Achievements />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/chat/:userId" element={<Chat />} />
      <Route path="/lectures" element={<Lectures />} />
    </Route>

    <Route path="*" element={<Placeholder title="404 Not Found" />} />
  </Routes>
);

export default App;
