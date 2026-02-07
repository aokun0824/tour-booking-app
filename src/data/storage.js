import defaultDrivers from './drivers';

const STORAGE_KEYS = {
  DRIVERS: 'tbk_drivers',
  BOOKINGS: 'tbk_bookings',
  DRIVER_SESSION: 'tbk_driver_session',
  ADMIN_SESSION: 'tbk_admin_session',
};

const ADMIN_PASSWORD = 'admin2024';

// --- Drivers ---

function getDefaultDrivers() {
  return defaultDrivers.map(d => ({
    ...d,
    password: 'pass' + d.id,
    availableDates: [],
  }));
}

export function loadDrivers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRIVERS);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  const defaults = getDefaultDrivers();
  saveDrivers(defaults);
  return defaults;
}

export function saveDrivers(drivers) {
  localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
}

export function updateDriver(id, updates) {
  const drivers = loadDrivers();
  const idx = drivers.findIndex(d => d.id === id);
  if (idx === -1) return null;
  drivers[idx] = { ...drivers[idx], ...updates };
  saveDrivers(drivers);
  return drivers[idx];
}

export function getDriverById(id) {
  return loadDrivers().find(d => d.id === id) || null;
}

export function addDriver(driverData) {
  const drivers = loadDrivers();
  const maxId = drivers.reduce((max, d) => Math.max(max, d.id), 0);
  const newDriver = {
    id: maxId + 1,
    name: driverData.name || 'New Driver',
    nameJa: driverData.nameJa || '新しいドライバー',
    photo: `https://api.dicebear.com/9.x/personas/svg?seed=${driverData.name?.replace(/\s/g, '') || 'new' + (maxId + 1)}`,
    experience: Number(driverData.experience) || 0,
    rating: 5.0,
    reviewCount: 0,
    languages: driverData.languages || ['English', 'Japanese'],
    languagesJa: driverData.languagesJa || ['英語', '日本語'],
    bio: driverData.bio || '',
    bioJa: driverData.bioJa || '',
    specialties: driverData.specialties || [],
    specialtiesJa: driverData.specialtiesJa || [],
    vehicle: driverData.vehicle || { name: 'Toyota', seats: 4, type: 'Sedan' },
    pricePerDay: Number(driverData.pricePerDay) || 30000,
    availableDays: driverData.availableDays || [1, 2, 3, 4, 5],
    availableDates: [],
    reviews: [],
    password: 'pass' + (maxId + 1),
  };
  drivers.push(newDriver);
  saveDrivers(drivers);
  return newDriver;
}

export function deleteDriver(id) {
  const drivers = loadDrivers().filter(d => d.id !== id);
  saveDrivers(drivers);
  return drivers;
}

export function getDriversForDate(date) {
  const drivers = loadDrivers();
  const dayOfWeek = date.getDay();
  const dateStr = formatDateStr(date);
  return drivers.filter(d => {
    if (d.availableDates && d.availableDates.length > 0) {
      return d.availableDates.includes(dateStr);
    }
    return d.availableDays.includes(dayOfWeek);
  });
}

// --- Bookings ---

export function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

export function saveBooking(booking) {
  const bookings = loadBookings();
  bookings.push(booking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  return booking;
}

export function getBookingsForDriver(driverId) {
  return loadBookings().filter(b => b.driverId === driverId);
}

// --- Driver Auth ---

export function driverLogin(driverId, password) {
  const driver = getDriverById(driverId);
  if (!driver) return null;
  if (driver.password !== password) return null;
  localStorage.setItem(STORAGE_KEYS.DRIVER_SESSION, JSON.stringify({ driverId: driver.id }));
  return driver;
}

export function getDriverSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRIVER_SESSION);
    if (raw) {
      const session = JSON.parse(raw);
      return getDriverById(session.driverId);
    }
  } catch { /* ignore */ }
  return null;
}

export function driverLogout() {
  localStorage.removeItem(STORAGE_KEYS.DRIVER_SESSION);
}

// --- Admin Auth ---

export function adminLogin(password) {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify({ loggedIn: true, ts: Date.now() }));
    return true;
  }
  return false;
}

export function getAdminSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    if (raw) return JSON.parse(raw).loggedIn === true;
  } catch { /* ignore */ }
  return false;
}

export function adminLogout() {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
}

// --- Helpers ---

export function formatDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
