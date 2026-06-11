import { Link, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/patients', label: 'Patients' },
  { to: '/appointments', label: 'Appointments' },
  { to: '/queue', label: 'Queue' },
  { to: '/reports', label: 'Reports' },
];

function Layout({ onLogout, theme, onToggleTheme }) {
  const location = useLocation();
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">Live Operations</span>
          <h1>Clinic Queue Manager</h1>
          <p>Patient flow, appointments, and queue updates in one place.</p>
        </div>
        <div className="topbar-actions">
          <span className="date-chip">{today}</span>
          <button type="button" onClick={onToggleTheme} className="secondary-btn">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button type="button" onClick={onLogout} className="secondary-btn">
            Logout
          </button>
        </div>
      </header>

      <nav className="nav-tabs">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={location.pathname === item.to ? 'tab active' : 'tab'}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="page-content">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>Done by Karam Khanji</p>
      </footer>
    </div>
  );
}

export default Layout;
