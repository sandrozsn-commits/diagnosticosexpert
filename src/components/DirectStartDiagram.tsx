import React from 'react';

/**
 * Componente de Diagrama Elétrico: Partida Direta com Selo
 * Reprodução gráfica industrial seguindo IEC 60617.
 * Referência: Composição visual com condutores verticais e derivações laterais.
 */
export const DirectStartDiagram = () => {
  return (
    <div className="w-full bg-white p-6 border border-border rounded-lg shadow-sm flex justify-center">
      <svg
        viewBox="0 0 1450 1000"
        width="100%"
        className="max-w-4xl"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="1450" height="1000" fill="#ffffff" />

        {/* ========================================================
            1. CIRCUITO DE COMANDO (220 V~)
            ======================================================== */}
        <g stroke="#000000" strokeWidth="4" fill="none">
          {/* Condutor superior */}
          <line x1="100" y1="100" x2="600" y2="100" />
          <text x="50" y="105" fontSize="24" fontWeight="bold" stroke="none" fill="#000">L1</text>
          
          {/* Ramo principal */}
          <line x1="200" y1="100" x2="200" y2="850" />
          
          {/* Q2 - Disjuntor monopolar */}
          <g transform="translate(180, 150)">
            <rect x="0" y="0" width="40" height="50" />
            <line x1="0" y1="50" x2="40" y2="0" />
          </g>
          <text x="230" y="185" fontSize="24" stroke="none" fill="#000">Q2</text>

          {/* F2 - Fusível */}
          <g transform="translate(180, 250)">
            <rect x="0" y="0" width="40" height="30" />
          </g>
          <text x="230" y="275" fontSize="24" stroke="none" fill="#000">F2</text>
          <text x="230" y="300" fontSize="20" stroke="none" fill="#000">1A</text>

          {/* FT1 - Relé térmico (NF 95-96) */}
          <g transform="translate(180, 350)">
            <line x1="0" y1="0" x2="40" y2="0" />
            <line x1="0" y1="40" x2="40" y2="40" />
            <line x1="20" y1="0" x2="20" y2="40" />
            <line x1="5" y1="45" x2="35" y2="-5" />
          </g>
          <text x="230" y="380" fontSize="24" stroke="none" fill="#000">FT1</text>
          <text x="260" y="360" fontSize="18" stroke="none" fill="#000">95</text>
          <text x="260" y="390" fontSize="18" stroke="none" fill="#000">96</text>

          {/* S0 - Botão de parada (NF) */}
          <g transform="translate(180, 450)">
            <line x1="0" y1="0" x2="40" y2="0" />
            <line x1="0" y1="40" x2="40" y2="40" />
            <line x1="20" y1="0" x2="20" y2="40" />
            <line x1="5" y1="45" x2="35" y2="-5" />
          </g>
          <text x="230" y="480" fontSize="24" stroke="none" fill="#000">S0</text>
          <text x="260" y="460" fontSize="18" stroke="none" fill="#000">11</text>
          <text x="260" y="490" fontSize="18" stroke="none" fill="#000">12</text>

          {/* Nós da derivação do selo */}
          <circle cx="200" cy="520" r="8" fill="#000" />
          <circle cx="200" cy="700" r="8" fill="#000" />

          {/* Ramo do S1 */}
          <line x1="200" y1="520" x2="200" y2="550" />
          <g transform="translate(180, 550)">
            <line x1="0" y1="0" x2="40" y2="0" />
            <line x1="0" y1="40" x2="40" y2="40" />
            <line x1="20" y1="0" x2="20" y2="40" />
          </g>
          <line x1="200" y1="590" x2="200" y2="700" />
          <text x="230" y="580" fontSize="24" stroke="none" fill="#000">S1</text>
          <text x="260" y="560" fontSize="18" stroke="none" fill="#000">13</text>
          <text x="260" y="590" fontSize="18" stroke="none" fill="#000">14</text>

          {/* Ramo do Selo (KM1 NA) */}
          <line x1="200" y1="520" x2="400" y2="520" />
          <line x1="400" y1="520" x2="400" y2="600" />
          <g transform="translate(380, 600)">
            <line x1="0" y1="0" x2="40" y2="0" />
            <line x1="0" y1="40" x2="40" y2="40" />
            <line x1="20" y1="0" x2="20" y2="40" />
          </g>
          <line x1="400" y1="640" x2="400" y2="700" />
          <line x1="400" y1="700" x2="200" y2="700" />
          <text x="430" y="630" fontSize="24" stroke="none" fill="#000">KM1</text>
          <text x="430" y="660" fontSize="18" stroke="none" fill="#000">13</text>
          <text x="430" y="690" fontSize="18" stroke="none" fill="#000">14</text>

          {/* Bobina KM1 */}
          <rect x="160" y="750" width="80" height="50" />
          <text x="260" y="785" fontSize="24" stroke="none" fill="#000">KM1</text>
          <text x="130" y="765" fontSize="18" stroke="none" fill="#000">A1</text>
          <text x="130" y="795" fontSize="18" stroke="none" fill="#000">A2</text>
          <line x1="200" y1="800" x2="200" y2="850" />

          {/* N */}
          <line x1="100" y1="850" x2="300" y2="850" />
          <text x="50" y="855" fontSize="24" fontWeight="bold" stroke="none" fill="#000">N</text>
        </g>

        {/* ========================================================
            2. CIRCUITO DE POTÊNCIA
            ======================================================== */}
        <g stroke="#000000" strokeWidth="4" fill="none">
          <text x="800" y="105" fontSize="24" fontWeight="bold" stroke="none" fill="#000">L1</text>
          <text x="950" y="105" fontSize="24" fontWeight="bold" stroke="none" fill="#000">L2</text>
          <text x="1100" y="105" fontSize="24" fontWeight="bold" stroke="none" fill="#000">L3</text>

          {[800, 950, 1100].map((x, i) => (
            <g key={i}>
              <line x1={x} y1="120" x2={x} y2="850" />
              {/* Q1 Disjuntor */}
              <line x1={x - 10} y1="150" x2={x + 10} y2="160" />
              {/* Fusível */}
              <rect x={x - 15} y="250" width="30" height="40" />
              {/* Contator KM1 */}
              <line x1={x - 10} y1="350" x2={x + 10} y2="360" />
              {/* Relé térmico */}
              <line x1={x - 10} y1="450" x2={x + 10} y2="450" />
              <line x1={x - 10} y1="470" x2={x + 10} y2="470" />
              <line x1={x} y1="450" x2={x} y2="470" />
            </g>
          ))}
          <text x="1130" y="170" fontSize="24" stroke="none" fill="#000">Q1</text>
          <text x="1130" y="280" fontSize="24" stroke="none" fill="#000">F1</text>
          <text x="1130" y="370" fontSize="24" stroke="none" fill="#000">KM1</text>
          <text x="1130" y="470" fontSize="24" stroke="none" fill="#000">FT1</text>

          {/* Motor */}
          <circle cx="950" cy="650" r="80" strokeWidth="4" />
          <text x="950" y="660" textAnchor="middle" fontSize="40" fontWeight="bold" stroke="none" fill="#000">M</text>
          <text x="950" y="690" textAnchor="middle" fontSize="24" stroke="none" fill="#000">3~</text>
          
          <line x1="800" y1="600" x2="880" y2="630" />
          <line x1="950" y1="570" x2="950" y2="600" />
          <line x1="1100" y1="600" x2="1020" y2="630" />
        </g>

        {/* Legendas de Bloco */}
        <rect x="50" y="920" width="600" height="60" rx="10" stroke="#000" strokeWidth="2" />
        <text x="350" y="960" textAnchor="middle" fontSize="24" fontWeight="bold" stroke="none" fill="#000">1. CIRCUITO DE COMANDO (220 V~)</text>
        
        <rect x="750" y="920" width="600" height="60" rx="10" stroke="#000" strokeWidth="2" />
        <text x="1050" y="960" textAnchor="middle" fontSize="24" fontWeight="bold" stroke="none" fill="#000">2. CIRCUITO DE POTÊNCIA</text>
      </svg>
    </div>
  );
};
