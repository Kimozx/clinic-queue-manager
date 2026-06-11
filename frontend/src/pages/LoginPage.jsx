import { useState } from 'react';
import { api } from '../api';

function LoginPage({ onLogin, theme, onToggleTheme }) {
  const [form, setForm] = useState({ username: 'staff', password: 'password123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await api.login(form);
      onLogin(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-theme-toggle">
        <button type="button" className="secondary-btn" onClick={onToggleTheme}>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <form className="card login-card" onSubmit={handleSubmit}>
        <h2>Staff Login</h2>
        <p className="muted">Use the default demo account pre-filled below.</p>
        <div className="login-footer-hint">
          <span>Done by Karam Khanji</span>
        </div>

        <label>
          Username
          <input
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </label>

        {error ? <p className="error">{error}</p> : null}

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
