import { useWeatherContext } from '../context/WeatherContext';
import { AQIPanel } from '../components/WeatherAlerts';
import PageHeader from '../components/layout/PageHeader';
import { formatCityLabel } from '../utils/weatherUtils';

export default function AirQualityPage() {
  const { weather, airQuality, uvIndex } = useWeatherContext();
  if (!weather) return null;

  return (
    <div className="space-y-6">
      <PageHeader title="Air Quality" subtitle={formatCityLabel(weather)} />
      <AQIPanel airQuality={airQuality} uvIndex={uvIndex} />
    </div>
  );
}
