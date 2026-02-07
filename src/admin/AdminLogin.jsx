import { useState } from 'react';
import { adminLogin } from '../data/storage';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (adminLogin(password)) {
      onLogin();
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="adm-login-page">
      <div className="adm-login-card">
        <div className="adm-login-icon">🔐</div>
        <h2>Admin Portal</h2>
        <p className="adm-login-sub">Enter the administrator password</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter admin password"
              autoFocus
            />
          </div>

          {error && <div className="adm-login-error">{error}</div>}

          <button type="submit" className="btn btn-primary btn-lg btn-full">
            Sign In
          </button>
        </form>

        <p className="adm-login-hint">Demo password: admin2024</p>
      </div>
    </div>
  );
}
