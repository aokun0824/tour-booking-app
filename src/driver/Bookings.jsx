import { useState } from 'react';
import { getBookingsForDriver } from '../data/storage';

export default function Bookings({ driver }) {
  const bookings = getBookingsForDriver(driver.id);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const todayStr = new Date().toISOString().split('T')[0];
  const filtered = bookings.filter(b => {
    if (filter === 'upcoming') return b.date >= todayStr;
    if (filter === 'past') return b.date < todayStr;
    return true;
  }).sort((a, b) => a.date > b.date ? -1 : 1);

  if (selected) {
    const b = selected;
    return (
      <div className="d-bookings">
        <button className="btn-text" onClick={() => setSelected(null)}>← Back to list</button>
        <div className="d-booking-detail">
          <h2>Booking Details</h2>
          <div className="d-booking-id">{b.bookingId}</div>

          <div className="d-detail-grid">
            <div className="d-detail-row"><span>Date</span><strong>{b.date}</strong></div>
            <div className="d-detail-row"><span>Guest</span><strong>{b.guestInfo.firstName} {b.guestInfo.lastName}</strong></div>
            <div className="d-detail-row"><span>Email</span><strong>{b.guestInfo.email}</strong></div>
            <div className="d-detail-row"><span>Phone</span><strong>{b.guestInfo.phone}</strong></div>
            <div className="d-detail-row"><span>Pickup</span><strong>{b.guestInfo.hotel}</strong></div>
            <div className="d-detail-row"><span>Guests</span><strong>{b.guestInfo.guests}</strong></div>
            <div className="d-detail-row"><span>Price</span><strong>¥{b.price?.toLocaleString() || '—'}</strong></div>
          </div>

          {b.guestInfo.notes && (
            <div className="d-detail-notes">
              <h4>Special Requests</h4>
              <p>{b.guestInfo.notes}</p>
            </div>
          )}

          <div className={`d-status-badge ${b.date >= todayStr ? 'upcoming' : 'past'}`}>
            {b.date >= todayStr ? 'Upcoming' : 'Completed'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-bookings">
      <h2>Bookings</h2>

      <div className="d-filter-bar">
        {['all', 'upcoming', 'past'].map(f => (
          <button
            key={f}
            className={`d-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({
              f === 'all' ? bookings.length :
              f === 'upcoming' ? bookings.filter(b => b.date >= todayStr).length :
              bookings.filter(b => b.date < todayStr).length
            })
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="d-empty-state">
          <p>No bookings found.</p>
          <p className="d-empty-sub">When customers book your tours, they'll appear here.</p>
        </div>
      ) : (
        <div className="d-booking-table">
          {filtered.map(b => (
            <div key={b.bookingId} className="d-booking-card" onClick={() => setSelected(b)}>
              <div className="d-booking-card-left">
                <div className="d-booking-card-date">{b.date}</div>
                <div className="d-booking-card-guest">
                  {b.guestInfo.firstName} {b.guestInfo.lastName}
                </div>
                <div className="d-booking-card-meta">
                  {b.guestInfo.guests} guests · {b.guestInfo.hotel}
                </div>
              </div>
              <div className="d-booking-card-right">
                <div className="d-booking-card-price">¥{b.price?.toLocaleString() || '—'}</div>
                <div className={`d-status-badge-sm ${b.date >= todayStr ? 'upcoming' : 'past'}`}>
                  {b.date >= todayStr ? 'Upcoming' : 'Done'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
