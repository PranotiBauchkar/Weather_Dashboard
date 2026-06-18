import { useLanguage } from '../context/LanguageContext';
import { getAQILabel } from '../services/weatherService';

const SEVERITY_STYLES = {
  severe: 'border-l-red-500 bg-red-50',
  moderate: 'border-l-orange-400 bg-orange-50',
  low: 'border-l-yellow-400 bg-yellow-50',
};

export default function WeatherAlerts({ alerts }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <div className="saas-card flex items-center gap-4">
          <span className="text-4xl">✅</span>
          <p className="text-slate-600">{t('noAlerts')}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`saas-card border-l-4 ${SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.moderate}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl shrink-0">{alert.icon}</span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-slate-800">{alert.title}</h4>
                    <span className={`rounded-full px-2 py-0.5 text-xs uppercase ${
                      alert.severity === 'severe' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>{alert.severity}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AQIPanel({ airQuality, uvIndex }) {
  const { t } = useLanguage();
  const aqi = airQuality?.list?.[0]?.main?.aqi;
  const pollutants = airQuality?.list?.[0]?.components;
  const aqiInfo = aqi ? getAQILabel(aqi) : null;
  const uv = uvIndex?.value;
  const aqiColors = ['', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-purple-500'];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="saas-card">
        {aqiInfo ? (
          <>
            <p className="text-sm text-slate-500">{t('airQuality')}</p>
            <p className={`mt-1 text-3xl font-bold ${aqiInfo.color}`}>{t(`aqiLevels.${aqi}`) || aqiInfo.label}</p>
            <p className="text-sm text-slate-400">AQI Level {aqi} / 5</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${aqiColors[aqi]}`} style={{ width: `${(aqi / 5) * 100}%` }} />
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">{t('aqiHealth')}</p>
              <p className="mt-1 text-sm text-slate-600">{t(`aqiAdvice.${aqi}`)}</p>
            </div>
          </>
        ) : (
          <p className="text-slate-500">AQI data unavailable.</p>
        )}
      </div>

      <div className="saas-card">
        <p className="text-sm text-slate-500">{t('uvIndex')}</p>
        {uv != null ? (
          <>
            <p className="mt-1 text-4xl font-bold text-slate-800">{uv.toFixed(1)}</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500" style={{ width: `${Math.min((uv / 11) * 100, 100)}%` }} />
            </div>
          </>
        ) : (
          <p className="mt-2 text-slate-500">UV data unavailable.</p>
        )}
        {pollutants && Object.keys(pollutants).length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
            {[
              { label: 'PM2.5', value: pollutants.pm2_5?.toFixed(1) },
              { label: 'PM10', value: pollutants.pm10?.toFixed(1) },
              { label: 'O₃', value: pollutants.o3?.toFixed(0) },
            ].map((p) => (
              <div key={p.label} className="rounded-lg bg-slate-50 p-2 text-center">
                <p className="text-xs text-slate-400">{p.label}</p>
                <p className="font-semibold text-slate-800">{p.value ?? '—'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
