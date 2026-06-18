import { useUnit } from '../context/UnitContext';
import { useLanguage } from '../context/LanguageContext';
import { languages } from '../locales/translations';
import PageHeader from '../components/layout/PageHeader';
import { useWeatherContext } from '../context/WeatherContext';

export default function SettingsPage() {
  // theme removed
  const { unit, toggleUnit, isCelsius } = useUnit();
  const { lang, setLang } = useLanguage();
  const { clearHistory } = useWeatherContext();

  const settings = [
    {
      label: 'Temperature Unit',
      description: `Currently showing °${isCelsius ? 'Celsius' : 'Fahrenheit'}`,
      action: <button onClick={toggleUnit} className="saas-btn-ghost text-sm">Switch to °{isCelsius ? 'F' : 'C'}</button>,
    },
    {
      label: 'Language',
      description: languages.find((l) => l.code === lang)?.label,
      action: (
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="saas-input !w-auto !py-2 text-sm"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
          ))}
        </select>
      ),
    },
    {
      label: 'Search History',
      description: 'Clear all recent searches',
      action: <button onClick={clearHistory} className="saas-btn-ghost text-sm text-red-500">Clear History</button>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Customize your experience" />

      <div className="space-y-4">
        {settings.map((s) => (
          <div key={s.label} className="saas-card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-800">{s.label}</h3>
              <p className="text-sm text-slate-500">{s.description}</p>
            </div>
            <div className="shrink-0">{s.action}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
