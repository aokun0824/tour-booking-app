import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';

export default function BookingForm() {
  const { lang, t } = useLang();
  const { state, dispatch } = useBooking();
  const driver = state.selectedDriver;

  const [form, setForm] = useState(state.guestInfo || {
    firstName: '', lastName: '', email: '', phone: '', hotel: '', guests: 1, notes: '',
  });
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = t.booking.required;
    if (!form.lastName.trim()) errs.lastName = t.booking.required;
    if (!form.email.trim()) errs.email = t.booking.required;
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = t.booking.invalidEmail;
    if (!form.phone.trim()) errs.phone = t.booking.required;
    if (!form.hotel.trim()) errs.hotel = t.booking.required;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch({ type: 'PROCEED_TO_PAYMENT', payload: form });
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'ja-JP', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <div className="booking-page">
      <button className="btn-text" onClick={() => dispatch({ type: 'BACK_TO_DRIVERS' })}>
        {t.booking.back}
      </button>
      <h2>{t.booking.title}</h2>

      <div className="booking-summary-bar">
        <div><strong>{t.booking.date}:</strong> {formatDate(state.selectedDate)}</div>
        <div><strong>{t.booking.driver}:</strong> {lang === 'ja' ? driver.nameJa : driver.name}</div>
        <div><strong>{t.booking.vehicle}:</strong> {driver.vehicle.name}</div>
        <div><strong>{t.booking.price}:</strong> ¥{driver.pricePerDay.toLocaleString()}</div>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <h3>{t.booking.guestInfo}</h3>
        <div className="form-row">
          <div className="form-group">
            <label>{t.booking.firstName} *</label>
            <input type="text" value={form.firstName} onChange={e => update('firstName', e.target.value)} />
            {errors.firstName && <span className="form-error">{errors.firstName}</span>}
          </div>
          <div className="form-group">
            <label>{t.booking.lastName} *</label>
            <input type="text" value={form.lastName} onChange={e => update('lastName', e.target.value)} />
            {errors.lastName && <span className="form-error">{errors.lastName}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{t.booking.email} *</label>
            <input type="email" value={form.email} onChange={e => update('email', e.target.value)} />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>{t.booking.phone} *</label>
            <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>{t.booking.hotel} *</label>
          <input type="text" value={form.hotel} onChange={e => update('hotel', e.target.value)} />
          {errors.hotel && <span className="form-error">{errors.hotel}</span>}
        </div>

        <div className="form-group">
          <label>{t.booking.guests}</label>
          <select value={form.guests} onChange={e => update('guests', Number(e.target.value))}>
            {Array.from({ length: driver.vehicle.seats }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>{t.booking.notes}</label>
          <textarea rows={3} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder={t.booking.notesPlaceholder} />
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-full">
          {t.booking.proceed}
        </button>
      </form>
    </div>
  );
}
