import { useState } from 'react';
import { loadDrivers, addDriver, updateDriver, deleteDriver, loadBookings } from '../data/storage';
import { getEmailLog } from '../data/emailService';
import DriverForm from './DriverForm';

export default function AdminDashboard({ onLogout }) {
  const [drivers, setDrivers] = useState(() => loadDrivers());
  const [view, setView] = useState('list'); // list | add | edit
  const [editingDriver, setEditingDriver] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('drivers'); // drivers | bookings | emails

  const bookings = loadBookings();
  const emailLog = getEmailLog();

  const refresh = () => setDrivers(loadDrivers());

  const handleAdd = (data) => {
    addDriver(data);
    refresh();
    setView('list');
  };

  const handleEdit = (data) => {
    updateDriver(editingDriver.id, data);
    refresh();
    setView('list');
    setEditingDriver(null);
  };

  const handleDelete = (id) => {
    deleteDriver(id);
    refresh();
    setConfirmDelete(null);
  };

  const startEdit = (driver) => {
    setEditingDriver(driver);
    setView('edit');
  };

  return (
    <div className="adm-app">
      <nav className="adm-navbar">
        <div className="adm-navbar-inner">
          <span className="adm-navbar-logo">🔐 Admin Portal</span>
          <div className="adm-tabs">
            <button className={`adm-tab ${activeTab === 'drivers' ? 'active' : ''}`} onClick={() => { setActiveTab('drivers'); setView('list'); }}>
              Drivers ({drivers.length})
            </button>
            <button className={`adm-tab ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
              Bookings ({bookings.length})
            </button>
            <button className={`adm-tab ${activeTab === 'emails' ? 'active' : ''}`} onClick={() => setActiveTab('emails')}>
              Emails ({emailLog.length})
            </button>
          </div>
          <button className="btn-text adm-logout" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <main className="adm-main">
        {activeTab === 'drivers' && (
          <>
            {view === 'list' && (
              <div className="adm-drivers">
                <div className="adm-header">
                  <h2>Manage Drivers</h2>
                  <button className="btn btn-primary" onClick={() => setView('add')}>+ Add Driver</button>
                </div>

                <div className="adm-driver-list">
                  {drivers.map(d => (
                    <div key={d.id} className="adm-driver-card">
                      <img src={d.photo} alt={d.name} className="adm-driver-photo" />
                      <div className="adm-driver-info">
                        <h3>{d.name} <span className="adm-driver-ja">({d.nameJa})</span></h3>
                        <div className="adm-driver-meta">
                          <span>ID: {d.id}</span>
                          <span>★ {d.rating}</span>
                          <span>{d.experience}y exp</span>
                          <span>{d.vehicle.name}</span>
                          <span>¥{d.pricePerDay.toLocaleString()}/day</span>
                        </div>
                        <div className="adm-driver-langs">
                          {d.languages.join(', ')}
                        </div>
                      </div>
                      <div className="adm-driver-actions">
                        <button className="btn btn-outline btn-sm" onClick={() => startEdit(d)}>Edit</button>
                        {confirmDelete === d.id ? (
                          <div className="adm-confirm-delete">
                            <span>Delete?</span>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id)}>Yes</button>
                            <button className="btn btn-outline btn-sm" onClick={() => setConfirmDelete(null)}>No</button>
                          </div>
                        ) : (
                          <button className="btn btn-danger-outline btn-sm" onClick={() => setConfirmDelete(d.id)}>Delete</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view === 'add' && (
              <DriverForm onSave={handleAdd} onCancel={() => setView('list')} />
            )}

            {view === 'edit' && editingDriver && (
              <DriverForm driver={editingDriver} onSave={handleEdit} onCancel={() => { setView('list'); setEditingDriver(null); }} />
            )}
          </>
        )}

        {activeTab === 'bookings' && (
          <div className="adm-bookings">
            <h2>All Bookings</h2>
            {bookings.length === 0 ? (
              <p className="adm-empty">No bookings yet.</p>
            ) : (
              <div className="adm-booking-list">
                {[...bookings].reverse().map(b => (
                  <div key={b.bookingId} className="adm-booking-card">
                    <div className="adm-booking-top">
                      <strong>{b.bookingId}</strong>
                      <span className="adm-booking-date">{b.date}</span>
                    </div>
                    <div className="adm-booking-body">
                      <div><span>Guest:</span> {b.guestInfo.firstName} {b.guestInfo.lastName}</div>
                      <div><span>Email:</span> {b.guestInfo.email}</div>
                      <div><span>Phone:</span> {b.guestInfo.phone}</div>
                      <div><span>Driver:</span> {b.driverName} (ID: {b.driverId})</div>
                      <div><span>Vehicle:</span> {b.vehicleName}</div>
                      <div><span>Pickup:</span> {b.guestInfo.hotel}</div>
                      <div><span>Guests:</span> {b.guestInfo.guests}</div>
                      <div><span>Price:</span> ¥{b.price?.toLocaleString()}</div>
                      {b.guestInfo.notes && <div><span>Notes:</span> {b.guestInfo.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'emails' && (
          <div className="adm-emails">
            <h2>Email Log</h2>
            <p className="adm-email-note">
              All email notifications are logged here. In demo mode, no actual emails are sent.
              Configure EmailJS environment variables to enable real sending.
            </p>
            {emailLog.length === 0 ? (
              <p className="adm-empty">No emails sent yet. Complete a booking to see email logs.</p>
            ) : (
              <div className="adm-email-list">
                {[...emailLog].reverse().map((e, i) => (
                  <div key={i} className="adm-email-card">
                    <div className="adm-email-header">
                      <span className={`adm-email-type ${e.type}`}>
                        {e.type === 'customer_confirmation' ? '📧 Customer' : '📧 Driver'}
                      </span>
                      <span className={`adm-email-mode ${e.mode}`}>{e.mode}</span>
                      <span className="adm-email-time">{new Date(e.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="adm-email-body">
                      <div><strong>To:</strong> {e.params.to_name} ({e.params.to_email})</div>
                      <div><strong>Booking:</strong> {e.params.booking_id}</div>
                      <div><strong>Date:</strong> {e.params.tour_date}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
