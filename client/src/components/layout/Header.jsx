import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineRefresh,
  HiOutlineBell,
  HiOutlineLocationMarker,
  HiOutlineChevronDown,
} from 'react-icons/hi';
import { useUnit } from '../../context/UnitContext';
import { useWeatherContext } from '../../context/WeatherContext';
import { searchGeocode, formatCityLabel } from '../../utils/weatherUtils';
import { SidebarToggle } from './Sidebar';
import { useLanguage } from '../../context/LanguageContext';

export default function Header({ onMenuClick, alertCount = 0 }) {
  const navigate = useNavigate();
  // theme removed; dark mode disabled
  const { isCelsius, toggleUnit } = useUnit();
  const { weather, loading, refreshWeather, searchByCity, detectLocation } = useWeatherContext();
  const { t } = useLanguage();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const locationLabel = weather ? formatCityLabel(weather) : 'Select location';

  const fetchSuggestions = useCallback(async (value) => {
    if (value.length < 2) { setSuggestions([]); return; }
    try {
      const results = await searchGeocode(value);
      setSuggestions(results.slice(0, 6));
    } catch { setSuggestions([]); }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchSuggestions(query), 300);
    return () => clearTimeout(t);
  }, [query, fetchSuggestions]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      searchByCity(query.trim());
      setShowSuggestions(false);
    }
  };

  const selectCity = (item) => {
    setQuery(item.label);
    searchByCity(item.label);
    setShowSuggestions(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-xl sm:gap-4 sm:px-6">
      <SidebarToggle onClick={onMenuClick} />

      <form onSubmit={handleSearch} className="relative min-w-0 flex-1 max-w-xl">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={t('searchPlaceholder') || 'Search city, state...'}
          className="saas-input !py-2 text-sm"
          disabled={loading}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
            {suggestions.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onMouseDown={() => selectCity(item)}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-sky/5"
                >
                  <span className="font-medium text-slate-800">{item.name}</span>
                  {item.state && <span className="text-sky-600">, {item.state}</span>}
                  <span className="text-slate-400">, {item.country}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>

      <button
        onClick={detectLocation}
        className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:border-sky/30 hover:bg-sky/5 sm:flex"
        title={locationLabel}
      >
        <HiOutlineLocationMarker className="h-4 w-4 shrink-0 text-sky" />
        <span className="max-w-[120px] truncate md:max-w-[180px]">{weather?.name || 'Location'}</span>
        <HiOutlineChevronDown className="h-3 w-3 shrink-0 text-slate-400" />
      </button>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => navigate('/alerts')}
          className="relative rounded-xl p-2.5 text-slate-500 hover:bg-sky/10 hover:text-sky"
          aria-label="Alerts"
        >
          <HiOutlineBell className="h-5 w-5" />
          {alertCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {alertCount}
            </span>
          )}
        </button>

        <button onClick={toggleUnit} className="saas-btn-ghost hidden !px-3 !py-2 text-xs font-bold sm:inline-flex">
          °{isCelsius ? 'C' : 'F'}
        </button>

        <button
          onClick={refreshWeather}
          disabled={loading}
          className="saas-btn-ghost !p-2.5 disabled:opacity-50"
          aria-label="Refresh"
        >
          <HiOutlineRefresh className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </button>

        {/* theme toggle removed */}

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky to-indigo text-sm font-bold text-white shadow-md"
          >
            U
          </button>
          {showProfile && (
            <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
              <button onClick={() => { navigate('/profile'); setShowProfile(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-sky/5">{t('route_profile')}</button>
              <button onClick={() => { navigate('/settings'); setShowProfile(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-sky/5">{t('route_settings')}</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
