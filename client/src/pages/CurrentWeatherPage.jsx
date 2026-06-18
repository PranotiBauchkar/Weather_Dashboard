import { useWeatherContext } from '../context/WeatherContext';
import WeatherCard from '../components/WeatherCard';
import PageHeader from '../components/layout/PageHeader';
import { formatCityLabel } from '../utils/weatherUtils';

export default function CurrentWeatherPage() {
  const { weather, airQuality, uvIndex, currentCity, toggleFavorite, isFavorite } = useWeatherContext();

  if (!weather) return null;

  return (
    <div className="space-y-6">
      <PageHeader title="Current Weather" subtitle={formatCityLabel(weather)} />
      <WeatherCard
        weather={weather}
        airQuality={airQuality}
        uvIndex={uvIndex}
        isFavorite={isFavorite(currentCity)}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}
