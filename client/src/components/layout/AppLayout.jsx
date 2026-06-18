import { useState, useMemo, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumb from './Breadcrumb';
import SaaSBackground from '../SaaSBackground';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';
import { useWeatherContext } from '../../context/WeatherContext';
import { generateWeatherAlerts } from '../../utils/weatherUtils';
import { useLanguage } from '../../context/LanguageContext';

export default function AppLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // keyboard shortcut: Ctrl+M toggles sidebar
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setSidebarOpen((s) => !s);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // lock body scroll when sidebar is open on small screens
  useEffect(() => {
    if (sidebarOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
    return undefined;
  }, [sidebarOpen]);
  const { t } = useLanguage();
  const { weather, loading, error, errorCode, currentCity, searchByCity, forecast, uvIndex } = useWeatherContext();

  const alerts = useMemo(
    () => generateWeatherAlerts(weather, forecast, uvIndex, t),
    [weather, forecast, uvIndex, t]
  );

  const weatherMain = weather?.weather?.[0]?.main;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SaaSBackground weatherMain={weatherMain} />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        alertCount={alerts.length}
      />

      <div className={`flex min-h-screen min-w-0 flex-col ${sidebarOpen ? 'ml-[280px]' : ''} lg:ml-[280px]`}>
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          alertCount={alerts.length}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <Breadcrumb />

          {error && (
            <div className="mb-6 max-w-full">
              <ErrorMessage
                message={error}
                errorCode={errorCode}
                onRetry={() => searchByCity(currentCity || 'London')}
              />
            </div>
          )}

          {loading && !weather ? (
            <LoadingSpinner />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="page-container"
              >
                <Outlet context={{ alerts }} />
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}
