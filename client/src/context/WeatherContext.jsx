import { createContext, useContext } from 'react';
import { useWeather } from '../hooks/useWeather';

const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  const weather = useWeather();
  return (
    <WeatherContext.Provider value={weather}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeatherContext must be used within WeatherProvider');
  return ctx;
}
