import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import ClientListPage from '../pages/ClientListPage';
import DashboardPage from '../pages/DashboardPage';
import JobsPage from '../pages/JobsPage';
import CalendarPage from '../pages/CalendarPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/clients" element={<ClientListPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;