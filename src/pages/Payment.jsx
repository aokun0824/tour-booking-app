import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';
import { saveBooking, formatDateStr, getDriverById } from '../data/storage';
import { sendBookingEmails } from '../data/emailService';

export default function Payment() {
  const { lang, t } = useLang();
  const { state, dispatch } = useBooking();
  const driver = state.selectedDriver;

  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', holder: '' });
  const [processing, setProcessing] = useState(false);

  const formatCardNumber = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000));

    const bookingId = 'TBK-' + Date.now().toString(36).toUpperCase();
    const booking = {
      bookingId,
      driverId: driver.id,
      driverName: driver.name,
      vehicleName: driver.vehicle.name,
      date: formatDateStr(state.selectedDate),
      guestInfo: state.guestInfo,
      price: driver.pricePerDay,
      createdAt: new Date().toISOString(),
    };

    saveBooking(booking);

    // Send email notifications (non-blocking)
    const latestDriver = getDriverById(driver.id) || driver;
    const emailResult = await sendBookingEmails(booking, latestDriver);

    dispatch({
      type: 'CONFIRM_BOOKING',
      payload: { bookingId, emailResult },
    });
  };

  const isValid = card.number.replace(/\s/g, '').length === 16 &&
    card.expiry.length === 5 && card.cvc.length >= 3 && card.holder.trim().length > 0;

  return (
    <div className="payment-page">
      <button className="btn-text" onClick={() => dispatch({ type: 'BACK_TO_BOOKING' })} disabled={processing}>
        {t.payment.back}
      </button>
      <h2>{t.payment.title}</h2>

      <div className="payment-layout">
        <div className="payment-summary">
          <h3>{t.payment.summary}</h3>
          <div className="summary-row">
            <span>{t.booking.date}</span>
            <span>{state.selectedDate.toLocaleDateString(lang === 'en' ? 'en-US' : 'ja-JP')}</span>
          </div>
          <div className="summary-row">
            <span>{t.booking.driver}</span>
            <span>{lang === 'ja' ? driver.nameJa : driver.name}</span>
          </div>
          <div className="summary-row">
            <span>{t.booking.vehicle}</span>
            <span>{driver.vehicle.name}</span>
          </div>
          <div className="summary-row">
            <span>{t.booking.guests}</span>
            <span>{state.guestInfo.guests}</span>
          </div>
          <div className="summary-row total">
            <span>{t.payment.total}</span>
            <span>¥{driver.pricePerDay.toLocaleString()}</span>
          </div>
        </div>

        <form className="payment-form" onSubmit={handlePay}>
          <div className="demo-badge">{t.payment.demo}</div>

          <div className="form-group">
            <label>{t.payment.cardNumber}</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={card.number}
              onChange={e => setCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))}
              maxLength={19}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t.payment.expiry}</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={card.expiry}
                onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                maxLength={5}
              />
            </div>
            <div className="form-group">
              <label>{t.payment.cvc}</label>
              <input
                type="text"
                placeholder="123"
                value={card.cvc}
                onChange={e => setCard(c => ({ ...c, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                maxLength={4}
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t.payment.cardHolder}</label>
            <input
              type="text"
              placeholder="TARO YAMADA"
              value={card.holder}
              onChange={e => setCard(c => ({ ...c, holder: e.target.value }))}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={!isValid || processing}
          >
            {processing ? t.payment.processing : `${t.payment.pay} — ¥${driver.pricePerDay.toLocaleString()}`}
          </button>
        </form>
      </div>
    </div>
  );
}
