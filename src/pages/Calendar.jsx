import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';

export default function Calendar() {
  const { t } = useLang();
  const { dispatch } = useBooking();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const selectDate = (day) => {
    const date = new Date(viewYear, viewMonth, day);
    if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return;
    dispatch({ type: 'SELECT_DATE', payload: date });
  };

  const isPast = (day) => {
    return new Date(viewYear, viewMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const isToday = (day) => {
    return viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
  };

  const dayLabels = [t.calendar.mon, t.calendar.tue, t.calendar.wed, t.calendar.thu, t.calendar.fri, t.calendar.sat, t.calendar.sun];

  return (
    <div className="calendar-page">
      <h2>{t.calendar.title}</h2>
      <div className="calendar-container">
        <div className="calendar-header">
          <button className="cal-nav" onClick={prevMonth}>&lt;</button>
          <span className="cal-month">{t.calendar.months[viewMonth]} {viewYear}</span>
          <button className="cal-nav" onClick={nextMonth}>&gt;</button>
        </div>
        <div className="calendar-grid">
          {dayLabels.map(d => (
            <div key={d} className="cal-day-label">{d}</div>
          ))}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="cal-cell empty" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const past = isPast(day);
            return (
              <button
                key={day}
                className={`cal-cell ${past ? 'past' : ''} ${isToday(day) ? 'today' : ''}`}
                disabled={past}
                onClick={() => selectDate(day)}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
