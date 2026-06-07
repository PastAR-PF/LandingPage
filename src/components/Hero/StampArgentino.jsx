'use client';

/* Sello tipo tampón con banda diagonal "ARGENTINA".
   Monocromo gris azul oscuro + textura rugosa (displacement + erosión de tinta). */

const INK = '#3E4B5C';

export default function StampArgentino(props) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <defs>
        <path id="stampTop" fill="none" d="M 100,100 m -74,0 a 74,74 0 1,1 148,0" />
        <path id="stampBottom" fill="none" d="M 100,100 m -74,0 a 74,74 0 1,0 148,0" />

        {/* Textura de sello: bordes irregulares + tinta picada */}
        <filter id="roughStamp" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" seed="6" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="3.2"
            xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" seed="9" result="grain" />
          <feColorMatrix in="grain" type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0.8 -0.42" result="speck" />
          <feComposite in="rough" in2="speck" operator="out" />
        </filter>
      </defs>

      <g filter="url(#roughStamp)" fill={INK} stroke={INK}>
        {/* Aros */}
        <circle cx="100" cy="100" r="94" fill="none" strokeWidth="4" />
        <circle cx="100" cy="100" r="84" fill="none" strokeWidth="2.5" />

        {/* Texto curvo + puntos laterales */}
        <text stroke="none" fontSize="13" fontWeight="700" letterSpacing="2.4"
              fontFamily="Arial, Helvetica, sans-serif" textAnchor="middle">
          <textPath href="#stampTop" startOffset="50%">MADE IN</textPath>
        </text>
        <text stroke="none" fontSize="13" fontWeight="700" letterSpacing="2.4"
              fontFamily="Arial, Helvetica, sans-serif" textAnchor="middle">
          <textPath href="#stampBottom" startOffset="50%">HECHO EN</textPath>
        </text>
        <circle cx="26" cy="100" r="2.6" stroke="none" />
        <circle cx="174" cy="100" r="2.6" stroke="none" />

        {/* Banda diagonal ARGENTINA */}
        <g transform="rotate(-10 100 100)">
          <rect x="6" y="84" width="188" height="3.2" stroke="none" />
          <rect x="6" y="113" width="188" height="3.2" stroke="none" />
          <text x="100" y="101.5" stroke="none" textAnchor="middle" dominantBaseline="central"
                fontFamily="'Arial Narrow', 'Arial Black', Arial, sans-serif"
                fontWeight="900" fontSize="30" letterSpacing="0.5">ARGENTINA</text>
        </g>
      </g>
    </svg>
  );
}
