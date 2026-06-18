import { useOutletContext } from 'react-router-dom';
import { useWeatherContext } from '../context/WeatherContext';
import PageHeader from '../components/layout/PageHeader';

export default function NotificationsPage() {
  const { alerts } = useOutletContext() || { alerts: [] };
  const { lastUpdated, currentCity, apiStatus } = useWeatherContext();

  const notifications = [
    ...alerts.map((a) => ({
      id: a.id,
      title: a.title,
      message: a.message,
      time: 'Just now',
      type: a.severity,
      icon: a.icon,
    })),
    {
      id: 'refresh',
      title: 'Data Updated',
      message: `Weather data refreshed for ${currentCity || 'your location'}.`,
      time: lastUpdated?.toLocaleTimeString() || '—',
      type: 'info',
      icon: '🔄',
    },
    {
      id: 'api',
      title: 'API Status',
      message: apiStatus === 'connected' ? 'Weather service is live and connected.' : 'Weather service offline.',
      time: 'System',
      type: apiStatus === 'connected' ? 'info' : 'warning',
      icon: apiStatus === 'connected' ? '✅' : '⚠️',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" subtitle={`${notifications.length} notifications`} />

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`saas-card flex gap-4 ${
              n.type === 'severe' ? 'border-l-4 border-l-red-400' : n.type === 'warning' ? 'border-l-4 border-l-orange-400' : ''
            }`}
          >
            <span className="text-2xl shrink-0">{n.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h4 className="font-semibold text-slate-800">{n.title}</h4>
                <span className="shrink-0 text-xs text-slate-400">{n.time}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
