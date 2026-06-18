import { useUnit } from '../context/UnitContext';
import { useLanguage } from '../context/LanguageContext';
import {
  getWeatherIconUrl,
  formatTime,
  formatTemp,
  getAQILabel,
  getUVLabel,
} from '../services/weatherService';

function StatItem({ icon, label, value, unit = '' }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-xl shadow-sm">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="font-semibold text-slate-800 truncate">
          {value}
          {unit && <span className="text-sm font-normal text-slate-500"> {unit}</span>}
        </p>
      </div>
    </div>
  );
}

export default function WeatherCard({
  weather,
  airQuality,
  uvIndex,
  isFavorite,
  onToggleFavorite,
  onShare,
}) {
  const { unit } = useUnit();
  const { t } = useLanguage();
  if (!weather) return null;

  const { main, weather: conditions, wind, visibility, sys, name, coord, clouds, state } = weather;
  const condition = conditions[0];
  const timezone = weather.timezone || 0;

  const aqi = airQuality?.list?.[0]?.main?.aqi;
  const aqiInfo = aqi ? getAQILabel(aqi) : null;
  const uv = uvIndex?.value;
  const uvInfo = uv !== undefined ? getUVLabel(uv) : null;

  return (
    <div className="saas-card overflow-hidden !p-0">
      <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <img
            src={getWeatherIconUrl(condition.icon)}
            alt={condition.description}
            className="h-24 w-24 shrink-0 animate-float sm:h-32 sm:w-32"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="min-w-0">
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl truncate">{name}</h2>
                {(state || sys?.country) && (
                  <p className="text-sm text-sky-600 truncate">
                    {[state, sys?.country].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
              <button
                onClick={() => onToggleFavorite(name)}
                className="shrink-0 rounded-lg p-1.5 hover:bg-slate-100"
                aria-label="Favorite"
              >
                <svg
                  className={`h-6 w-6 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                  fill={isFavorite ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
              {onShare && (
                <button onClick={onShare} className="shrink-0 rounded-lg p-1.5 hover:bg-slate-100" aria-label="Share">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              )}
            </div>
            <p className="mt-1 capitalize text-slate-500">{condition.description}</p>
            <p className="mt-2 text-5xl font-bold text-slate-900 sm:text-6xl">
              {unit === 'fahrenheit' ? Math.round((main.temp * 9) / 5 + 32) : Math.round(main.temp)}
              <span className="text-2xl font-normal text-slate-400">°{unit === 'celsius' ? 'C' : 'F'}</span>
            </p>
            <p className="text-sm text-slate-500">{t('feelsLike')} {formatTemp(main.feels_like, unit)}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-sky/10 px-2 py-0.5 text-sky-700">{t('high')}: {formatTemp(main.temp_max, unit)}</span>
              <span className="rounded-full bg-indigo/10 px-2 py-0.5 text-indigo-700">{t('low')}: {formatTemp(main.temp_min, unit)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:max-w-xs">
          {aqiInfo && (
            <div className={`rounded-xl p-3 ${aqiInfo.bg}`}>
              <p className="text-xs text-slate-500">{t('airQuality')}</p>
              <p className={`text-lg font-semibold ${aqiInfo.color}`}>{t(`aqiLevels.${aqi}`) || aqiInfo.label}</p>
            </div>
          )}
          {uvInfo && (
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">{t('uvIndex')}</p>
              <p className={`text-lg font-semibold ${uvInfo.color}`}>{uv.toFixed(1)} — {uvInfo.label}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-slate-100 p-4 sm:grid-cols-3 sm:p-5 lg:grid-cols-4">
        <StatItem icon="💧" label={t('humidity')} value={`${main.humidity}%`} />
        <StatItem icon="💨" label={t('windSpeed')} value={wind.speed} unit="m/s" />
        <StatItem icon="🌡️" label={t('pressure')} value={main.pressure} unit="hPa" />
        <StatItem icon="👁️" label={t('visibility')} value={(visibility / 1000).toFixed(1)} unit="km" />
        <StatItem icon="☁️" label={t('cloudCover')} value={`${clouds?.all ?? 0}%`} />
        <StatItem icon="🌅" label={t('sunrise')} value={formatTime(sys.sunrise, timezone)} />
        <StatItem icon="🌇" label={t('sunset')} value={formatTime(sys.sunset, timezone)} />
        <StatItem icon="📍" label={t('coordinates')} value={`${coord.lat.toFixed(2)}, ${coord.lon.toFixed(2)}`} />
      </div>
    </div>
  );
}
