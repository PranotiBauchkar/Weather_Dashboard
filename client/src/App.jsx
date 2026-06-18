import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { UnitProvider } from './context/UnitContext';
import { LanguageProvider } from './context/LanguageContext';
import { WeatherProvider } from './context/WeatherContext';
import AppLayout from './components/layout/AppLayout';
import DashboardHome from './pages/DashboardHome';
import CurrentWeatherPage from './pages/CurrentWeatherPage';
import HourlyPage from './pages/HourlyPage';
import ForecastPage from './pages/ForecastPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MapPage from './pages/MapPage';
import AirQualityPage from './pages/AirQualityPage';
import UVPage from './pages/UVPage';
import AlertsPage from './pages/AlertsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <UnitProvider>
            <WeatherProvider>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="current" element={<CurrentWeatherPage />} />
                  <Route path="hourly" element={<HourlyPage />} />
                  <Route path="forecast" element={<ForecastPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="map" element={<MapPage />} />
                  <Route path="air-quality" element={<AirQualityPage />} />
                  <Route path="uv" element={<UVPage />} />
                  <Route path="alerts" element={<AlertsPage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </WeatherProvider>
          </UnitProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
