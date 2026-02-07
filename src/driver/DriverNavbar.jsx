export default function DriverNavbar({ driver, activeTab, onTabChange, onLogout }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'bookings', label: 'Bookings', icon: '📋' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <nav className="d-navbar">
      <div className="d-navbar-inner">
        <div className="d-navbar-left">
          <span className="d-navbar-logo">🚗 Driver Portal</span>
          <span className="d-navbar-name">{driver.name}</span>
        </div>
        <div className="d-navbar-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`d-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="d-tab-icon">{tab.icon}</span>
              <span className="d-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
        <button className="btn-text d-logout" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}
