import { useWeatherContext } from '../context/WeatherContext';
import ForecastCard from '../components/ForecastCard';
import PageHeader from '../components/layout/PageHeader';
import { formatCityLabel } from '../utils/weatherUtils';

export default function ForecastPage() {
  const { weather, forecast, dailyForecast } = useWeatherContext();
  if (!weather) return null;

  const timezoneOffset = forecast?.city?.timezone || weather?.timezone || 0;

  return (
    <div className="space-y-6">
      <PageHeader title="7-Day Forecast" subtitle={formatCityLabel(weather)} />
      <div className="saas-card">
        <ForecastCard forecast={dailyForecast} timezoneOffset={timezoneOffset} />
      </div>
    </div>
  );
}
