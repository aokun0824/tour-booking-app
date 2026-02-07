import { useLang } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';
import { getDriversForDate } from '../data/drivers';

export default function DriverList() {
  const { lang, t } = useLang();
  const { state, dispatch } = useBooking();
  const availableDrivers = getDriversForDate(state.selectedDate);

  const formatDate = (date) => {
    return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'ja-JP', {
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
    });
  };

  const formatPrice = (price) => {
    return `¥${price.toLocaleString()}`;
  };

  return (
    <div className="drivers-page">
      <button className="btn-text" onClick={() => dispatch({ type: 'BACK_TO_CALENDAR' })}>
        {t.drivers.backToCalendar}
      </button>
      <h2>{t.drivers.title}</h2>
      <p className="selected-date">{formatDate(state.selectedDate)}</p>

      {availableDrivers.length === 0 ? (
        <p className="no-drivers">{t.drivers.noDrivers}</p>
      ) : (
        <div className="driver-grid">
          {availableDrivers.map(driver => (
            <div key={driver.id} className="driver-card">
              <div className="driver-card-top">
                <img src={driver.photo} alt={driver.name} className="driver-photo" />
                <div className="driver-info">
                  <h3>{lang === 'ja' ? driver.nameJa : driver.name}</h3>
                  <div className="driver-rating">★ {driver.rating} ({driver.reviewCount})</div>
                  <div className="driver-exp">{driver.experience} {t.drivers.experience}</div>
                  <div className="driver-langs">
                    {t.drivers.languages}: {(lang === 'ja' ? driver.languagesJa : driver.languages).join(', ')}
                  </div>
                </div>
              </div>
              <div className="driver-vehicle">
                <span className="vehicle-icon">🚗</span>
                {driver.vehicle.name} · {driver.vehicle.seats} {t.drivers.seats}
              </div>
              <div className="driver-price">
                {formatPrice(driver.pricePerDay)} {t.drivers.perDay}
              </div>
              <div className="driver-actions">
                <button className="btn btn-outline" onClick={() => dispatch({ type: 'VIEW_DRIVER_DETAIL', payload: driver })}>
                  {t.drivers.details}
                </button>
                <button className="btn btn-primary" onClick={() => dispatch({ type: 'SELECT_DRIVER', payload: driver })}>
                  {t.drivers.select}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
