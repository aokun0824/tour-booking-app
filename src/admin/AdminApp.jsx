import { useState } from 'react';
import { getAdminSession, adminLogout } from '../data/storage';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function AdminApp() {
  const [loggedIn, setLoggedIn] = useState(() => getAdminSession());

  const handleLogout = () => {
    adminLogout();
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
