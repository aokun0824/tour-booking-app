import { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { BookingProvider, useBooking } from './context/BookingContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import DriverList from './pages/DriverList';
import DriverDetail from './pages/DriverDetail';
import BookingForm from './pages/BookingForm';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';
import DriverApp from './driver/DriverApp';
import AdminApp from './admin/AdminApp';
import './App.css';
import './driver/driver.css';
import './admin/admin.css';

function CustomerApp() {
  const { state } = useBooking();

  const renderPage = () => {
    switch (state.step) {
      case 'home': return <Home />;
      case 'calendar': return <Calendar />;
      case 'drivers': return <DriverList />;
      case 'driverDetail': return <DriverDetail />;
      case 'booking': return <BookingForm />;
      case 'payment': return <Payment />;
      case 'confirmation': return <Confirmation />;
      default: return <Home />;
    }
  };

  return (
    <>
      <Navbar />
      <main className="main-content">
        {renderPage()}
      </main>
    </>
  );
}

function Router() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (route === '#/driver') {
    return <DriverApp />;
  }

  if (route === '#/admin') {
    return <AdminApp />;
  }

  return (
    <LanguageProvider>
      <BookingProvider>
        <CustomerApp />
      </BookingProvider>
    </LanguageProvider>
  );
}

export default function App() {
  return <Router />;
}
