import { useLang } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';

export default function Confirmation() {
  const { lang, t } = useLang();
  const { state, dispatch } = useBooking();
  const driver = state.selectedDriver;

  return (
    <div className="confirmation-page">
      <div className="confirm-card">
        <div className="confirm-icon">✓</div>
        <h2>{t.confirmation.title}</h2>
        <p>{t.confirmation.thankYou}</p>

        <div className="booking-id">
          <span>{t.confirmation.bookingId}</span>
          <strong>{state.bookingId}</strong>
        </div>

        <div className="confirm-details">
          <h3>{t.confirmation.details}</h3>
          <div className="confirm-row">
            <span>{t.confirmation.date}</span>
            <span>{state.selectedDate.toLocaleDateString(lang === 'en' ? 'en-US' : 'ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="confirm-row">
            <span>{t.confirmation.driver}</span>
            <span>{lang === 'ja' ? driver.nameJa : driver.name}</span>
          </div>
          <div className="confirm-row">
            <span>{t.confirmation.vehicle}</span>
            <span>{driver.vehicle.name}</span>
          </div>
          <div className="confirm-row">
            <span>{t.confirmation.guests}</span>
            <span>{state.guestInfo.guests}</span>
          </div>
          <div className="confirm-row">
            <span>{t.confirmation.pickup}</span>
            <span>{state.guestInfo.hotel}</span>
          </div>
        </div>

        <p className="confirm-email">
          {t.confirmation.email}: <strong>{state.guestInfo.email}</strong>
        </p>

        <p className="confirm-note">{t.confirmation.note}</p>

        <button className="btn btn-primary btn-lg" onClick={() => dispatch({ type: 'GO_HOME' })}>
          {t.confirmation.newBooking}
        </button>
      </div>
    </div>
  );
}
