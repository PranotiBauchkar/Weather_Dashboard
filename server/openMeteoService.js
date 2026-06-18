const WMO_MAP = {
  0: { main: 'Clear', description: 'clear sky', icon: '01d' },
  1: { main: 'Clear', description: 'mainly clear', icon: '01d' },
  2: { main: 'Clouds', description: 'partly cloudy', icon: '02d' },
  3: { main: 'Clouds', description: 'overcast', icon: '04d' },
  45: { main: 'Mist', description: 'fog', icon: '50d' },
  48: { main: 'Mist', description: 'depositing rime fog', icon: '50d' },
  51: { main: 'Drizzle', description: 'light drizzle', icon: '09d' },
  53: { main: 'Drizzle', description: 'moderate drizzle', icon: '09d' },
  55: { main: 'Drizzle', description: 'dense drizzle', icon: '09d' },
  61: { main: 'Rain', description: 'slight rain', icon: '10d' },
  63: { main: 'Rain', description: 'moderate rain', icon: '10d' },
  65: { main: 'Rain', description: 'heavy rain', icon: '10d' },
  71: { main: 'Snow', description: 'slight snow', icon: '13d' },
  73: { main: 'Snow', description: 'moderate snow', icon: '13d' },
  75: { main: 'Snow', description: 'heavy snow', icon: '13d' },
  80: { main: 'Rain', description: 'rain showers', icon: '09d' },
  81: { main: 'Rain', description: 'moderate rain showers', icon: '09d' },
  82: { main: 'Rain', description: 'violent rain showers', icon: '09d' },
  95: { main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' },
  96: { main: 'Thunderstorm', description: 'thunderstorm with hail', icon: '11d' },
  99: { main: 'Thunderstorm', description: 'thunderstorm with heavy hail', icon: '11d' },
};

function wmoToWeather(code) {
  return WMO_MAP[code] || { main: 'Clouds', description: 'cloudy', icon: '03d' };
}

async function geocodeCity(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results?.length) {
    throw { status: 404, message: 'City not found. Check spelling or try "City, State".', code: 'CITY_NOT_FOUND' };
  }
  return data.results[0];
}

export async function searchGeocodeCities(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results?.length) return [];
  return data.results.map((r, i) => ({
    id: `${r.id || i}-${r.latitude}-${r.longitude}`,
    name: r.name,
    state: r.admin1 || '',
    country: r.country || r.country_code || '',
    lat: r.latitude,
    lon: r.longitude,
    label: [r.name, r.admin1, r.country].filter(Boolean).join(', '),
  }));
}

async function fetchOpenMeteo(lat, lon, cityName, countryCode, stateName = '') {
  const url = [
    'https://api.open-meteo.com/v1/forecast',
    `?latitude=${lat}&longitude=${lon}`,
    '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure,cloud_cover,is_day',
    '&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation_probability,weather_code',
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max',
    '&forecast_days=7',
    '&timezone=auto',
  ].join('');

  const res = await fetch(url);
  if (!res.ok) throw { status: 502, message: 'Weather service unavailable.', code: 'API_ERROR' };
  const data = await res.json();

  const current = data.current;
  const w = wmoToWeather(current.weather_code);
  const now = Math.floor(Date.now() / 1000);

  const weather = {
    coord: { lat, lon },
    weather: [{ id: current.weather_code, main: w.main, description: w.description, icon: w.icon }],
    main: {
      temp: current.temperature_2m,
      feels_like: current.apparent_temperature,
      temp_min: data.daily.temperature_2m_min[0],
      temp_max: data.daily.temperature_2m_max[0],
      pressure: current.surface_pressure,
      humidity: current.relative_humidity_2m,
    },
    visibility: 10000,
    wind: {
      speed: current.wind_speed_10m,
      deg: current.wind_direction_10m,
      gust: current.wind_gusts_10m,
    },
    clouds: { all: current.cloud_cover },
    dt: now,
    sys: {
      country: countryCode,
      sunrise: Math.floor(new Date(data.daily.sunrise[0]).getTime() / 1000),
      sunset: Math.floor(new Date(data.daily.sunset[0]).getTime() / 1000),
    },
    timezone: data.utc_offset_seconds || 0,
    name: cityName,
    state: stateName,
    cod: 200,
    _source: 'open-meteo',
  };

  const list = [];
  const hourly = data.hourly;
  for (let i = 0; i < hourly.time.length && list.length < 40; i++) {
    const hw = wmoToWeather(hourly.weather_code[i]);
    list.push({
      dt: Math.floor(new Date(hourly.time[i]).getTime() / 1000),
      main: {
        temp: hourly.temperature_2m[i],
        humidity: hourly.relative_humidity_2m[i],
      },
      weather: [{ main: hw.main, description: hw.description, icon: hw.icon }],
      wind: { speed: hourly.wind_speed_10m[i] },
      pop: (hourly.precipitation_probability[i] || 0) / 100,
    });
  }

  const forecast = {
    cod: '200',
    city: {
      name: cityName,
      country: countryCode || '',
      timezone: data.utc_offset_seconds || 0,
      coord: { lat, lon },
    },
    list,
    _source: 'open-meteo',
  };

  const uvIndex = { value: data.daily.uv_index_max[0] || 0, _source: 'open-meteo' };

  const aqiEstimate = estimateAQI(current.relative_humidity_2m, w.main);
  const airQuality = {
    list: [{ main: { aqi: aqiEstimate }, components: {} }],
    _source: 'open-meteo-estimate',
  };

  return { weather, forecast, airQuality, uvIndex };
}

function estimateAQI(humidity, main) {
  if (main === 'Clear') return humidity < 70 ? 1 : 2;
  if (main === 'Rain' || main === 'Thunderstorm') return 2;
  if (main === 'Mist' || main === 'Fog') return 3;
  return 2;
}

export async function getWeatherByCityOpenMeteo(city) {
  const geo = await geocodeCity(city);
  return fetchOpenMeteo(geo.latitude, geo.longitude, geo.name, geo.country_code, geo.admin1 || '');
}

async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': 'WeatherDashboard/1.0' } });
    const data = await res.json();
    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.state ||
      'Your Location';
    const state = data.address?.state || data.address?.region || '';
    const country = data.address?.country_code?.toUpperCase() || '';
    return { name: city, country_code: country, state };
  } catch {
    return { name: 'Your Location', country_code: '', state: '' };
  }
}

export async function getWeatherByCoordsOpenMeteo(lat, lon) {
  const place = await reverseGeocode(lat, lon);
  return fetchOpenMeteo(lat, lon, place.name, place.country_code, place.state);
}

export async function checkOpenMeteoStatus() {
  await fetchOpenMeteo(51.5074, -0.1278, 'London', 'GB');
  return { status: 'connected', message: 'Weather service is working (Open-Meteo).' };
}
