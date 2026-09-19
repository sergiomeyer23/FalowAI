export function FalowMark({ compact = false }: { compact?: boolean }) {
  return (
    <span aria-hidden="true" style={{ display: 'inline-flex', width: compact ? 30 : 34, height: compact ? 30 : 34 }}>
      <svg viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="falow-gradient" x1="5" y1="4" x2="37" y2="39" gradientUnits="userSpaceOnUse">
            <stop stopColor="#65A3FF" />
            <stop offset="1" stopColor="#7C5CFC" />
          </linearGradient>
        </defs>
        <path d="M21 3.5C11.34 3.5 3.5 10.82 3.5 19.85c0 5.08 2.55 9.64 6.58 12.63L8.6 38.5l6.4-3.36c1.9.57 3.91.86 6 .86 9.66 0 17.5-7.32 17.5-16.15S30.66 3.5 21 3.5Z" fill="url(#falow-gradient)" fillOpacity=".16" stroke="url(#falow-gradient)" strokeWidth="1.5" />
        <path d="M11 21.5c2.2-5.8 4.05-8.7 5.55-8.7 2.08 0 2.27 12.22 4.2 12.22 1.6 0 2.28-7.1 4.46-7.1 1.45 0 2.73 1.22 5.79 3.58" stroke="url(#falow-gradient)" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="11" cy="21.5" r="1.7" fill="#65A3FF" />
        <circle cx="31" cy="21.5" r="1.7" fill="#7C5CFC" />
      </svg>
    </span>
  );
}
