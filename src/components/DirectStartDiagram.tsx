import React from 'react';

/**
 * Componente de Diagrama Elétrico: Partida Direta com Selo
 * Simbologia Técnica baseada na IEC 60617.
 * Reprodução fiel da composição gráfica industrial.
 */
export const DirectStartDiagram = () => {
  return (
    <div className="w-full bg-white p-4 overflow-auto border border-border rounded-lg shadow-sm">
      <svg
        viewBox="0 0 450 650"
        width="100%"
        height="auto"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="font-mono"
      >
        <rect width="450" height="650" fill="#ffffff" />

        {/* --- 1. CIRCUITO DE COMANDO --- */}
        <g stroke="#000000" strokeWidth="2" fill="none">
          <text x="20" y="30" fontSize="16" fontWeight="bold" stroke="none" fill="#000">DIAGRAMA DE COMANDO</text>
          
          {/* Condutor vertical principal (L1) */}
          <line x1="150" y1="60" x2="150" y2="480" />
          <text x="135" y="55" fontSize="12" stroke="none" fill="#000">L1</text>

          {/* Q1 - Disjuntor */}
          <rect x="140" y="80" width="20" height="30" />
          <text x="170" y="100" fontSize="12" stroke="none" fill="#000">Q1</text>

          {/* F1 - Fusível */}
          <rect x="142" y="130" width="16" height="30" />
          <text x="170" y="150" fontSize="12" stroke="none" fill="#000">F1</text>

          {/* FT1 - NF (95-96) */}
          <line x1="140" y1="180" x2="160" y2="180" />
          <line x1="140" y1="210" x2="160" y2="210" />
          <line x1="150" y1="180" x2="150" y2="210" />
          <line x1="142" y1="212" x2="158" y2="178" />
          <text x="170" y="200" fontSize="12" stroke="none" fill="#000">FT1</text>

          {/* S0 - NF */}
          <line x1="140" y1="230" x2="160" y2="230" />
          <line x1="140" y1="260" x2="160" y2="260" />
          <line x1="150" y1="230" x2="150" y2="260" />
          <line x1="142" y1="262" x2="158" y2="228" />
          <text x="170" y="250" fontSize="12" stroke="none" fill="#000">S0</text>

          {/* NÓ DE DERIVAÇÃO DO SELO */}
          <circle cx="150" cy="280" r="3" fill="#000" />
          
          {/* Circuito de Retenção (KM1) em paralelo com S1 */}
          <line x1="150" y1="280" x2="220" y2="280" />
          <line x1="220" y1="280" x2="220" y2="300" />
          {/* KM1 NA (Selo) */}
          <line x1="210" y1="300" x2="230" y2="300" />
          <line x1="210" y1="330" x2="230" y2="330" />
          <line x1="220" y1="300" x2="220" y2="330" />
          <text x="240" y="320" fontSize="12" stroke="none" fill="#000">KM1</text>
          <line x1="220" y1="330" x2="220" y2="350" />
          <line x1="220" y1="350" x2="150" y2="350" />
          <circle cx="150" cy="350" r="3" fill="#000" />

          {/* S1 - NA (Inserido no ramo principal entre os nós do selo) */}
          <line x1="140" y1="300" x2="160" y2="300" />
          <line x1="140" y1="330" x2="160" y2="330" />
          <line x1="150" y1="300" x2="150" y2="330" />
          <text x="170" y="320" fontSize="12" stroke="none" fill="#000">S1</text>

          {/* KM1 - Bobina */}
          <rect x="130" y="410" width="40" height="25" />
          <text x="180" y="428" fontSize="12" stroke="none" fill="#000">KM1</text>
          <text x="110" y="415" fontSize="10" stroke="none" fill="#000">A1</text>
          <text x="110" y="440" fontSize="10" stroke="none" fill="#000">A2</text>

          {/* N */}
          <line x1="150" y1="435" x2="150" y2="480" />
          <text x="135" y="495" fontSize="12" stroke="none" fill="#000">N</text>
        </g>

        {/* --- 2. CIRCUITO DE POTÊNCIA --- */}
        <g stroke="#000000" strokeWidth="2" fill="none">
          <text x="300" y="30" fontSize="16" fontWeight="bold" stroke="none" fill="#000">POTÊNCIA</text>
          
          {[320, 360, 400].map((x, i) => (
            <g key={i}>
              <text x={x - 5} y="55" fontSize="12" stroke="none" fill="#000">{`L${i + 1}`}</text>
              <line x1={x} y1="60" x2={x} y2="480" />
              
              {/* Q1 */}
              <rect x={x - 8} y="80" width="16" height="20" />
              {/* KM1 */}
              <line x1={x - 6} y1="130" x2={x + 6} y2="130" />
              <line x1={x - 6} y1="145" x2={x + 6} y2="145" />
              {/* FT1 */}
              <rect x={x - 10} y="180" width="20" height="15" />
            </g>
          ))}
          
          {/* Motor */}
          <circle cx="360" cy="440" r="25" fill="#fff" />
          <text x="360" y="445" textAnchor="middle" fontSize="14" fontWeight="bold" stroke="none" fill="#000">M1</text>
          <text x="360" y="458" textAnchor="middle" fontSize="10" stroke="none" fill="#000">3~</text>
          
          <line x1="320" y1="415" x2="338" y2="430" />
          <line x1="360" y1="415" x2="360" y2="400" />
          <line x1="400" y1="415" x2="382" y2="430" />
        </g>
      </svg>
    </div>
  );
};