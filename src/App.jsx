import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Logbook from './pages/Logbook';
import Documents from './pages/Documents';
import Placements from './pages/Placements';
import Reports from './pages/Reports';
import UsersManagement from './pages/UsersManagement';
import LetterRequest from './pages/LetterRequest';
import AdminLetterRequests from './pages/AdminLetterRequests';
import AdminOpportunities from './pages/AdminOpportunities';
import Opportunities from './pages/Opportunities';
import Profile from './pages/Profile';

// Helper component for role-based redirection
const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const role = user.role?.toLowerCase();
  
  if (role === 'admin') return <Navigate to="/dashboard/admin" replace />;
  if (role === 'supervisor') return <Navigate to="/dashboard/supervisor" replace />;
  return <Navigate to="/dashboard/student" replace />;
};

import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="placements" element={<Placements />} />
              <Route path="reports" element={<Reports />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="admin/letters" element={<AdminLetterRequests />} />
              <Route path="admin/internships" element={<AdminOpportunities />} />
            </Route>

            {/* Supervisor Routes */}
            <Route element={<ProtectedRoute allowedRoles={['supervisor']} />}>
              <Route path="supervisor" element={<SupervisorDashboard />} />
            </Route>

            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="student" element={<StudentDashboard />} />
              <Route path="opportunities" element={<Opportunities />} />
              <Route path="letter-request" element={<LetterRequest />} />
              <Route path="logbook" element={<Logbook />} />
              <Route path="documents" element={<Documents />} />
            </Route>

            {/* Shared Dashboard Routes */}
            <Route path="profile" element={<Profile />} />

            {/* Dashboard Redirects */}
            <Route index element={<RoleRedirect />} />
            <Route path="*" element={<RoleRedirect />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  </AuthProvider>
  );
}

export default App;
