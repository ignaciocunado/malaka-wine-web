/** Illustration of two bottles of Málaga wine, a red and a Moscatel, under the Mediterranean sun. */
export function HeroArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 400" className={className} role="img" aria-label="Una botella de vino tinto y otra de Moscatel de Málaga">
      <defs>
        <radialGradient id="hero-sun" cx="50%" cy="46%" r="50%">
          <stop offset="0%" stopColor="#ffd9a0" />
          <stop offset="55%" stopColor="#ffb07a" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ff8a7a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-red" x1="0" x2="1">
          <stop offset="0%" stopColor="#2a0611" />
          <stop offset="38%" stopColor="#7a1631" />
          <stop offset="62%" stopColor="#5a1024" />
          <stop offset="100%" stopColor="#24050f" />
        </linearGradient>
        <linearGradient id="hero-moscatel" x1="0" x2="1">
          <stop offset="0%" stopColor="#6e4510" />
          <stop offset="42%" stopColor="#e0a93a" />
          <stop offset="70%" stopColor="#b47a1c" />
          <stop offset="100%" stopColor="#5e3a0c" />
        </linearGradient>
        <linearGradient id="hero-shine" x1="0" x2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hero-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="240" cy="190" r="185" fill="url(#hero-sun)" />
      <ellipse cx="246" cy="372" rx="150" ry="16" fill="url(#hero-shadow)" />

      {/* Red wine (Bordeaux-shaped bottle) */}
      <path
        d="M180 40H210V118C210 138 240 146 240 176V356Q240 370 226 370H164Q150 370 150 356V176C150 146 180 138 180 118Z"
        fill="url(#hero-red)"
      />
      <rect x="177" y="36" width="36" height="54" rx="5" fill="#1d040b" />
      <rect x="177" y="80" width="36" height="4" fill="#c9a24a" opacity="0.9" />
      <rect x="160" y="182" width="9" height="170" rx="4.5" fill="url(#hero-shine)" />
      <rect x="158" y="236" width="74" height="86" rx="4" fill="#f5ede0" />
      <text x="195" y="262" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="2" fill="#7a1631">
        TERRUÑO
      </text>
      <line x1="172" y1="272" x2="218" y2="272" stroke="#7a1631" strokeOpacity="0.4" />
      <text x="195" y="290" textAnchor="middle" fontSize="11" fontStyle="italic" fill="#3a2a22">
        Tinto
      </text>
      <text x="195" y="306" textAnchor="middle" fontSize="7.5" letterSpacing="1" fill="#6b5b50">
        RONDA
      </text>

      {/* Moscatel (tall, slim bottle in clear glass) */}
      <path
        d="M290 92H310V150C310 180 334 196 334 226V358Q334 370 322 370H278Q266 370 266 358V226C266 196 290 180 290 150Z"
        fill="url(#hero-moscatel)"
      />
      <rect x="287" y="86" width="26" height="46" rx="4" fill="#c9a24a" />
      <rect x="273" y="232" width="7" height="122" rx="3.5" fill="url(#hero-shine)" />
      <rect x="272" y="262" width="56" height="64" rx="4" fill="#fbf6e9" />
      <text x="300" y="282" textAnchor="middle" fontSize="8" fontWeight="700" letterSpacing="1.5" fill="#8a5a12">
        TERRUÑO
      </text>
      <text x="300" y="300" textAnchor="middle" fontSize="10" fontStyle="italic" fill="#3a2a22">
        Moscatel
      </text>
      <text x="300" y="315" textAnchor="middle" fontSize="6.5" letterSpacing="1" fill="#6b5b50">
        AXARQUÍA
      </text>

      {/* Bunch of grapes */}
      <g transform="translate(352 300)">
        <path d="M26 -6C27 -16 31 -24 38 -30" stroke="#6b4a2a" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M36 -28C44 -42 62 -42 66 -30C58 -24 46 -22 36 -28Z" fill="#7d8c2f" />
        {[
          [4, 0], [20, 0], [36, 0], [48, 2],
          [12, 14], [28, 14], [42, 15],
          [18, 28], [34, 28],
          [26, 42],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="8.5" fill={i % 3 === 0 ? "#4a1830" : i % 3 === 1 ? "#5b1f3a" : "#6e2747"} />
            <circle cx={cx - 2.5} cy={cy - 3} r="2.2" fill="#fff" opacity="0.25" />
          </g>
        ))}
      </g>
    </svg>
  );
}
