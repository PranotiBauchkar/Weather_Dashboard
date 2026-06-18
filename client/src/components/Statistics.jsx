import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../context/LanguageContext';

const TABS = [
  { id: 'temp', label: 'Temperature', color: '#38BDF8', unit: '°C' },
  { id: 'humidity', label: 'Humidity', color: '#6366F1', unit: '%' },
  { id: 'wind', label: 'Wind Speed', color: '#22D3EE', unit: 'm/s' },
];

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-slate-800">{label}</p>
      <p className="text-slate-600">{payload[0].value}{unit}</p>
    </div>
  );
};

export default function Statistics({ statistics }) {
  const [activeTab, setActiveTab] = useState('temp');
  const { t } = useLanguage();

  if (!statistics || statistics.length === 0) return null;

  const currentTab = TABS.find((tab) => tab.id === activeTab);
  const chartConfig = {
    temp: { dataKey: 'temp', Chart: AreaChart, fill: currentTab.color },
    humidity: { dataKey: 'humidity', Chart: BarChart, fill: currentTab.color },
    wind: { dataKey: 'wind', Chart: AreaChart, fill: currentTab.color },
  };
  const config = chartConfig[activeTab];
  const ChartComponent = config.Chart;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-800">{t('weatherStatistics')}</h3>
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium sm:text-sm ${
                activeTab === tab.id ? 'bg-white text-indigo shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64 w-full min-w-0 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={statistics} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 12 }} />
            <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip unit={currentTab.unit} />} />
            {activeTab === 'humidity' ? (
              <Bar dataKey={config.dataKey} fill={config.fill} radius={[6, 6, 0, 0]} />
            ) : (
              <Area type="monotone" dataKey={config.dataKey} stroke={config.fill} fill={config.fill} fillOpacity={0.2} strokeWidth={2} />
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
