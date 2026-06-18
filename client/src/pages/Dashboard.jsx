import { useCallback, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import QuickCities from '../components/QuickCities';
import FeatureTabs from '../components/FeatureTabs';
import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
import HourlyChart from '../components/HourlyChart';
import Statistics from '../components/Statistics';
import Favorites from '../components/Favorites';
import WeatherBackground from '../components/WeatherBackground';
import WeatherInsights from '../components/WeatherInsights';
import WindCompass from '../components/WindCompass';
import WeatherAlerts, { AQIPanel } from '../components/WeatherAlerts';
import WeatherComparison from '../components/WeatherComparison';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useWeather } from '../hooks/useWeather';
import { useLanguage } from '../context/LanguageContext';
import { formatTemp } from '../services/weatherService';
import { generateWeatherAlerts } from '../utils/weatherUtils';

export default function Dashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  const {
    weather, forecast, airQuality, uvIndex, loading, error, errorCode,
    apiStatus, currentCity, lastUpdated, dailyForecast, hourlyForecast,
    statistics, searchHistory, favorites, searchByCity, detectLocation,
    refreshWeather, toggleFavorite, isFavorite, clearHistory,
  } = useWeather();

  const weatherMain = weather?.weather?.[0]?.main;
  const timezoneOffset = forecast?.city?.timezone || weather?.timezone || 0;

  const alerts = useMemo(
    () => generateWeatherAlerts(weather, forecast, uvIndex, t),
    [weather, forecast, uvIndex, t]
  );

  const handleShare = useCallback(async () => {
    if (!weather) return;
    const label = [weather.name, weather.state].filter(Boolean).join(', ');
    const text = `${label}: ${formatTemp(weather.main.temp)} — ${weather.weather[0].description}`;
    try {
      if (navigator.share) await navigator.share({ title: 'SkyCast', text });
      else { await navigator.clipboard.writeText(text); alert('Copied!'); }
    } catch { /* cancelled */ }
  }, [weather]);

  const renderTabContent = () => {
    if (!weather) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-5 animate-fade-in">
            <WeatherCard
              weather={weather}
              airQuality={airQuality}
              uvIndex={uvIndex}
              isFavorite={isFavorite(currentCity)}
              onToggleFavorite={toggleFavorite}
              onShare={handleShare}
            />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <WindCompass speed={weather.wind?.speed} deg={weather.wind?.deg} gust={weather.wind?.gust} />
              <div className="md:col-span-2 lg:col-span-1">
                <WeatherInsights weather={weather} uvIndex={uvIndex} airQuality={airQuality} />
              </div>
            </div>
            {alerts.length > 0 && (
              <div className="glass-card border-orange-400/30 p-4">
                <p className="mb-2 text-sm font-medium text-orange-300">⚠️ {alerts.length} active alert(s)</p>
                <button onClick={() => setActiveTab('alerts')} className="text-sm text-blue-300 underline">
                  View all alerts →
                </button>
              </div>
            )}
          </div>
        );

      case 'forecast':
        return (
          <div className="space-y-5 animate-fade-in">
            <ForecastCard forecast={dailyForecast} timezoneOffset={timezoneOffset} />
            <HourlyChart hourlyForecast={hourlyForecast} />
          </div>
        );

      case 'analytics':
        return (
          <div className="animate-fade-in">
            <Statistics statistics={statistics} />
          </div>
        );

      /* Map view removed */

      case 'aqi':
        return (
          <div className="animate-fade-in">
            <AQIPanel airQuality={airQuality} uvIndex={uvIndex} />
          </div>
        );

      case 'alerts':
        return (
          <div className="animate-fade-in">
            <WeatherAlerts alerts={alerts} />
          </div>
        );

      case 'compare':
        return (
          <div className="animate-fade-in">
            <WeatherComparison />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-white">
      <WeatherBackground weatherMain={weatherMain} />

      <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <Navbar
          weather={weather}
          lastUpdated={lastUpdated}
          apiStatus={apiStatus}
          onRefresh={refreshWeather}
          loading={loading}
          alertCount={alerts.length}
          onAlertsClick={() => setActiveTab('alerts')}
        />

        <div className="space-y-4">
          <SearchBar onSearch={searchByCity} onDetectLocation={detectLocation} loading={loading} />

          {!weather && !loading && <QuickCities onSelect={searchByCity} loading={loading} />}

          <Favorites
            favorites={favorites}
            searchHistory={searchHistory}
            onSelectCity={searchByCity}
            onToggleFavorite={toggleFavorite}
            onClearHistory={clearHistory}
          />

          {error && (
            <ErrorMessage
              message={error}
              errorCode={errorCode}
              onRetry={() => searchByCity(currentCity || 'London')}
            />
          )}

          {loading && !weather && <LoadingSpinner />}

          {weather && (
            <>
              <FeatureTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                alertCount={alerts.length}
              />

              {renderTabContent()}
            </>
          )}
        </div>

        {loading && weather && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className="flex items-center gap-2 rounded-xl bg-black/50 px-4 py-2 backdrop-blur-sm">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <span className="text-sm">{t('updating')}</span>
            </div>
          </div>
        )}

        <footer className="mt-10 pb-4 text-center text-xs text-white/40">
          {t('footer')} &bull; {t('autoRefresh')}
        </footer>
      </div>
    </div>
  );
}
