import { getBookingsForDriver } from '../data/storage';

export default function Dashboard({ driver, onTabChange }) {
  const bookings = getBookingsForDriver(driver.id);
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const upcoming = bookings.filter(b => b.date >= todayStr);
  const past = bookings.filter(b => b.date < todayStr);

  const scheduledDays = driver.availableDates?.length || 0;

  return (
    <div className="d-dashboard">
      <h2>Welcome back, {driver.name.split(' ')[0]}!</h2>

      <div className="d-stats">
        <div className="d-stat-card">
          <div className="d-stat-number">{upcoming.length}</div>
          <div className="d-stat-label">Upcoming Bookings</div>
        </div>
        <div className="d-stat-card">
          <div className="d-stat-number">{past.length}</div>
          <div className="d-stat-label">Completed Tours</div>
        </div>
        <div className="d-stat-card">
          <div className="d-stat-number">{scheduledDays}</div>
          <div className="d-stat-label">Scheduled Days</div>
        </div>
        <div className="d-stat-card">
          <div className="d-stat-number">¥{driver.pricePerDay.toLocaleString()}</div>
          <div className="d-stat-label">Price / Day</div>
        </div>
      </div>

      <div className="d-dashboard-grid">
        <div className="d-panel">
          <h3>Upcoming Bookings</h3>
          {upcoming.length === 0 ? (
            <p className="d-empty">No upcoming bookings yet.</p>
          ) : (
            <div className="d-booking-list">
              {upcoming.slice(0, 5).map(b => (
                <div key={b.bookingId} className="d-booking-row">
                  <div>
                    <strong>{b.guestInfo.firstName} {b.guestInfo.lastName}</strong>
                    <span className="d-booking-date">{b.date}</span>
                  </div>
                  <span className="d-booking-guests">{b.guestInfo.guests} guests</span>
                </div>
              ))}
            </div>
          )}
          {upcoming.length > 0 && (
            <button className="btn-text" onClick={() => onTabChange('bookings')}>View all →</button>
          )}
        </div>

        <div className="d-panel">
          <h3>Quick Actions</h3>
          <div className="d-quick-actions">
            <button className="d-action-btn" onClick={() => onTabChange('schedule')}>
              <span>📅</span> Manage Schedule
            </button>
            <button className="d-action-btn" onClick={() => onTabChange('profile')}>
              <span>👤</span> Edit Profile
            </button>
            <button className="d-action-btn" onClick={() => onTabChange('bookings')}>
              <span>📋</span> View Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
