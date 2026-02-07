import { useState, useEffect } from 'react';
import { getDriverSession, driverLogout } from '../data/storage';
import DriverLogin from './DriverLogin';
import DriverNavbar from './DriverNavbar';
import Dashboard from './Dashboard';
import Schedule from './Schedule';
import Bookings from './Bookings';
import Profile from './Profile';

export default function DriverApp() {
  const [driver, setDriver] = useState(() => getDriverSession());
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = (d) => setDriver(d);

  const handleLogout = () => {
    driverLogout();
    setDriver(null);
    setActiveTab('dashboard');
  };

  const handleDriverUpdate = (updated) => {
    setDriver(updated);
  };

  if (!driver) {
    return <DriverLogin onLogin={handleLogin} />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard driver={driver} onTabChange={setActiveTab} />;
      case 'schedule': return <Schedule driver={driver} onDriverUpdate={handleDriverUpdate} />;
      case 'bookings': return <Bookings driver={driver} />;
      case 'profile': return <Profile driver={driver} onDriverUpdate={handleDriverUpdate} />;
      default: return <Dashboard driver={driver} onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="driver-app">
      <DriverNavbar
        driver={driver}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />
      <main className="d-main">
        {renderTab()}
      </main>
    </div>
  );
}
