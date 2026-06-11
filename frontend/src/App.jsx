import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import QueuePage from './pages/QueuePage';
import ReportsPage from './pages/ReportsPage';

function ProtectedRoutes({ isAuthenticated, onLogout, theme, onToggleTheme }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route element={<Layout onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem('clinic_auth');
    return raw ? JSON.parse(raw) : null;
  });
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('clinic_theme');
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const isAuthenticated = useMemo(() => Boolean(auth?.token), [auth]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('clinic_theme', theme);
  }, [theme]);

  const handleLogin = (payload) => {
    setAuth(payload);
    localStorage.setItem('clinic_auth', JSON.stringify(payload));
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem('clinic_auth');
  };

  const handleToggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLogin={handleLogin} theme={theme} onToggleTheme={handleToggleTheme} />
            )
          }
        />
        <Route
          path="*"
          element={
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
              theme={theme}
              onToggleTheme={handleToggleTheme}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
