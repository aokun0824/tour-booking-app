import { useLang } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';

export default function Navbar() {
  const { t, toggleLang } = useLang();
  const { dispatch } = useBooking();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="nav-logo" onClick={() => dispatch({ type: 'GO_HOME' })}>
          <span className="logo-icon">🗾</span>
          <span className="logo-text">{t.nav.title}</span>
        </button>
        <button className="lang-toggle" onClick={toggleLang}>
          {t.nav.language}
        </button>
      </div>
    </nav>
  );
}
