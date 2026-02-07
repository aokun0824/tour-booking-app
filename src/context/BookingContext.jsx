import { createContext, useContext, useReducer } from 'react';

const BookingContext = createContext();

const initialState = {
  step: 'home',       // home | calendar | drivers | driverDetail | booking | payment | confirmation
  selectedDate: null,
  selectedDriver: null,
  guestInfo: null,
  bookingId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'GO_HOME':
      return { ...initialState };
    case 'GO_CALENDAR':
      return { ...state, step: 'calendar' };
    case 'SELECT_DATE':
      return { ...state, step: 'drivers', selectedDate: action.payload };
    case 'VIEW_DRIVER_DETAIL':
      return { ...state, step: 'driverDetail', selectedDriver: action.payload };
    case 'SELECT_DRIVER':
      return { ...state, step: 'booking', selectedDriver: action.payload };
    case 'BACK_TO_DRIVERS':
      return { ...state, step: 'drivers', selectedDriver: null };
    case 'BACK_TO_CALENDAR':
      return { ...state, step: 'calendar', selectedDate: null, selectedDriver: null };
    case 'PROCEED_TO_PAYMENT':
      return { ...state, step: 'payment', guestInfo: action.payload };
    case 'BACK_TO_BOOKING':
      return { ...state, step: 'booking' };
    case 'CONFIRM_BOOKING':
      return { ...state, step: 'confirmation', bookingId: action.payload };
    default:
      return state;
  }
}

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}
