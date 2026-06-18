import { getWeatherBackground } from '../services/weatherService';

export default function SaaSBackground({ weatherMain }) {
  const bgType = getWeatherBackground(weatherMain);

  const tints = {
    sunny: 'from-amber-100/40 via-sky-100/30 to-cyan-100/40',
    rainy: 'from-slate-200/50 via-sky-200/40 to-indigo-200/30',
    snowy: 'from-white/60 via-sky-50/50 to-cyan-50/40',
    stormy: 'from-indigo-200/40 via-slate-300/30 to-purple-200/30',
    cloudy: 'from-slate-100/50 via-sky-100/40 to-indigo-100/30',
    default: 'from-sky-100/40 via-cyan-50/30 to-indigo-100/40',
  };

  const tint = tints[bgType] || tints.default;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className={`saas-bg absolute inset-0 bg-gradient-to-br ${tint}`} />
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="cloud-blob"
          style={{
            width: `${200 + i * 80}px`,
            height: `${100 + i * 40}px`,
            top: `${5 + i * 18}%`,
            left: `${-10 + i * 25}%`,
            animationDelay: `${i * 2}s`,
            opacity: 0.4 + i * 0.1,
          }}
        />
      ))}
    </div>
  );
}
