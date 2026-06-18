import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getWeatherByCityOpenMeteo,
  getWeatherByCoordsOpenMeteo,
  checkOpenMeteoStatus,
  searchGeocodeCities,
} from './openMeteoService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const getApiKey = () => process.env.OPENWEATHER_API_KEY?.trim();

app.use(cors());
app.use(express.json());

const requireApiKey = (_req, res, next) => {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === 'your_api_key_here') {
    return res.status(500).json({
      error: 'API key not configured. Add OPENWEATHER_API_KEY to server/.env and restart the server.',
      code: 'MISSING_API_KEY',
    });
  }
  next();
};

const mapApiError = (data, status) => {
  const msg = (data.message || '').toLowerCase();

  if (status === 401 || msg.includes('invalid api key')) {
    return {
      status: 401,
      message: 'OpenWeatherMap key invalid — using backup weather service.',
      code: 'INVALID_API_KEY',
    };
  }
  if (status === 429) {
    return { status: 429, message: 'API rate limit reached.', code: 'RATE_LIMIT' };
  }
  if (msg === 'city not found' || data.cod === '404') {
    return {
      status: 404,
      message: 'City not found. Check spelling or try "City, Country".',
      code: 'CITY_NOT_FOUND',
    };
  }
  return {
    status: status || 500,
    message: data.message || 'Failed to fetch weather data.',
    code: 'API_ERROR',
  };
};

const fetchOWM = async (url) => {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw mapApiError(data, response.status);
  }
  if (data.cod && Number(data.cod) >= 400) {
    throw mapApiError(data, Number(data.cod));
  }
  return data;
};

async function tryOWM(fetchFn) {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === 'your_api_key_here') return null;
  try {
    return await fetchFn(apiKey);
  } catch (err) {
    if (err.code === 'INVALID_API_KEY' || err.status === 401) return null;
    throw err;
  }
}

async function getWeatherBundleByCity(city) {
  const owmWeather = await tryOWM(async (key) => {
    const encoded = encodeURIComponent(city);
    const [weather, forecast] = await Promise.all([
      fetchOWM(`${BASE_URL}/weather?q=${encoded}&appid=${key}&units=metric`),
      fetchOWM(`${BASE_URL}/forecast?q=${encoded}&appid=${key}&units=metric`),
    ]);
    return { weather, forecast, source: 'openweathermap' };
  });

  if (owmWeather) return owmWeather;

  const fallback = await getWeatherByCityOpenMeteo(city);
  return {
    weather: fallback.weather,
    forecast: fallback.forecast,
    airQuality: fallback.airQuality,
    uvIndex: fallback.uvIndex,
    source: 'open-meteo',
  };
}

async function getWeatherBundleByCoords(lat, lon) {
  const owmWeather = await tryOWM(async (key) => {
    const [weather, forecast] = await Promise.all([
      fetchOWM(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`),
      fetchOWM(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric`),
    ]);
    return { weather, forecast, source: 'openweathermap' };
  });

  if (owmWeather) return owmWeather;

  const fallback = await getWeatherByCoordsOpenMeteo(lat, lon);
  return {
    weather: fallback.weather,
    forecast: fallback.forecast,
    airQuality: fallback.airQuality,
    uvIndex: fallback.uvIndex,
    source: 'open-meteo',
  };
}

async function getExtras(lat, lon, source, existing = {}) {
  if (source === 'open-meteo') {
    return {
      airQuality: existing.airQuality || null,
      uvIndex: existing.uvIndex || null,
    };
  }

  const apiKey = getApiKey();
  const [aqi, uv] = await Promise.allSettled([
    fetchOWM(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`),
    fetchOWM(`${BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`),
  ]);

  return {
    airQuality: aqi.status === 'fulfilled' ? aqi.value : null,
    uvIndex: uv.status === 'fulfilled' ? uv.value : null,
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/status', async (_req, res) => {
  try {
    const apiKey = getApiKey();
    if (apiKey && apiKey !== 'your_api_key_here') {
      try {
        await fetchOWM(`${BASE_URL}/weather?q=London&appid=${apiKey}&units=metric`);
        return res.json({ status: 'connected', source: 'openweathermap', message: 'OpenWeatherMap API is working.' });
      } catch (err) {
        if (err.code !== 'INVALID_API_KEY' && err.status !== 401) throw err;
      }
    }
    const fallback = await checkOpenMeteoStatus();
    res.json({ status: 'connected', source: 'open-meteo', message: fallback.message });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message, code: err.code });
  }
});

app.get('/api/geocode', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters.' });
    }
    const results = await searchGeocodeCities(q);
    res.json(results);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Geocode failed.' });
  }
});

// IMPORTANT: /coords routes MUST come before /:city routes
app.get('/api/weather/coords', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }
    const bundle = await getWeatherBundleByCoords(lat, lon);
    res.json({ ...bundle.weather, _source: bundle.source });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, code: err.code });
  }
});

app.get('/api/forecast/coords', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }
    const bundle = await getWeatherBundleByCoords(lat, lon);
    res.json({ ...bundle.forecast, _source: bundle.source });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, code: err.code });
  }
});

app.get('/api/weather/:city', async (req, res) => {
  try {
    const bundle = await getWeatherBundleByCity(req.params.city);
    res.json({ ...bundle.weather, _source: bundle.source });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, code: err.code });
  }
});

app.get('/api/forecast/:city', async (req, res) => {
  try {
    const bundle = await getWeatherBundleByCity(req.params.city);
    res.json({ ...bundle.forecast, _source: bundle.source });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, code: err.code });
  }
});

app.get('/api/air-quality', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'Latitude and longitude are required.' });

    const apiKey = getApiKey();
    if (apiKey && apiKey !== 'your_api_key_here') {
      try {
        const data = await fetchOWM(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        return res.json(data);
      } catch (err) {
        if (err.code !== 'INVALID_API_KEY' && err.status !== 401) throw err;
      }
    }

    const { airQuality } = await getWeatherByCoordsOpenMeteo(lat, lon);
    res.json(airQuality);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, code: err.code });
  }
});

app.get('/api/uv-index', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'Latitude and longitude are required.' });

    const apiKey = getApiKey();
    if (apiKey && apiKey !== 'your_api_key_here') {
      try {
        const data = await fetchOWM(`${BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        return res.json(data);
      } catch (err) {
        if (err.code !== 'INVALID_API_KEY' && err.status !== 401) throw err;
      }
    }

    const { uvIndex } = await getWeatherByCoordsOpenMeteo(lat, lon);
    res.json(uvIndex);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, code: err.code });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.listen(PORT, () => {
  const apiKey = getApiKey();
  console.log(`Weather API server running on http://localhost:${PORT}`);
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.warn('⚠️  No OpenWeatherMap key — using Open-Meteo (free, no key needed)');
  } else {
    console.log(`✓ OpenWeatherMap key loaded (${apiKey.slice(0, 4)}...${apiKey.slice(-4)})`);
    console.log('  If key is inactive, app auto-falls back to Open-Meteo');
  }
});
