import { useState, useEffect } from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { useLanguage } from '../context/LanguageContext';
import PageHeader from '../components/layout/PageHeader';
import { formatCityLabel } from '../utils/weatherUtils';
import { HiOutlineLocationMarker, HiOutlineStar, HiOutlinePencil, HiOutlineCheck } from 'react-icons/hi';

export default function ProfilePage() {
  const { weather, favorites, searchHistory, dataSource } = useWeatherContext();
  const { t } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Weather User',
    email: 'user@skycast.app',
  });

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('skycast_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('skycast_profile', JSON.stringify(profile));
    setIsEditing(false);
  };

  const initial = profile.name ? profile.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" subtitle={t('profileSubtitle')} />

      <div className="content-grid">
        <div className="saas-card text-center relative">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-sky transition-colors"
              title={t('editProfile')}
            >
              <HiOutlinePencil className="h-5 w-5" />
            </button>
          ) : (
            <button 
              onClick={handleSave} 
              className="absolute top-4 right-4 text-emerald-500 hover:text-emerald-600 transition-colors"
              title={t('saveProfile')}
            >
              <HiOutlineCheck className="h-6 w-6" />
            </button>
          )}

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky to-indigo text-2xl font-bold text-white shadow-lg">
            {initial}
          </div>
          
          {isEditing ? (
            <div className="mt-6 space-y-4 text-left">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">{t('nameLabel')}</label>
                <input 
                  type="text" 
                  className="saas-input"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">{t('emailLabel')}</label>
                <input 
                  type="email" 
                  className="saas-input"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <button onClick={handleSave} className="saas-btn-primary w-full mt-2">
                {t('saveChanges')}
              </button>
            </div>
          ) : (
            <>
              <h2 className="mt-4 text-xl font-bold text-slate-800">{profile.name}</h2>
              <p className="text-sm text-slate-500">{profile.email}</p>
              {weather && (
                <p className="mt-3 flex items-center justify-center gap-1 text-sm text-slate-600">
                  <HiOutlineLocationMarker className="h-4 w-4 text-sky" />
                  {formatCityLabel(weather)}
                </p>
              )}
            </>
          )}
        </div>

        <div className="saas-card space-y-4">
          <h3 className="font-semibold text-slate-800">{t('activitySummary')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-2xl font-bold text-indigo">{favorites.length}</p>
              <p className="text-xs text-slate-500">{t('favorites')}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-2xl font-bold text-sky">{searchHistory.length}</p>
              <p className="text-xs text-slate-500">{t('searches')}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">{t('dataSource')} {dataSource || 'open-meteo'}</p>
        </div>
      </div>

      {favorites.length > 0 && (
        <div className="saas-card">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
            <HiOutlineStar className="text-yellow-500" /> {t('favoriteCities')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {favorites.map((city) => (
              <span key={city} className="rounded-full bg-sky/10 px-3 py-1 text-sm text-sky-700">
                {city}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
