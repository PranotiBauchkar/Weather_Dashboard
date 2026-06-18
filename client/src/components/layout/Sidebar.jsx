import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineSun,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineMap,
  HiOutlineCloud,
  HiOutlineBell,
  HiOutlineExclamation,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineX,
  HiOutlineMenu,
} from 'react-icons/hi';
import { MdWbSunny } from 'react-icons/md';
import { ROUTES } from '../../config/routes';
import Logo from '../Logo';
import { useLanguage } from '../../context/LanguageContext';

const ICONS = {
  dashboard: HiOutlineHome,
  current: HiOutlineSun,
  hourly: HiOutlineClock,
  forecast: HiOutlineCalendar,
  analytics: HiOutlineChartBar,
  map: HiOutlineMap,
  aqi: HiOutlineCloud,
  uv: MdWbSunny,
  alerts: HiOutlineExclamation,
  notifications: HiOutlineBell,
  profile: HiOutlineUser,
  settings: HiOutlineCog,
};

export default function Sidebar({ open, onClose, alertCount = 0 }) {
  const { t } = useLanguage();
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-sidebar flex-col border-r border-slate-200/80 bg-white/95 shadow-xl backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-5">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div className="min-w-0">
              <p className="bg-gradient-to-r from-sky to-indigo bg-clip-text text-lg font-bold text-transparent">
                SkyCast
              </p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Weather SaaS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3 py-4">
          {ROUTES.map((route) => {
            const Icon = ICONS[route.icon];
            const badge = route.badge ? alertCount : 0;

            return (
              <NavLink
                key={route.path}
                to={route.path}
                end={route.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-indigo-700'
                      : 'text-slate-600 hover:bg-sky/5 hover:text-sky-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-xl border border-sky/20 bg-gradient-to-r from-sky/10 to-indigo/10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className={`relative z-10 h-5 w-5 shrink-0 ${isActive ? 'text-sky' : 'text-slate-400 group-hover:text-sky'}`} />
                    <span className="relative z-10 truncate">{t(`route_${route.icon}`) || route.label}</span>
                    {badge > 0 && (
                      <span className="relative z-10 ml-auto flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                        {badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-slate-100 p-4">
          <div className="rounded-xl bg-gradient-to-br from-sky/10 to-indigo/10 p-3">
            <p className="text-xs font-semibold text-indigo-700">{t('proWeather')}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{t('proWeatherDesc')}</p>
          </div>
        </div>
      </aside>
    </>
  );
}

export function SidebarToggle({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="saas-btn-ghost !p-2.5 lg:hidden"
      aria-label="Open menu"
    >
      <HiOutlineMenu className="h-5 w-5" />
    </button>
  );
}
