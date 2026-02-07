import { useLang } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';

export default function Confirmation() {
  const { lang, t } = useLang();
  const { state, dispatch } = useBooking();
  const driver = state.selectedDriver;
  const emailResult = state.emailResult;

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

        {emailResult && (
          <div className="email-status">
            <div className={`email-badge ${emailResult.mode === 'demo' ? 'demo' : 'live'}`}>
              {emailResult.mode === 'demo'
                ? (lang === 'en'
                    ? '📧 Email notifications logged (Demo Mode)'
                    : '📧 メール通知を記録しました（デモモード）')
                : (lang === 'en'
                    ? '📧 Confirmation emails sent!'
                    : '📧 確認メールを送信しました！')
              }
            </div>
            <div className="email-recipients">
              <span className="email-recipient">
                {lang === 'en' ? '→ Guest' : '→ 観光客'}: {state.guestInfo.email}
              </span>
              <span className="email-recipient">
                {lang === 'en' ? '→ Driver' : '→ ドライバー'}: {lang === 'ja' ? driver.nameJa : driver.name}
              </span>
              <span className="email-recipient">
                {lang === 'en' ? '→ Admin' : '→ 管理者'}: admin@demo.tourbooking.jp
              </span>
            </div>
            {emailResult.mode === 'demo' && (
              <p className="email-demo-note">
                {lang === 'en'
                  ? 'In production, emails will be sent to all three parties automatically.'
                  : '本番環境では、観光客・ドライバー・管理者の3者に自動的にメールが送信されます。'}
              </p>
            )}
          </div>
        )}

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
