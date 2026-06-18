import { useWeatherContext } from '../context/WeatherContext';
import { useLanguage } from '../context/LanguageContext';
import { getUVLabel } from '../services/weatherService';
import PageHeader from '../components/layout/PageHeader';
import { formatCityLabel } from '../utils/weatherUtils';

export default function UVPage() {
  const { weather, uvIndex } = useWeatherContext();
  const { t } = useLanguage();
  if (!weather) return null;

  const uv = uvIndex?.value ?? 0;
  const uvInfo = getUVLabel(uv);

  return (
    <div className="space-y-6">
      <PageHeader title="UV Index" subtitle={formatCityLabel(weather)} />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="saas-card text-center">
          <p className="text-sm font-medium text-slate-500">{t('uvIndex')}</p>
          <p className={`mt-2 text-6xl font-bold ${uvInfo.color}`}>{uv.toFixed(1)}</p>
          <p className={`mt-2 text-xl font-semibold ${uvInfo.color}`}>{uvInfo.label}</p>
          <p className="mt-4 text-sm text-slate-500">{uvInfo.advice}</p>
        </div>

        <div className="saas-card">
          <h3 className="mb-4 font-semibold text-slate-800">UV Scale</h3>
          <div className="space-y-3">
            {[
              { range: '0–2', label: 'Low', color: 'bg-green-400' },
              { range: '3–5', label: 'Moderate', color: 'bg-yellow-400' },
              { range: '6–7', label: 'High', color: 'bg-orange-400' },
              { range: '8–10', label: 'Very High', color: 'bg-red-400' },
              { range: '11+', label: 'Extreme', color: 'bg-purple-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`h-3 w-3 shrink-0 rounded-full ${item.color}`} />
                <span className="w-12 shrink-0 text-sm text-slate-500">{item.range}</span>
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500"
              style={{ width: `${Math.min((uv / 11) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
