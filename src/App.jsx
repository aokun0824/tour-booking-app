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
import './App.css';

function AppContent() {
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

export default function App() {
  return (
    <LanguageProvider>
      <BookingProvider>
        <AppContent />
      </BookingProvider>
    </LanguageProvider>
  );
}
