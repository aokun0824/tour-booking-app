import { useLang } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';

const destinations = [
  { img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop', en: 'Kyoto Temples', ja: '京都の寺院' },
  { img: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400&h=300&fit=crop', en: 'Mount Fuji', ja: '富士山' },
  { img: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&h=300&fit=crop', en: 'Tokyo Shibuya', ja: '東京・渋谷' },
  { img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=300&fit=crop', en: 'Osaka Street Food', ja: '大阪グルメ' },
];

export default function Home() {
  const { lang, t } = useLang();
  const { dispatch } = useBooking();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>{t.home.hero}</h1>
          <p>{t.home.subtitle}</p>
          <button className="btn btn-primary btn-lg" onClick={() => dispatch({ type: 'GO_CALENDAR' })}>
            {t.home.selectDate}
          </button>
        </div>
      </section>

      <section className="destinations">
        <h2>{t.home.popular}</h2>
        <div className="dest-grid">
          {destinations.map((d, i) => (
            <div key={i} className="dest-card" onClick={() => dispatch({ type: 'GO_CALENDAR' })}>
              <img src={d.img} alt={lang === 'en' ? d.en : d.ja} loading="lazy" />
              <span className="dest-label">{lang === 'en' ? d.en : d.ja}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
