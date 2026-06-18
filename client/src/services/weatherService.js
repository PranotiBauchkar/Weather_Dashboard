const API_BASE = '/api';

async function handleResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Server unreachable. Make sure the backend is running on port 5000.');
  }

  if (!response.ok) {
    const error = new Error(data.error || 'Something went wrong. Please try again.');
    error.code = data.code;
    throw error;
  }
  return data;
}

export async function checkApiStatus() {
  const response = await fetch(`${API_BASE}/status`);
  return handleResponse(response);
}

export async function getWeatherByCity(city) {
  const response = await fetch(`${API_BASE}/weather/${encodeURIComponent(city)}`);
  return handleResponse(response);
}

export async function getForecastByCity(city) {
  const response = await fetch(`${API_BASE}/forecast/${encodeURIComponent(city)}`);
  return handleResponse(response);
}

export async function getWeatherByCoords(lat, lon) {
  const response = await fetch(`${API_BASE}/weather/coords?lat=${lat}&lon=${lon}`);
  return handleResponse(response);
}

export async function getForecastByCoords(lat, lon) {
  const response = await fetch(`${API_BASE}/forecast/coords?lat=${lat}&lon=${lon}`);
  return handleResponse(response);
}

export async function getAirQuality(lat, lon) {
  const response = await fetch(`${API_BASE}/air-quality?lat=${lat}&lon=${lon}`);
  return handleResponse(response);
}

export async function getUVIndex(lat, lon) {
  const response = await fetch(`${API_BASE}/uv-index?lat=${lat}&lon=${lon}`);
  return handleResponse(response);
}

export function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

export function celsiusToFahrenheit(c) {
  return Math.round((c * 9) / 5 + 32);
}

export function formatTemp(celsius, unit = 'celsius') {
  if (unit === 'fahrenheit') return `${celsiusToFahrenheit(celsius)}°F`;
  return `${Math.round(celsius)}°C`;
}

