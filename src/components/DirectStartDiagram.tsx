import React from 'react';

/**
 * Componente de Diagrama Elétrico: Partida Direta com Selo
 * Simbologia Técnica baseada na IEC 60617.
 * Reprodução fiel da composição gráfica industrial.
 */
export const DirectStartDiagram = () => {
  return (
    <div className="w-full bg-white p-4 overflow-auto border border-border rounded-lg">
      <svg
        viewBox="0 0 1000 700"
        width="100%"
        height="auto"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="font-sans"
      >
        <rect width="1000" height="700" fill="#ffffff" />

        {/* --- 1. CIRCUITO DE COMANDO --- */}
        <g stroke="#000000" strokeWidth="2" fill="none">
          <text x="50" y="40" fontSize="20" fontWeight="bold" stroke="none" fill="#000">1. DIAGRAMA DE COMANDO</text>
          
          {/* Condutor vertical principal (L1) */}
          <line x1="250" y1="80" x2="250" y2="460" />
          <text x="235" y="70" fontSize="16" stroke="none" fill="#000">L1</text>

          {/* Q1 */}
          <rect x="240" y="100" width="20" height="30" />
          <text x="270" y="125" fontSize="16" stroke="none" fill="#000">Q1</text>

          {/* F1 */}
          <rect x="242" y="150" width="16" height="30" />
          <text x="270" y="175" fontSize="16" stroke="none" fill="#000">F1</text>

          {/* FT1 - NF (95-96) */}
          <line x1="240" y1="210" x2="260" y2="210" />
          <line x1="240" y1="240" x2="260" y2="240" />
          <line x1="250" y1="210" x2="250" y2="240" />
          <line x1="242" y1="242" x2="258" y2="208" />
          <text x="270" y="235" fontSize="16" stroke="none" fill="#000">FT1</text>

          {/* S0 - NF */}
          <line x1="240" y1="270" x2="260" y2="270" />
          <line x1="240" y1="300" x2="260" y2="300" />
          <line x1="250" y1="270" x2="250" y2="300" />
          <line x1="242" y1="302" x2="258" y2="268" />
          <text x="270" y="295" fontSize="16" stroke="none" fill="#000">S0</text>

          {/* NÓ E RAMO DE SELO */}
          <circle cx="250" y="320" r="3" fill="#000" />
          
          {/* Vertical após S0 */}
          <line x1="250" y1="320" x2="250" y2="410" />
          
          {/* Derivação esquerda (S1 - NA) */}
          <line x1="250" y1="320" x2="180" y2="320" />
          <line x1="180" y1="320" x2="180" y2="340" />
          <line x1="170" y1="340" x2="190" y2="340" />
          <line x1="170" y1="370" x2="190" y2="370" />
          <line x1="180" y1="370" x2="180" y2="390" />
          <line x1="180" y1="390" x2="250" y2="390" />
          <text x="140" y="365" fontSize="16" stroke="none" fill="#000">S1</text>

          {/* Derivação direita (KM1 - NA Selo) */}
          <line x1="250" y1="320" x2="320" y2="320" />
          <line x1="320" y1="320" x2="320" y2="340" />
          <line x1="310" y1="340" x2="330" y2="340" />
          <line x1="310" y1="370" x2="330" y2="370" />
          <line x1="320" y1="370" x2="320" y2="390" />
          <line x1="320" y1="390" x2="250" y2="390" />
          <text x="340" y="365" fontSize="16" stroke="none" fill="#000">KM1</text>

          {/* KM1 - Bobina */}
          <rect x="230" y="410" width="40" height="30" />
          <text x="280" y="430" fontSize="16" stroke="none" fill="#000">KM1</text>

          {/* N */}
          <line x1="250" y1="440" x2="250" y2="460" />
          <text x="235" y="475" fontSize="16" stroke="none" fill="#000">N</text>
        </g>

        {/* --- 2. CIRCUITO DE POTÊNCIA --- */}
        <g stroke="#000000" strokeWidth="2" fill="none">
          <text x="50" y="520" fontSize="20" fontWeight="bold" stroke="none" fill="#000">2. DIAGRAMA DE POTÊNCIA</text>
          
          {[600, 640, 680].map((x, i) => (
            <g key={i}>
              <text x={x - 5} y="550" fontSize="16" stroke="none" fill="#000">{`L${i + 1}`}</text>
              <line x1={x} y1="560" x2={x} y2="680" />
              
              {/* Q1 */}
              <rect x={x - 8} y="570" width="16" height="20" />
              {/* KM1 */}
              <line x1={x - 6} y1="610" x2={x + 6} y2="610" />
              <line x1={x - 6} y1="625" x2={x + 6} y2="625" />
              {/* FT1 */}
              <rect x={x - 10} y="640" width="20" height="15" />
            </g>
          ))}
          
          {/* Motor */}
          <circle cx="640" cy="670" r="25" fill="#fff" />
          <text x="640" y="675" textAnchor="middle" fontSize="16" fontWeight="bold" stroke="none" fill="#000">M1</text>
        </g>
      </svg>
    </div>
  );
};