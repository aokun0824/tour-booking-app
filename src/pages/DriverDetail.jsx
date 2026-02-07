import { useLang } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';

export default function DriverDetail() {
  const { lang, t } = useLang();
  const { state, dispatch } = useBooking();
  const driver = state.selectedDriver;

  return (
    <div className="driver-detail-page">
      <button className="btn-text" onClick={() => dispatch({ type: 'BACK_TO_DRIVERS' })}>
        {t.driverDetail.back}
      </button>

      <div className="detail-header">
        <img src={driver.photo} alt={driver.name} className="detail-photo" />
        <div className="detail-header-info">
          <h2>{lang === 'ja' ? driver.nameJa : driver.name}</h2>
          <div className="driver-rating">★ {driver.rating} ({driver.reviewCount})</div>
          <div className="driver-exp">{driver.experience} {t.drivers.experience}</div>
          <div className="driver-langs">
            {t.drivers.languages}: {(lang === 'ja' ? driver.languagesJa : driver.languages).join(', ')}
          </div>
          <div className="detail-price">¥{driver.pricePerDay.toLocaleString()} {t.drivers.perDay}</div>
        </div>
      </div>

      <section className="detail-section">
        <h3>{t.driverDetail.about}</h3>
        <p>{lang === 'ja' ? driver.bioJa : driver.bio}</p>
      </section>

      <section className="detail-section">
        <h3>{t.driverDetail.specialties}</h3>
        <div className="specialty-tags">
          {(lang === 'ja' ? driver.specialtiesJa : driver.specialties).map((s, i) => (
            <span key={i} className="tag">{s}</span>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <h3>{t.driverDetail.vehicle}</h3>
        <div className="vehicle-detail">
          <span className="vehicle-icon-lg">🚗</span>
          <div>
            <strong>{driver.vehicle.name}</strong>
            <p>{driver.vehicle.type} · {driver.vehicle.seats} {t.drivers.seats}</p>
          </div>
        </div>
      </section>

      <section className="detail-section">
        <h3>{t.driverDetail.reviews}</h3>
        <div className="reviews-list">
          {driver.reviews.map((r, i) => (
            <div key={i} className="review-card">
              <div className="review-header">
                <strong>{r.author}</strong>
                <span>{'★'.repeat(r.rating)}</span>
              </div>
              <p>{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      <button className="btn btn-primary btn-lg btn-full" onClick={() => dispatch({ type: 'SELECT_DRIVER', payload: driver })}>
        {t.driverDetail.bookNow}
      </button>
    </div>
  );
}
