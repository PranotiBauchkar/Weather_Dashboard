import { useWeatherContext } from '../context/WeatherContext';
import { useUnit } from '../context/UnitContext';
import { useLanguage } from '../context/LanguageContext';
import { getWeatherIconUrl, formatTemp } from '../services/weatherService';
import { formatCityLabel } from '../utils/weatherUtils';
import PageHeader from '../components/layout/PageHeader';
import WindCompass from '../components/WindCompass';
import WeatherInsights from '../components/WeatherInsights';
import Favorites from '../components/Favorites';
import QuickCities from '../components/QuickCities';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';

function StatBox({ label, value, icon }) {
  return (
    <div className="saas-card flex items-center gap-4 min-w-0">
      <span className="text-2xl shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 truncate">{label}</p>
        <p className="truncate text-lg font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const { unit } = useUnit();
  const { t } = useLanguage();
  const {
    weather, uvIndex, airQuality, dailyForecast, searchByCity, detectLocation,
    loading, favorites, searchHistory, toggleFavorite, isFavorite, clearHistory, currentCity,
  } = useWeatherContext();

  if (!weather) return <QuickCities onSelect={searchByCity} loading={loading} />;

  const condition = weather.weather[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title={new Date().getHours() < 12 ? t('greetingMorning') : new Date().getHours() < 17 ? t('greetingAfternoon') : t('greetingEvening')}
        subtitle={formatCityLabel(weather)}
      />

      <div className="saas-card flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-5">
          <img src={getWeatherIconUrl(condition.icon)} alt="" className="h-20 w-20 shrink-0 sm:h-24 sm:w-24" />
          <div className="min-w-0">
            <p className="text-4xl font-bold text-slate-900 sm:text-5xl">
              {formatTemp(weather.main.temp, unit)}
            </p>
            <p className="capitalize text-slate-500">{condition.description}</p>
            <p className="mt-1 text-sm text-slate-400">
              H: {formatTemp(weather.main.temp_max, unit)} · L: {formatTemp(weather.main.temp_min, unit)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/current" className="saas-btn-primary text-sm">{t('viewDetails')} <HiOutlineArrowRight className="h-4 w-4" /></Link>
          <Link to="/forecast" className="saas-btn-ghost text-sm">{t('sevenDayForecast')}</Link>
        </div>
      </div>

      <div className="stat-grid">
        <StatBox icon="💧" label={t('humidity')} value={`${weather.main.humidity}%`} />
        <StatBox icon="💨" label={t('wind')} value={`${weather.wind.speed} m/s`} />
        <StatBox icon="🌡️" label={t('pressure')} value={`${weather.main.pressure} hPa`} />
        <StatBox icon="☁️" label={t('cloudCover')} value={`${weather.clouds?.all ?? 0}%`} />
      </div>

      <div className="content-grid">
        <WindCompass speed={weather.wind?.speed} deg={weather.wind?.deg} gust={weather.wind?.gust} />
      </div>

      <WeatherInsights weather={weather} uvIndex={uvIndex} airQuality={airQuality} />

      <Favorites
        favorites={favorites}
        searchHistory={searchHistory}
        onSelectCity={searchByCity}
        onToggleFavorite={toggleFavorite}
        onClearHistory={clearHistory}
      />

      {dailyForecast.length > 0 && (
        <div className="saas-card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">{t('quickForecast')}</h3>
            <Link to="/forecast" className="text-sm text-sky hover:underline">{t('viewAll')}</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7 overflow-hidden">
            {dailyForecast.slice(0, 7).map((day) => (
              <div key={day.date} className="rounded-xl bg-slate-50 p-3 text-center min-w-0">
                <p className="text-xs text-slate-500 truncate">{day.date.slice(5)}</p>
                <p className="mt-1 font-bold text-slate-800 truncate">{formatTemp(day.tempMax, unit)}</p>
                <p className="text-xs text-slate-400 truncate">{formatTemp(day.tempMin, unit)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
