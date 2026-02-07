import { useState } from 'react';
import { updateDriver, formatDateStr } from '../data/storage';

export default function Schedule({ driver, onDriverUpdate }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [saved, setSaved] = useState(false);

  const availableDates = new Set(driver.availableDates || []);

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const isPast = (day) => {
    return new Date(viewYear, viewMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const toggleDate = (day) => {
    if (isPast(day)) return;
    const dateStr = formatDateStr(new Date(viewYear, viewMonth, day));
    const newDates = new Set(availableDates);
    if (newDates.has(dateStr)) {
      newDates.delete(dateStr);
    } else {
      newDates.add(dateStr);
    }
    const updated = updateDriver(driver.id, { availableDates: [...newDates] });
    onDriverUpdate(updated);
    setSaved(false);
  };

  const isAvailable = (day) => {
    const dateStr = formatDateStr(new Date(viewYear, viewMonth, day));
    return availableDates.has(dateStr);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const selectAllWeekdays = () => {
    const newDates = new Set(availableDates);
    for (let day = 1; day <= daysInMonth; day++) {
      if (isPast(day)) continue;
      const date = new Date(viewYear, viewMonth, day);
      const dow = date.getDay();
      if (dow >= 1 && dow <= 5) {
        newDates.add(formatDateStr(date));
      }
    }
    const updated = updateDriver(driver.id, { availableDates: [...newDates] });
    onDriverUpdate(updated);
  };

  const clearMonth = () => {
    const newDates = new Set(availableDates);
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateStr(new Date(viewYear, viewMonth, day));
      newDates.delete(dateStr);
    }
    const updated = updateDriver(driver.id, { availableDates: [...newDates] });
    onDriverUpdate(updated);
  };

  return (
    <div className="d-schedule">
      <h2>Manage Schedule</h2>
      <p className="d-schedule-sub">Click dates to toggle your availability. Green dates are visible to customers.</p>

      <div className="d-schedule-actions">
        <button className="btn btn-outline btn-sm" onClick={selectAllWeekdays}>
          Select Weekdays
        </button>
        <button className="btn btn-outline btn-sm" onClick={clearMonth}>
          Clear Month
        </button>
      </div>

      <div className="d-schedule-cal">
        <div className="calendar-header">
          <button className="cal-nav" onClick={prevMonth}>&lt;</button>
          <span className="cal-month">{months[viewMonth]} {viewYear}</span>
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
            const available = isAvailable(day);
            return (
              <button
                key={day}
                className={`cal-cell ${past ? 'past' : ''} ${available ? 'available' : ''}`}
                disabled={past}
                onClick={() => toggleDate(day)}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="d-schedule-legend">
        <span><span className="legend-dot available" /> Available</span>
        <span><span className="legend-dot" /> Not available</span>
        <span><span className="legend-dot past" /> Past</span>
      </div>
    </div>
  );
}
