export const ROUTES = [
  { path: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { path: '/current', label: 'Current Weather', icon: 'current' },
  { path: '/hourly', label: 'Hourly Forecast', icon: 'hourly' },
  { path: '/forecast', label: '7-Day Forecast', icon: 'forecast' },
  { path: '/analytics', label: 'Analytics', icon: 'analytics' },
  { path: '/air-quality', label: 'Air Quality', icon: 'aqi' },
  { path: '/uv', label: 'UV Index', icon: 'uv' },
  { path: '/alerts', label: 'Weather Alerts', icon: 'alerts', badge: true },
  { path: '/notifications', label: 'Notifications', icon: 'notifications' },
  { path: '/profile', label: 'Profile', icon: 'profile' },
  { path: '/settings', label: 'Settings', icon: 'settings' },
];

export const ROUTE_LABELS = Object.fromEntries(
  ROUTES.map((r) => [r.path, r.label])
);
