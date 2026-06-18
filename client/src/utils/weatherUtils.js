export function generateWeatherAlerts(weather, forecast, uvIndex, t) {
  if (!weather) return [];
  const alerts = [];
  const main = weather.weather?.[0]?.main?.toLowerCase() || '';
  const desc = weather.weather?.[0]?.description?.toLowerCase() || '';
  const temp = weather.main?.temp ?? 20;
  const wind = weather.wind?.speed ?? 0;
  const uv = uvIndex?.value ?? 0;

  const maxPop = forecast?.list?.reduce((max, item) => Math.max(max, item.pop || 0), 0) ?? 0;
  const popPercent = Math.round(maxPop * 100);

  // helper to add or upgrade an alert by type (keep highest severity)
  const severityRank = { low: 0, moderate: 1, severe: 2 };
  const alertMap = new Map();
  const addOrUpgrade = (a) => {
    const key = a.type;
    const existing = alertMap.get(key);
    if (!existing || (severityRank[a.severity] || 0) > (severityRank[existing.severity] || 0)) {
      alertMap.set(key, a);
    }
  };

  if (main.includes('thunder') || desc.includes('thunder')) {
    addOrUpgrade({
      id: 'storm',
      type: 'storm',
      severity: 'severe',
      title: t('alertTypes.storm'),
      message: 'Thunderstorm activity detected. Stay indoors and avoid open areas.',
      icon: '⛈️',
    });
  }

  if (main.includes('rain') || popPercent > 70) {
    addOrUpgrade({
      id: 'rain',
      type: 'rain',
      severity: popPercent > 85 ? 'severe' : 'moderate',
      title: t('alertTypes.rain'),
      message: `Heavy rainfall expected (${popPercent}% probability). Carry umbrella and drive carefully.`,
      icon: '🌧️',
    });
  }

  if (popPercent > 80 && (main.includes('rain') || desc.includes('shower'))) {
    addOrUpgrade({
      id: 'flood',
      type: 'flood',
      severity: 'moderate',
      title: t('alertTypes.flood'),
      message: 'High precipitation may cause localized flooding in low-lying areas.',
      icon: '🌊',
    });
  }

  if (temp >= 38) {
    addOrUpgrade({
      id: 'heatwave',
      type: 'heatwave',
      severity: 'severe',
      title: t('alertTypes.heatwave'),
      message: `Extreme heat (${Math.round(temp)}°C). Stay hydrated, avoid midday sun.`,
      icon: '🔥',
    });
  } else if (temp >= 35) {
    addOrUpgrade({
      id: 'heatwave',
      type: 'heatwave',
      severity: 'moderate',
      title: t('alertTypes.heatwave'),
      message: `High temperature (${Math.round(temp)}°C). Drink plenty of water.`,
      icon: '☀️',
    });
  }

  if (temp <= 0) {
    addOrUpgrade({
      id: 'cold',
      type: 'cold',
      severity: 'moderate',
      title: t('alertTypes.cold'),
      message: `Freezing conditions (${Math.round(temp)}°C). Dress warmly and watch for ice.`,
      icon: '❄️',
    });
  }

  if (wind >= 15) {
    addOrUpgrade({
      id: 'wind',
      type: 'wind',
      severity: wind >= 20 ? 'severe' : 'moderate',
      title: t('alertTypes.wind'),
      message: `Strong winds at ${wind} m/s. Secure outdoor objects.`,
      icon: '💨',
    });
  }

  if (uv >= 8) {
    addOrUpgrade({
      id: 'uv',
      type: 'uv',
      severity: uv >= 10 ? 'severe' : 'moderate',
      title: t('alertTypes.uv'),
      message: `UV index is ${uv.toFixed(1)}. Use SPF 50+ and limit sun exposure.`,
      icon: '🧴',
    });
  }

  // return alerts as array, sorted by severity then type
  return Array.from(alertMap.values()).sort((a, b) => (severityRank[b.severity] || 0) - (severityRank[a.severity] || 0));
}

export function searchGeocode(query) {
  return fetch(`/api/geocode?q=${encodeURIComponent(query)}`).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Search failed');
    return data;
  });
}

export function formatCityLabel(weather) {
  if (!weather) return '';
  const parts = [weather.name];
  if (weather.state) parts.push(weather.state);
  if (weather.sys?.country) parts.push(weather.sys.country);
  return parts.join(', ');
}
