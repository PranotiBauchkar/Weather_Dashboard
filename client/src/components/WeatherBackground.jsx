import { getWeatherBackground } from '../services/weatherService';

function RainAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="rain-drop"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${0.4 + Math.random() * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}

function SnowAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="snow-flake"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            width: `${3 + Math.random() * 5}px`,
            height: `${3 + Math.random() * 5}px`,
          }}
        />
      ))}
    </div>
  );
}

function SunnyAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="sun-ray" />
      <div className="absolute right-[10%] top-[8%] h-24 w-24 animate-pulse-slow rounded-full bg-yellow-300/30 blur-xl" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="cloud-drift"
          style={{
            width: `${200 + i * 100}px`,
            height: `${100 + i * 50}px`,
            top: `${10 + i * 20}%`,
            left: `${-10 + i * 30}%`,
            animationDelay: `${i * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

function CloudAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="cloud-drift"
          style={{
            width: `${250 + i * 80}px`,
            height: `${80 + i * 30}px`,
            top: `${5 + i * 12}%`,
            left: `${-20 + i * 22}%`,
            animationDelay: `${i * 1.5}s`,
            opacity: 0.12 + i * 0.04,
          }}
        />
      ))}
    </div>
  );
}

function ThunderstormAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <RainAnimation />
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="lightning-flash absolute inset-0 bg-white"
          style={{ animationDelay: `${i * 2.5 + 1}s` }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-transparent" />
    </div>
  );
}

export default function WeatherBackground({ weatherMain }) {
  const bgType = getWeatherBackground(weatherMain);
  const bgClass = `weather-bg-${bgType}`;

  const animations = {
    sunny: <SunnyAnimation />,
    rainy: <RainAnimation />,
    snowy: <SnowAnimation />,
    cloudy: <CloudAnimation />,
    stormy: <ThunderstormAnimation />,
    default: <CloudAnimation />,
  };

  return (
    <div className={`fixed inset-0 -z-10 transition-all duration-1000 ${bgClass}`}>
      {animations[bgType] || animations.default}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
    </div>
  );
}
