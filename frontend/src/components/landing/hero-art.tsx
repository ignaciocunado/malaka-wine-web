/** Illustration of a Málaga wine bottle and an olive oil bottle under the Mediterranean sun. */
export function HeroArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 400" className={className} role="img" aria-label="A bottle of Málaga wine and a bottle of olive oil">
      <defs>
        <radialGradient id="hero-sun" cx="50%" cy="46%" r="50%">
          <stop offset="0%" stopColor="#ffd9a0" />
          <stop offset="55%" stopColor="#ffb07a" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ff8a7a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-wine" x1="0" x2="1">
          <stop offset="0%" stopColor="#2a0611" />
          <stop offset="38%" stopColor="#7a1631" />
          <stop offset="62%" stopColor="#5a1024" />
          <stop offset="100%" stopColor="#24050f" />
        </linearGradient>
        <linearGradient id="hero-oil" x1="0" x2="1">
          <stop offset="0%" stopColor="#5d5a0e" />
          <stop offset="42%" stopColor="#c2b232" />
          <stop offset="70%" stopColor="#9a8f1c" />
          <stop offset="100%" stopColor="#4f4c0b" />
        </linearGradient>
        <linearGradient id="hero-shine" x1="0" x2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hero-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="240" cy="190" r="185" fill="url(#hero-sun)" />
      <ellipse cx="246" cy="372" rx="150" ry="16" fill="url(#hero-shadow)" />

      {/* Wine bottle */}
      <path
        d="M180 40H210V118C210 138 240 146 240 176V356Q240 370 226 370H164Q150 370 150 356V176C150 146 180 138 180 118Z"
        fill="url(#hero-wine)"
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
        Moscatel
      </text>
      <text x="195" y="306" textAnchor="middle" fontSize="7.5" letterSpacing="1" fill="#6b5b50">
        AXARQUÍA
      </text>

      {/* Olive oil bottle */}
      <path
        d="M290 150H314V176C314 186 342 190 342 204V358Q342 370 330 370H274Q262 370 262 358V204C262 190 290 186 290 176Z"
        fill="url(#hero-oil)"
      />
      <rect x="286" y="132" width="32" height="26" rx="5" fill="#c9a24a" />
      <rect x="269" y="210" width="8" height="144" rx="4" fill="url(#hero-shine)" />
      <rect x="270" y="268" width="64" height="62" rx="4" fill="#fbf6e9" />
      <text x="302" y="290" textAnchor="middle" fontSize="9" fontWeight="700" letterSpacing="1.5" fill="#4f5a12">
        AOVE
      </text>
      <text x="302" y="306" textAnchor="middle" fontSize="10" fontStyle="italic" fill="#3a2a22">
        Hojiblanca
      </text>
      <text x="302" y="320" textAnchor="middle" fontSize="7" letterSpacing="1" fill="#6b5b50">
        ANTEQUERA
      </text>

      {/* Olive sprig */}
      <g transform="translate(352 318) rotate(-18)">
        <path d="M0 40C20 30 44 14 70 0" stroke="#5e6b1e" strokeWidth="3" strokeLinecap="round" fill="none" />
        <ellipse cx="24" cy="20" rx="16" ry="5" transform="rotate(-48 24 20)" fill="#7d8c2f" />
        <ellipse cx="42" cy="22" rx="15" ry="4.5" transform="rotate(22 42 22)" fill="#6b7a26" />
        <ellipse cx="56" cy="2" rx="14" ry="4.5" transform="rotate(-40 56 2)" fill="#8b9a3a" />
        <ellipse cx="30" cy="34" rx="7" ry="9" fill="#3b4a12" />
        <ellipse cx="50" cy="14" rx="6" ry="8" fill="#4a1a2a" />
      </g>
    </svg>
  );
}
