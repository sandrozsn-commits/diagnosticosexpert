import React from 'react';

/**
 * Componente de Diagrama Elétrico: Partida Direta com Selo
 * Simbologia Técnica baseada na IEC 60617.
 * Circuito de Comando (220V~) e Circuito de Potência.
 */
export const DirectStartDiagram = () => {
  return (
    <div className="w-full bg-white p-4 overflow-auto">
      <svg
        viewBox="0 0 1000 700"
        width="100%"
        height="auto"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="font-mono"
      >
        {/* Fundo Branco */}
        <rect width="1000" height="700" fill="#ffffff" />

        {/* --- 1. CIRCUITO DE COMANDO --- */}
        <g stroke="#000000" strokeWidth="2" fill="none">
          {/* Títulos */}
          <text x="50" y="40" fontSize="18" fontWeight="bold" fill="#000" stroke="none">1. DIAGRAMA DE COMANDO</text>
          
          {/* Trilho Superior L1 */}
          <line x1="150" y1="80" x2="350" y2="80" />
          <text x="130" y="85" fontSize="14" fill="#000" stroke="none">L1</text>
          <circle cx="250" cy="80" r="3" fill="#000" />

          {/* Q1 - Disjuntor de Comando */}
          <line x1="250" y1="80" x2="250" y2="110" />
          <rect x="240" y="110" width="20" height="30" />
          <text x="270" y="130" fontSize="14" fill="#000" stroke="none">Q1</text>
          <line x1="250" y1="140" x2="250" y2="160" />

          {/* F1 - Fusível */}
          <rect x="242" y="160" width="16" height="30" />
          <line x1="250" y1="160" x2="250" y2="190" />
          <text x="270" y="180" fontSize="14" fill="#000" stroke="none">F1</text>
          <line x1="250" y1="190" x2="250" y2="210" />

          {/* FT1 - Contato Térmico (95-96) NF */}
          <line x1="240" y1="210" x2="260" y2="210" />
          <line x1="240" y1="240" x2="260" y2="240" />
          <line x1="250" y1="210" x2="250" y2="240" />
          <line x1="242" y1="242" x2="258" y2="208" /> {/* Traço transversal NF */}
          <text x="215" y="215" fontSize="10" fill="#000" stroke="none">95</text>
          <text x="215" y="240" fontSize="10" fill="#000" stroke="none">96</text>
          <text x="270" y="230" fontSize="14" fill="#000" stroke="none">FT1</text>
          <line x1="250" y1="240" x2="250" y2="260" />

          {/* S0 - Botoeira PARADA NF */}
          <line x1="240" y1="260" x2="260" y2="260" />
          <line x1="240" y1="290" x2="260" y2="290" />
          <line x1="250" y1="260" x2="250" y2="290" />
          <line x1="242" y1="292" x2="258" y2="258" /> {/* Traço transversal NF */}
          <text x="270" y="280" fontSize="14" fill="#000" stroke="none">S0</text>
          <line x1="250" y1="290" x2="250" y2="310" />

          {/* Nó de entrada do paralelo */}
          <circle cx="250" cy="310" r="3" fill="#000" />
          
          {/* Paralelo S1 e KM1 NA */}
          <line x1="250" y1="310" x2="250" y2="330" />
          
          {/* Ramo S1 (NA) */}
          <line x1="250" y1="310" x2="180" y2="310" />
          <line x1="180" y1="310" x2="180" y2="330" />
          <line x1="170" y1="330" x2="190" y2="330" />
          <line x1="170" y1="360" x2="190" y2="360" />
          <line x1="180" y1="360" x2="180" y2="380" />
          <text x="155" y="335" fontSize="10" fill="#000" stroke="none">13</text>
          <text x="155" y="360" fontSize="10" fill="#000" stroke="none">14</text>
          <text x="195" y="350" fontSize="14" fill="#000" stroke="none">S1</text>
          
          {/* Ramo KM1 Selo (NA) */}
          <line x1="250" y1="310" x2="320" y2="310" />
          <line x1="320" y1="310" x2="320" y2="330" />
          <line x1="310" y1="330" x2="330" y2="330" />
          <line x1="310" y1="360" x2="330" y2="360" />
          <line x1="320" y1="360" x2="320" y2="380" />
          <text x="335" y="335" fontSize="10" fill="#000" stroke="none">13</text>
          <text x="335" y="360" fontSize="10" fill="#000" stroke="none">14</text>
          <text x="275" y="350" fontSize="14" fill="#000" stroke="none">KM1 (selo)</text>

          {/* Nó de saída do paralelo */}
          <line x1="180" y1="380" x2="320" y2="380" />
          <circle cx="250" cy="380" r="3" fill="#000" />
          <line x1="250" y1="380" x2="250" y2="410" />

          {/* KM1 - Bobina */}
          <rect x="230" y="410" width="40" height="25" />
          <text x="240" y="428" fontSize="12" fontWeight="bold" fill="#000" stroke="none">KM1</text>
          <text x="215" y="415" fontSize="10" fill="#000" stroke="none">A1</text>
          <text x="215" y="440" fontSize="10" fill="#000" stroke="none">A2</text>
          <line x1="250" y1="435" x2="250" y2="460" />

          {/* Trilho Inferior N */}
          <line x1="150" y1="460" x2="350" y2="460" />
          <text x="130" y="465" fontSize="14" fill="#000" stroke="none">N</text>
          <circle cx="250" cy="460" r="3" fill="#000" />
        </g>

        {/* --- 2. CIRCUITO DE POTÊNCIA --- */}
        <g stroke="#000000" strokeWidth="2" fill="none">
          <text x="50" y="520" fontSize="18" fontWeight="bold" fill="#000" stroke="none">2. DIAGRAMA DE POTÊNCIA</text>

          {/* Fases L1, L2, L3 */}
          {[600, 640, 680].map((x, i) => (
            <g key={i}>
              <text x={x - 10} y="550" fontSize="14" fill="#000" stroke="none">{`L${i + 1}`}</text>
              
              {/* Condutor vertical */}
              <line x1={x} y1="560" x2={x} y2="680" />
              
              {/* Q1 - Proteção (Disjuntor) */}
              <rect x={x - 8} y="570" width="16" height="20" />
              {i === 1 && <text x={x + 15} y="585" fontSize="12" fill="#000" stroke="none">Q1</text>}

              {/* KM1 - Contatos Principais */}
              <line x1={x - 6} y1="605" x2={x + 6} y2="605" />
              <line x1={x - 6} y1="620" x2={x + 6} y2="620" />
              {i === 1 && <text x={x + 15} y="618" fontSize="12" fill="#000" stroke="none">KM1</text>}

              {/* FT1 - Relé Térmico */}
              <rect x={x - 10} y="635" width="20" height="15" />
              <path d={`M${x - 5} ${x > 670 ? 650 : 650} q5 -4 0 -8`} strokeWidth="1" />
              {i === 1 && <text x={x + 15} y="648" fontSize="12" fill="#000" stroke="none">FT1</text>}
            </g>
          ))}

          {/* Motor M1 */}
          <circle cx="640" cy="670" r="25" fill="#fff" />
          <text x="640" y="675" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#000" stroke="none">M1</text>
          <text x="640" y="688" textAnchor="middle" fontSize="10" fill="#000" stroke="none">3~</text>
          
          {/* Conexões finais ao motor */}
          <line x1="600" y1="650" x2="618" y2="660" />
          <line x1="640" y1="650" x2="640" y2="645" />
          <line x1="680" y1="650" x2="662" y2="660" />
        </g>
      </svg>
    </div>
  );
};