export function formatTime(unixTimestamp, timezoneOffset = 0) {
  const date = new Date((unixTimestamp + timezoneOffset) * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(unixTimestamp, timezoneOffset = 0) {
  const date = new Date((unixTimestamp + timezoneOffset) * 1000);
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatLastUpdated(date) {
  if (!date) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function getWindDirection(deg) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(deg / 45) % 8];
}

export function getAQILabel(aqi) {
  const labels = {
    1: { label: 'Good', color: 'text-green-400', bg: 'bg-green-500/20' },
    2: { label: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    3: { label: 'Moderate', color: 'text-orange-400', bg: 'bg-orange-500/20' },
    4: { label: 'Poor', color: 'text-red-400', bg: 'bg-red-500/20' },
    5: { label: 'Very Poor', color: 'text-purple-400', bg: 'bg-purple-500/20' },
  };
  return labels[aqi] || { label: 'Unknown', color: 'text-gray-400', bg: 'bg-gray-500/20' };
}

export function getUVLabel(uv) {
  if (uv <= 2) return { label: 'Low', color: 'text-green-400', advice: 'Minimal protection needed.' };
  if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-400', advice: 'Wear sunscreen if outside.' };
  if (uv <= 7) return { label: 'High', color: 'text-orange-400', advice: 'Seek shade during midday.' };
  if (uv <= 10) return { label: 'Very High', color: 'text-red-400', advice: 'Extra protection required.' };
  return { label: 'Extreme', color: 'text-purple-400', advice: 'Avoid sun exposure.' };
}

export function getWeatherBackground(main) {
  const condition = main?.toLowerCase() || '';
  if (condition.includes('clear')) return 'sunny';
  if (condition.includes('cloud')) return 'cloudy';
  if (condition.includes('rain') || condition.includes('drizzle')) return 'rainy';
  if (condition.includes('snow')) return 'snowy';
  if (condition.includes('thunder') || condition.includes('storm')) return 'stormy';
  if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) return 'cloudy';
  return 'default';
}

export function getWeatherAdvice(weather, uv) {
  const temp = weather?.main?.temp ?? 20;
  const main = weather?.weather?.[0]?.main?.toLowerCase() || '';
  const wind = weather?.wind?.speed ?? 0;
  const advice = [];

  if (main.includes('rain') || main.includes('drizzle')) {
    advice.push({ icon: '☔', text: 'Bring an umbrella or rain jacket.' });
  } else if (main.includes('snow')) {
    advice.push({ icon: '🧥', text: 'Wear warm layers and waterproof boots.' });
  } else if (temp > 30) {
    advice.push({ icon: '🥤', text: 'Stay hydrated — it\'s very hot today.' });
  } else if (temp < 5) {
    advice.push({ icon: '🧣', text: 'Bundle up — cold conditions expected.' });
  } else if (temp >= 20 && temp <= 28 && main.includes('clear')) {
    advice.push({ icon: '😎', text: 'Great weather for outdoor activities!' });
  }

  if (wind > 10) {
    advice.push({ icon: '💨', text: 'Strong winds — secure loose items.' });
  }

  if (uv > 6) {
    advice.push({ icon: '🧴', text: 'High UV — apply SPF 30+ sunscreen.' });
  }

  if (advice.length === 0) {
    advice.push({ icon: '✨', text: 'Conditions look pleasant. Enjoy your day!' });
  }

  return advice;
}

export function getSunProgress(sunrise, sunset, timezone = 0) {
  const now = Date.now() / 1000;
  const total = sunset - sunrise;
  const elapsed = now - sunrise;
  const progress = Math.min(Math.max((elapsed / total) * 100, 0), 100);
  const isDay = now >= sunrise && now <= sunset;

  let countdown = '';
  if (isDay) {
    const remaining = sunset - now;
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    countdown = `${h}h ${m}m until sunset`;
  } else if (now < sunrise) {
    const remaining = sunrise - now;
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    countdown = `${h}h ${m}m until sunrise`;
  } else {
    countdown = 'Night time';
  }

  return { progress, isDay, countdown };
}

export function processDailyForecast(forecastList, timezoneOffset = 0) {
  const dailyMap = new Map();

  forecastList.forEach((item) => {
    const date = new Date((item.dt + timezoneOffset) * 1000);
    const dayKey = date.toISOString().split('T')[0];

    if (!dailyMap.has(dayKey)) {
      dailyMap.set(dayKey, {
        date: dayKey,
        dt: item.dt,
        temps: [],
        conditions: [],
        icons: [],
        humidity: [],
        wind: [],
        pop: [],
      });
    }

    const day = dailyMap.get(dayKey);
    day.temps.push(item.main.temp);
    day.conditions.push(item.weather[0].description);
    day.icons.push(item.weather[0].icon);
    day.humidity.push(item.main.humidity);
    day.wind.push(item.wind.speed);
    day.pop.push(item.pop || 0);
  });

  return Array.from(dailyMap.values())
    .slice(0, 7)
    .map((day) => ({
      date: day.date,
      dt: day.dt,
      tempMin: Math.round(Math.min(...day.temps)),
      tempMax: Math.round(Math.max(...day.temps)),
      description: day.conditions[Math.floor(day.conditions.length / 2)],
      icon: day.icons[Math.floor(day.icons.length / 2)],
      humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
      wind: Math.round((day.wind.reduce((a, b) => a + b, 0) / day.wind.length) * 10) / 10,
      rainProbability: Math.round(Math.max(...day.pop) * 100),
    }));
}

export function processHourlyForecast(forecastList, timezoneOffset = 0) {
  const now = Date.now() / 1000;
  return forecastList
    .filter((item) => item.dt >= now - 1800)
    .slice(0, 24)
    .map((item) => ({
      time: formatTime(item.dt, timezoneOffset),
      dt: item.dt,
      temp: Math.round(item.main.temp),
      humidity: item.main.humidity,
      wind: item.wind.speed,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      pop: Math.round((item.pop || 0) * 100),
    }));
}

export function processStatistics(forecastList) {
  return forecastList.slice(0, 8).map((item, index) => ({
    name: `+${index * 3}h`,
    temp: Math.round(item.main.temp),
    humidity: item.main.humidity,
    wind: Math.round(item.wind.speed * 10) / 10,
  }));
}

export const POPULAR_CITIES = [
  'London', 'New York', 'Tokyo', 'Paris', 'Sydney',
  'Dubai', 'Mumbai', 'Berlin', 'Toronto', 'Singapore',
];
