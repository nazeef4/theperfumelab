export default function Monogram({ className = "h-11 w-11", ring = true }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="tplGold" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E3CC92" />
          <stop offset=".5" stopColor="#C9A24B" />
          <stop offset="1" stopColor="#8F6B23" />
        </linearGradient>
      </defs>
      {ring && (
        <circle cx="32" cy="32" r="25" stroke="url(#tplGold)" strokeWidth="1.6" fill="none" />
      )}
      {ring && (
        <circle cx="32" cy="32" r="21" stroke="url(#tplGold)" strokeWidth=".7" fill="none" opacity=".6" />
      )}
      <rect x="28.8" y="14.5" width="6.4" height="5.2" rx="1.2" stroke="url(#tplGold)" strokeWidth="1.7" fill="none" />
      <rect x="30.3" y="19.7" width="3.4" height="3.1" stroke="url(#tplGold)" strokeWidth="1.6" fill="none" />
      <rect x="22.8" y="22.8" width="18.4" height="23.4" rx="5" stroke="url(#tplGold)" strokeWidth="1.8" fill="none" />
      <path d="M22.8 36.5h18.4" stroke="url(#tplGold)" strokeWidth="1.2" opacity=".8" />
      <circle cx="28.4" cy="41.2" r="1.6" fill="url(#tplGold)" />
      <circle cx="33.2" cy="42.6" r="1" fill="url(#tplGold)" opacity=".85" />
      <path d="M43.6 11.6l1.15 3.05 3.05 1.15-3.05 1.15-1.15 3.05-1.15-3.05-3.05-1.15 3.05-1.15z" fill="url(#tplGold)" />
    </svg>
  );
}
