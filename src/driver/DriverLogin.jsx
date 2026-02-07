import { useState } from 'react';
import { loadDrivers, driverLogin } from '../data/storage';

export default function DriverLogin({ onLogin }) {
  const drivers = loadDrivers();
  const [selectedId, setSelectedId] = useState(drivers[0]?.id || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const driver = driverLogin(Number(selectedId), password);
    if (driver) {
      onLogin(driver);
    } else {
      setError('Invalid password. Hint: pass + driver ID (e.g. pass1)');
    }
  };

  return (
    <div className="d-login-page">
      <div className="d-login-card">
        <div className="d-login-icon">🚗</div>
        <h2>Driver Portal</h2>
        <p className="d-login-sub">Sign in to manage your tours</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Driver</label>
            <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.nameJa})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          {error && <div className="d-login-error">{error}</div>}

          <button type="submit" className="btn btn-primary btn-lg btn-full">
            Sign In
          </button>
        </form>

        <p className="d-login-hint">
          Demo: select any driver, password is "pass" + ID (e.g. pass1, pass2...)
        </p>
      </div>
    </div>
  );
}
