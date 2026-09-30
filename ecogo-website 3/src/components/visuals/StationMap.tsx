/**
 * Illustration of the shared power bank idea: pick up at one station, return at another.
 * It is a schematic street grid, not a real map. There are no real locations, station counts or routes.
 */
export function StationMap({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 460"
      className={className}
      role="img"
      aria-labelledby="station-map-title station-map-desc"
    >
      <title id="station-map-title">Illustration of picking up and returning a power bank</title>
      <desc id="station-map-desc">
        A simplified street grid. A person picks up a power bank at one station and returns it at a different
        station further along their route.
      </desc>

      {/* city blocks */}
      <g fill="#12305c">
        <rect x="24" y="24" width="150" height="110" rx="14" />
        <rect x="214" y="24" width="120" height="110" rx="14" />
        <rect x="374" y="24" width="162" height="110" rx="14" />
        <rect x="24" y="174" width="150" height="120" rx="14" />
        <rect x="374" y="174" width="162" height="120" rx="14" />
        <rect x="24" y="334" width="230" height="102" rx="14" />
        <rect x="294" y="334" width="242" height="102" rx="14" />
      </g>
      {/* one open square in the middle */}
      <rect x="214" y="174" width="120" height="120" rx="60" fill="#1a4680" />

      {/* route: follows the streets around the open square */}
      <path
        d="M194 154 V314 H354 V154"
        fill="none"
        stroke="#f5a70a"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2 14"
      />

      {/* stations */}
      {[194, 354].map((x) => (
        <g key={x} transform={`translate(${x} 154)`}>
          <circle r="27" fill="#78c957" stroke="#071a35" strokeWidth="3" />
          <rect x="-7" y="-11" width="14" height="22" rx="3.5" fill="#071a35" />
          <rect x="-2.5" y="-14.5" width="5" height="3" rx="1" fill="#071a35" />
          <path d="M1.5 -6 -2.5 1.5H0.5L-1.5 7 3.5 -1H0.5L1.5 -6Z" fill="#78c957" />
        </g>
      ))}

      {/* a person on the way */}
      <g transform="translate(274 314)">
        <circle r="13" fill="#ffffff" />
        <circle r="5" fill="#0b2140" />
      </g>

      {/* labels */}
      <g fontFamily="'Figtree Variable', system-ui, sans-serif" fontWeight="700" fontSize="18" fill="#ffffff" textAnchor="middle">
        <text x="194" y="104">Pick up</text>
        <text x="354" y="104">Return</text>
        <text x="274" y="372">Use it on the go</text>
      </g>
    </svg>
  )
}
