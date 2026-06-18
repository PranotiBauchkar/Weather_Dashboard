import { useWeatherContext } from '../context/WeatherContext';
import PageHeader from '../components/layout/PageHeader';
import { formatCityLabel } from '../utils/weatherUtils';

export default function MapPage() {
  const { weather } = useWeatherContext();
  if (!weather) return null;

  return (
    <div className="space-y-6">
      <PageHeader title="Weather Map" subtitle={formatCityLabel(weather)} />
      <div className="saas-card">
        <p className="text-sm text-muted-foreground">
          The interactive weather map was removed from this project.
        </p>
      </div>
    </div>
  );
}
