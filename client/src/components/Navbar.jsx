import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// theme removed; dark mode disabled
import { useUnit } from '../context/UnitContext';
import { useLanguage } from '../context/LanguageContext';
import { languages } from '../locales/translations';
import { formatLastUpdated } from '../services/weatherService';
import { formatCityLabel } from '../utils/weatherUtils';
import Logo from './Logo';

export default function Navbar({
  weather,
  lastUpdated,
  apiStatus,
  onRefresh,
  loading,
  alertCount = 0,
  onAlertsClick,
}) {
  const { theme, toggleTheme } = { theme: 'light', toggleTheme: () => {} };
  const { isCelsius, toggleUnit } = useUnit();
  const { lang, setLang, t } = useLanguage();
  const [showLang, setShowLang] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // close menu on outside click or ESC
  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target) && !e.target.closest('[aria-label="Open menu"]')) {
        setShowMenu(false);
      }
    }
    function onKey(e) {
      if (e.key === 'Escape') setShowMenu(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('touchstart', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('touchstart', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const cityLabel = weather ? formatCityLabel(weather) : '';

  return (
    <header className="glass-card mb-4 px-4 py-3 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMenu((s) => !s)}
            className="mr-2 inline-flex items-center justify-center rounded-md bg-white/5 p-2 text-white/80 hover:bg-white/10 lg:hidden"
            aria-label="Open menu"
          >
            =
          </button>
          <Logo size="md" />
          <div>
            <h1 className="bg-gradient-to-r from-sky-300 to-purple-300 bg-clip-text text-lg font-bold text-transparent sm:text-xl">
              {t('appName')}
            </h1>
            <p className="text-xs text-white/50 sm:text-sm">{t('tagline')}</p>
            {cityLabel && (
              <p className="mt-0.5 text-sm font-medium text-white/80">{cityLabel}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Dropdown menu for small screens */}
          {showMenu && (
            <div ref={menuRef} className="absolute left-4 top-16 z-50 w-64 rounded-xl border border-white/10 bg-gray-900/95 p-2 shadow-xl backdrop-blur-md lg:hidden">
              <nav className="flex flex-col gap-1">
                <button onClick={() => { navigate('/'); setShowMenu(false); }} className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-white/5">Overview</button>
                <button onClick={() => { navigate('/forecast'); setShowMenu(false); }} className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-white/5">Forecast</button>
                {/* Map removed */}
                <button onClick={() => { navigate('/analytics'); setShowMenu(false); }} className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-white/5">Analytics</button>
                <button onClick={() => { navigate('/alerts'); setShowMenu(false); }} className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-white/5">Alerts</button>
                <div className="my-1 h-px bg-white/5" />
                {/* theme toggle removed */}
                <button onClick={() => { toggleUnit(); }} className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-white/5">Toggle units: °{isCelsius ? 'C' : 'F'}</button>
                <div className="my-1 h-px bg-white/5" />
                <div className="px-2">
                  <div className="text-xs text-white/50">Language</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {languages.map((l) => (
                      <button key={l.code} onClick={() => { setLang(l.code); }} className={`rounded-md px-2 py-1 text-sm ${lang === l.code ? 'bg-white/10 font-semibold' : 'hover:bg-white/5'}`}>{l.flag} {l.label}</button>
                    ))}
                  </div>
                </div>
              </nav>
            </div>
          )}
          {apiStatus && (
            <span className={`hidden items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs sm:flex ${
              apiStatus === 'connected' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${apiStatus === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              {apiStatus === 'connected' ? t('live') : t('offline')}
            </span>
          )}

          <button
            onClick={onAlertsClick}
            className="btn-secondary relative flex h-9 w-9 items-center justify-center p-0"
            aria-label="Weather alerts"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {alertCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold">
                {alertCount}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowLang(!showLang)}
              className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-sm"
            >
              {languages.find((l) => l.code === lang)?.flag}
              <span className="hidden sm:inline">{languages.find((l) => l.code === lang)?.label}</span>
            </button>
            {showLang && (
              <ul className="absolute right-0 top-full z-50 mt-1 min-w-[140px] overflow-hidden rounded-xl border border-white/20 bg-gray-900/95 shadow-xl backdrop-blur-md">
                {languages.map((l) => (
                  <li key={l.code}>
                    <button
                      onClick={() => { setLang(l.code); setShowLang(false); }}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/10 ${lang === l.code ? 'bg-white/10 font-semibold' : ''}`}
                    >
                      {l.flag} {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button onClick={toggleUnit} className="btn-secondary px-3 py-1.5 text-sm font-semibold">
            °{isCelsius ? 'C' : 'F'}
          </button>

          <button onClick={onRefresh} disabled={loading} className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-sm disabled:opacity-50">
            <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">{t('refresh')}</span>
          </button>

          {/* theme toggle removed */}
        </div>
      </div>
      {lastUpdated && (
        <p className="mt-2 text-xs text-white/40">{t('updated')} {formatLastUpdated(lastUpdated)}</p>
      )}
    </header>
  );
}
