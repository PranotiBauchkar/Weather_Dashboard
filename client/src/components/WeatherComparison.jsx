import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { useUnit } from '../context/UnitContext';
import { getWeatherByCity, getWeatherIconUrl, formatTemp, celsiusToFahrenheit } from '../services/weatherService';
import { searchGeocode } from '../utils/weatherUtils';

function CompareCard({ data, onRemove }) {
  const { unit } = useUnit();
  if (!data) return null;
  const w = data.weather[0];

  return (
    <div className="stat-card relative flex flex-col items-center p-4 text-center">
      <button
        onClick={onRemove}
        className="absolute right-2 top-2 rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-red-400"
      >
        ✕
      </button>
      <h4 className="font-semibold">{data.name}</h4>
      {data.state && <p className="text-xs text-white/50">{data.state}</p>}
      <img src={getWeatherIconUrl(w.icon)} alt="" className="my-2 h-16 w-16" />
      <p className="text-3xl font-bold">{formatTemp(data.main.temp, unit)}</p>
      <p className="mt-1 capitalize text-sm text-white/60">{w.description}</p>
      <div className="mt-3 grid w-full grid-cols-2 gap-2 text-xs">
        <span>💧 {data.main.humidity}%</span>
        <span>💨 {data.wind.speed} m/s</span>
        <span>🌡️ {formatTemp(data.main.feels_like, unit)}</span>
        <span>📊 {data.main.pressure} hPa</span>
      </div>
    </div>
  );
}

export default function WeatherComparison() {
  const { t } = useLanguage();
  const { unit } = useUnit();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value) => {
    setQuery(value);
    if (value.length < 2) { setSuggestions([]); return; }
    try {
      const results = await searchGeocode(value);
      setSuggestions(results.slice(0, 6));
    } catch { setSuggestions([]); }
  };

  const addCity = async (cityQuery) => {
    if (cities.length >= 3) return;
    setLoading(true);
    setQuery('');
    setSuggestions([]);
    try {
      const data = await getWeatherByCity(cityQuery);
      if (!cities.some((c) => c.name === data.name && c.state === data.state)) {
        setCities((prev) => [...prev, data]);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  const chartData = cities.map((c) => ({
    name: c.state ? `${c.name}, ${c.state}` : c.name,
    Temperature: unit === 'fahrenheit' ? celsiusToFahrenheit(c.main.temp) : Math.round(c.main.temp),
    Humidity: c.main.humidity,
    Wind: Math.round(c.wind.speed * 10) / 10,
  }));

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold">{t('compareTitle')}</h3>

      <div className="glass-card p-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t('compareAdd')}
            className="input-field"
            disabled={cities.length >= 3 || loading}
          />
          {suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-white/20 bg-gray-900/95 shadow-xl">
              {suggestions.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => addCity(s.label)}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-white/10"
                  >
                    <span className="font-medium">{s.name}</span>
                    {s.state && <span className="text-white/50"> — {s.state}</span>}
                    <span className="text-white/40">, {s.country}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="mt-2 text-xs text-white/40">Add up to 3 cities to compare side-by-side</p>
      </div>

      {cities.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((c, i) => (
              <CompareCard
                key={`${c.name}-${c.state}-${i}`}
                data={c}
                onRemove={() => setCities((prev) => prev.filter((_, idx) => idx !== i))}
              />
            ))}
          </div>

          {cities.length >= 2 && (
            <div className="glass-card p-4 sm:p-5">
              <h4 className="mb-4 font-semibold">Temperature Comparison</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8 }} />
                    <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }} />
                    <Bar dataKey="Temperature" fill="#60A5FA" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Humidity" fill="#34D399" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Wind" fill="#F472B6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
