import { useWeatherContext } from '../context/WeatherContext';
import Statistics from '../components/Statistics';
import PageHeader from '../components/layout/PageHeader';
import { formatCityLabel } from '../utils/weatherUtils';

export default function AnalyticsPage() {
  const { weather, statistics } = useWeatherContext();
  if (!weather) return null;

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle={`Weather statistics · ${formatCityLabel(weather)}`} />
      <div className="saas-card overflow-hidden">
        <Statistics statistics={statistics} />
      </div>
    </div>
  );
}
