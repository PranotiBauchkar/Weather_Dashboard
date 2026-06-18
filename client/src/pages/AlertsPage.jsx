import { useOutletContext } from 'react-router-dom';
import WeatherAlerts from '../components/WeatherAlerts';
import PageHeader from '../components/layout/PageHeader';
import { useWeatherContext } from '../context/WeatherContext';
import { formatCityLabel } from '../utils/weatherUtils';

export default function AlertsPage() {
  const { alerts } = useOutletContext() || { alerts: [] };
  const { weather } = useWeatherContext();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weather Alerts"
        subtitle={weather ? formatCityLabel(weather) : 'Severe weather warnings'}
      />
      <WeatherAlerts alerts={alerts} />
    </div>
  );
}
