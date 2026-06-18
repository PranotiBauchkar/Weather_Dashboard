import { useUnit } from '../context/UnitContext';
import { useLanguage } from '../context/LanguageContext';
import { formatTemp, getWeatherIconUrl, formatDate } from '../services/weatherService';

export default function ForecastCard({ forecast, timezoneOffset = 0 }) {
  const { unit } = useUnit();
  const { t } = useLanguage();

  if (!forecast || forecast.length === 0) return null;

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-slate-800">{t('sevenDayForecast')}</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {forecast.map((day) => (
          <div key={day.date} className="rounded-xl bg-slate-50 p-3 flex flex-col items-center text-center">
            <p className="text-xs font-medium text-slate-500 truncate w-full">
              {formatDate(day.dt, timezoneOffset)}
            </p>
            <img src={getWeatherIconUrl(day.icon)} alt="" className="my-2 h-12 w-12 shrink-0" />
            <p className="text-xs capitalize text-slate-400 line-clamp-2">{day.description}</p>
            <div className="mt-2 flex gap-1 text-sm font-semibold text-slate-800">
              <span>{formatTemp(day.tempMax, unit)}</span>
              <span className="text-slate-400">{formatTemp(day.tempMin, unit)}</span>
            </div>
            <div className="mt-1 text-xs text-slate-400">🌧 {day.rainProbability}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
