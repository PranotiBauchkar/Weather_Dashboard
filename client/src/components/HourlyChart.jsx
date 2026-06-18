import { useUnit } from '../context/UnitContext';
import { useLanguage } from '../context/LanguageContext';
import { celsiusToFahrenheit } from '../services/weatherService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="mb-1 font-medium text-slate-800">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
          {entry.name === 'Temperature' ? `°${unit === 'celsius' ? 'C' : 'F'}` : entry.name === 'Rain' ? '%' : ''}
        </p>
      ))}
    </div>
  );
};

export default function HourlyChart({ hourlyForecast }) {
  const { unit } = useUnit();
  const { t } = useLanguage();

  if (!hourlyForecast || hourlyForecast.length === 0) return null;

  const chartData = hourlyForecast.map((hour) => ({
    time: hour.time,
    Temperature: unit === 'fahrenheit' ? celsiusToFahrenheit(hour.temp) : hour.temp,
    Rain: hour.pop,
  }));

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-slate-800">{t('hourlyForecast')}</h3>
      <div className="h-64 w-full min-w-0 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 11 }} />
            <YAxis yAxisId="temp" tick={{ fill: '#64748B', fontSize: 12 }} />
            <YAxis yAxisId="rain" orientation="right" domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Legend wrapperStyle={{ color: '#64748B' }} />
            <Line yAxisId="temp" type="monotone" dataKey="Temperature" stroke="#38BDF8" strokeWidth={2} dot={{ r: 3 }} />
            <Line yAxisId="rain" type="monotone" dataKey="Rain" stroke="#6366F1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {hourlyForecast.map((hour) => (
          <div key={hour.dt} className="shrink-0 rounded-xl bg-slate-50 px-3 py-2 text-center min-w-[72px]">
            <p className="text-xs text-slate-400">{hour.time}</p>
            <p className="font-bold text-slate-800">{unit === 'fahrenheit' ? celsiusToFahrenheit(hour.temp) : hour.temp}°</p>
            <p className="text-xs text-indigo">🌧 {hour.pop}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
