import { Link, useLocation } from 'react-router-dom';
import { HiOutlineChevronRight, HiOutlineHome } from 'react-icons/hi';
import { ROUTE_LABELS } from '../../config/routes';

export default function Breadcrumb() {
  const { pathname } = useLocation();
  const label = ROUTE_LABELS[pathname] || 'Page';

  return (
    <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
      <Link to="/" className="flex items-center gap-1 hover:text-sky transition-colors">
        <HiOutlineHome className="h-4 w-4" />
        <span>Home</span>
      </Link>
      {pathname !== '/' && (
        <>
          <HiOutlineChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="font-medium text-slate-800">{label}</span>
        </>
      )}
    </nav>
  );
}
