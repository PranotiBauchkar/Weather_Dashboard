import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getWeatherByCity,
  getForecastByCity,
  getWeatherByCoords,
  getForecastByCoords,
  getAirQuality,
  getUVIndex,
  checkApiStatus,
  processDailyForecast,
  processHourlyForecast,
  processStatistics,
} from '../services/weatherService';

const HISTORY_KEY = 'weather-search-history';
const FAVORITES_KEY = 'weather-favorites';
const DEFAULT_CITY_KEY = 'weather-default-city';
const MAX_HISTORY = 10;
const DEFAULT_CITY = 'Kolhapur';

function loadFromStorage(key, fallback = []) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [currentCity, setCurrentCity] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [dataSource, setDataSource] = useState(null);
  const [searchHistory, setSearchHistory] = useState(() => loadFromStorage(HISTORY_KEY));
  const [favorites, setFavorites] = useState(() => loadFromStorage(FAVORITES_KEY));
  const initialized = useRef(false);
  const weatherRef = useRef(null);

  useEffect(() => {
    weatherRef.current = weather;
  }, [weather]);

  const dailyForecast = forecast
    ? processDailyForecast(forecast.list, forecast.city?.timezone || 0)
    : [];

  const hourlyForecast = forecast
    ? processHourlyForecast(forecast.list, forecast.city?.timezone || 0)
    : [];

  const statistics = forecast ? processStatistics(forecast.list) : [];

  const addToHistory = useCallback((city) => {
    const normalized = city.trim();
    if (!normalized) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== normalized.toLowerCase());
      const updated = [normalized, ...filtered].slice(0, MAX_HISTORY);
      saveToStorage(HISTORY_KEY, updated);
      return updated;
    });
  }, []);

  const fetchWeatherData = useCallback(async (fetchWeather, fetchForecast, cityName) => {
    setLoading(true);
    setError(null);
    setErrorCode(null);

    try {
      const [weatherData, forecastData] = await Promise.all([fetchWeather(), fetchForecast()]);

      setWeather(weatherData);
      setForecast(forecastData);
      setCurrentCity(cityName || weatherData.name);
      setLastUpdated(new Date());
      setDataSource(weatherData._source || forecastData._source || 'openweathermap');

      const resolvedCity = cityName || weatherData.name;
      localStorage.setItem(DEFAULT_CITY_KEY, resolvedCity);

      const { lat, lon } = weatherData.coord;
      const [aqiData, uvData] = await Promise.allSettled([
        getAirQuality(lat, lon),
        getUVIndex(lat, lon),
      ]);

      setAirQuality(aqiData.status === 'fulfilled' ? aqiData.value : null);
      setUvIndex(uvData.status === 'fulfilled' ? uvData.value : null);

      if (cityName) addToHistory(cityName);
    } catch (err) {
      setError(err.message);
      setErrorCode(err.code || null);
      if (!weatherRef.current) {
        setWeather(null);
        setForecast(null);
        setAirQuality(null);
        setUvIndex(null);
      }
    } finally {
      setLoading(false);
    }
  }, [addToHistory]);

  const searchByCity = useCallback(
    (city) => {
      const trimmed = city.trim();
      if (!trimmed) {
        setError('Please enter a city name.');
        return;
      }
      fetchWeatherData(
        () => getWeatherByCity(trimmed),
        () => getForecastByCity(trimmed),
        trimmed
      );
    },
    [fetchWeatherData]
  );

  const searchByCoords = useCallback(
    (lat, lon) => {
      fetchWeatherData(
        () => getWeatherByCoords(lat, lon),
        () => getForecastByCoords(lat, lon),
        null
      );
    },
    [fetchWeatherData]
  );

  const refreshWeather = useCallback(() => {
    if (currentCity) searchByCity(currentCity);
    else searchByCity(localStorage.getItem(DEFAULT_CITY_KEY) || DEFAULT_CITY);
  }, [currentCity, searchByCity]);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      searchByCity(localStorage.getItem(DEFAULT_CITY_KEY) || DEFAULT_CITY);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => searchByCoords(position.coords.latitude, position.coords.longitude),
      () => searchByCity(localStorage.getItem(DEFAULT_CITY_KEY) || DEFAULT_CITY),
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, [searchByCoords, searchByCity]);

  const toggleFavorite = useCallback((city) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.toLowerCase() === city.toLowerCase());
      const updated = exists
        ? prev.filter((f) => f.toLowerCase() !== city.toLowerCase())
        : [...prev, city];
      saveToStorage(FAVORITES_KEY, updated);
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (city) => favorites.some((f) => f.toLowerCase() === city.toLowerCase()),
    [favorites]
  );

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  useEffect(() => {
    checkApiStatus()
      .then((data) => {
        setApiStatus('connected');
        setDataSource(data.source || 'openweathermap');
      })
      .catch(() => setApiStatus('error'));
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    searchByCity(DEFAULT_CITY);
  }, [searchByCity]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentCity && !loading) refreshWeather();
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentCity, loading, refreshWeather]);

  return {
    weather,
    forecast,
    airQuality,
    uvIndex,
    loading,
    error,
    errorCode,
    apiStatus,
    dataSource,
    currentCity,
    lastUpdated,
    dailyForecast,
    hourlyForecast,
    statistics,
    searchHistory,
    favorites,
    searchByCity,
    searchByCoords,
    detectLocation,
    refreshWeather,
    toggleFavorite,
    isFavorite,
    clearHistory,
  };
}
