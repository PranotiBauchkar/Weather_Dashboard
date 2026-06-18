export default function Logo({ size = 'md' }) {
  const sizes = { sm: 'h-9 w-9', md: 'h-11 w-11', lg: 'h-14 w-14' };

  return (
    <div className={`${sizes[size]} relative shrink-0`}>
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full drop-shadow-lg">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="64" y2="64">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#logoGrad)" opacity="0.9" />
        <circle cx="32" cy="32" r="28" stroke="white" strokeWidth="1" opacity="0.3" />
        <circle cx="22" cy="24" r="9" fill="#FBBF24" />
        <g stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" opacity="0.7">
          <line x1="22" y1="10" x2="22" y2="14" />
          <line x1="22" y1="34" x2="22" y2="38" />
          <line x1="8" y1="24" x2="12" y2="24" />
          <line x1="32" y1="24" x2="36" y2="24" />
          <line x1="12" y1="14" x2="15" y2="17" />
          <line x1="29" y1="31" x2="32" y2="34" />
        </g>
        <path
          d="M16 44c0-7 6-12 13-12h10c6 0 11 5 11 10 0 6-5 10-11 10H20c-5 0-5-8 0-8z"
          fill="white"
          opacity="0.95"
        />
        <path d="M28 38h16" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </svg>
    </div>
  );
}
