import { useWeatherContext } from '../context/WeatherContext';
import HourlyChart from '../components/HourlyChart';
import PageHeader from '../components/layout/PageHeader';
import { formatCityLabel } from '../utils/weatherUtils';

export default function HourlyPage() {
  const { weather, hourlyForecast } = useWeatherContext();
  if (!weather) return null;

  return (
    <div className="space-y-6">
      <PageHeader title="Hourly Forecast" subtitle={`Next 24 hours · ${formatCityLabel(weather)}`} />
      <div className="saas-card overflow-hidden">
        <HourlyChart hourlyForecast={hourlyForecast} />
      </div>
    </div>
  );
}
