import React from 'react';

/**
 * Componente de Diagrama Elétrico: Partida Direta com Selo
 * Reprodução fiel da referência visual fornecida (SVG Nativo).
 * Estilo CAD industrial, sem ícones Lucide.
 */
export const DirectStartDiagram = () => {
  return (
    <div className="w-full bg-white p-6 border border-border rounded-lg shadow-sm flex justify-center overflow-auto">
      <svg
        viewBox="0 0 1450 1000"
        width="1450"
        height="1000"
        className="min-w-[800px] h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="1450" height="1000" fill="#ffffff" />

        {/* ========================================================
            1. CIRCUITO DE COMANDO (220 V~)
            ======================================================== */}
        <g stroke="#000000" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Barramento Superior L1 */}
          <line x1="100" y1="80" x2="600" y2="80" />
          <text x="70" y="85" fontSize="22" fontWeight="bold" stroke="none" fill="#000">L1</text>
          
          {/* Condutor vertical principal do comando */}
          <line x1="200" y1="80" x2="200" y2="850" />
          
          {/* Q2 - Disjuntor monopolar */}
          <g transform="translate(200, 130)">
            <line x1="0" y1="0" x2="0" y2="20" />
            <line x1="0" y1="20" x2="15" y2="50" /> {/* Lâmina inclinada */}
            <circle cx="0" cy="20" r="2" fill="#000" stroke="none" />
            <line x1="-8" y1="50" x2="8" y2="50" strokeWidth="2" /> {/* Símbolo de proteção */}
            <line x1="0" y1="50" x2="0" y2="70" />
          </g>
          <text x="230" y="170" fontSize="20" fontWeight="bold" stroke="none" fill="#000">Q2</text>

          {/* F2 - Fusível */}
          <g transform="translate(185, 230)">
            <rect x="0" y="0" width="30" height="60" />
            <line x1="15" y1="-10" x2="15" y2="70" /> {/* Linha passa por dentro */}
          </g>
          <text x="230" y="260" fontSize="20" fontWeight="bold" stroke="none" fill="#000">F2</text>
          <text x="230" y="285" fontSize="18" stroke="none" fill="#000">1A</text>

          {/* FT1 - Relé térmico (NF 95-96) */}
          <g transform="translate(200, 330)">
            <line x1="0" y1="0" x2="0" y2="15" />
            <line x1="0" y1="15" x2="20" y2="55" /> {/* Lâmina diagonal NF */}
            <line x1="0" y1="55" x2="0" y2="70" />
            {/* O "NF" encosta no terminal superior */}
            <line x1="-5" y1="15" x2="5" y2="15" /> 
            <circle cx="0" cy="15" r="3" fill="#000" stroke="none" />
          </g>
          <text x="230" y="370" fontSize="20" fontWeight="bold" stroke="none" fill="#000">FT1</text>
          <text x="230" y="345" fontSize="16" stroke="none" fill="#000">95</text>
          <text x="230" y="405" fontSize="16" stroke="none" fill="#000">96</text>

          {/* S0 - Botão de parada (NF) */}
          <g transform="translate(200, 440)">
            <line x1="0" y1="0" x2="0" y2="15" />
            <line x1="0" y1="15" x2="20" y2="55" /> {/* Lâmina diagonal NF */}
            <line x1="0" y1="55" x2="0" y2="70" />
            <line x1="-15" y1="15" x2="15" y2="15" /> {/* Atuador do botão */}
            <line x1="0" y1="5" x2="0" y2="15" />
          </g>
          <text x="230" y="480" fontSize="20" fontWeight="bold" stroke="none" fill="#000">S0</text>
          <text x="230" y="455" fontSize="16" stroke="none" fill="#000">11</text>
          <text x="230" y="515" fontSize="16" stroke="none" fill="#000">12</text>

          {/* DERIVAÇÃO DO SELO */}
          {/* Nó superior do selo */}
          <circle cx="200" cy="550" r="5" fill="#000" />
          <line x1="200" y1="550" x2="350" y2="550" />
          <line x1="350" y1="550" x2="350" y2="580" />

          {/* S1 - Botão de partida (NA) */}
          <g transform="translate(200, 580)">
            <line x1="0" y1="0" x2="0" y2="15" />
            <line x1="10" y1="15" x2="25" y2="55" /> {/* Lâmina NA (afastada) */}
            <line x1="0" y1="55" x2="0" y2="70" />
            <line x1="-15" y1="15" x2="15" y2="15" /> {/* Atuador */}
          </g>
          <text x="230" y="620" fontSize="20" fontWeight="bold" stroke="none" fill="#000">S1</text>
          <text x="230" y="595" fontSize="16" stroke="none" fill="#000">13</text>
          <text x="230" y="655" fontSize="16" stroke="none" fill="#000">14</text>

          {/* KM1 - Contato auxiliar NA (Selo) */}
          <g transform="translate(350, 580)">
            <line x1="0" y1="0" x2="0" y2="15" />
            <line x1="10" y1="15" x2="25" y2="55" /> {/* Mesma linguagem de S1 NA */}
            <line x1="0" y1="55" x2="0" y2="70" />
          </g>
          <text x="380" y="620" fontSize="20" fontWeight="bold" stroke="none" fill="#000">KM1</text>
          <text x="380" y="595" fontSize="16" stroke="none" fill="#000">13</text>
          <text x="380" y="655" fontSize="16" stroke="none" fill="#000">14</text>

          {/* Fechamento do selo */}
          <line x1="350" y1="650" x2="350" y2="680" />
          <line x1="350" y1="680" x2="200" y2="680" />
          <circle cx="200" cy="680" r="5" fill="#000" />

          {/* Bobina KM1 */}
          <g transform="translate(160, 740)">
            <rect x="0" y="0" width="80" height="50" />
            <line x1="40" y1="-60" x2="40" y2="0" />
            <line x1="40" y1="50" x2="40" y2="110" />
          </g>
          <text x="260" y="775" fontSize="20" fontWeight="bold" stroke="none" fill="#000">KM1</text>
          <text x="130" y="755" fontSize="16" stroke="none" fill="#000">A1</text>
          <text x="130" y="795" fontSize="16" stroke="none" fill="#000">A2</text>

          {/* Barramento Inferior N */}
          <line x1="100" y1="850" x2="400" y2="850" />
          <text x="70" y="855" fontSize="22" fontWeight="bold" stroke="none" fill="#000">N</text>
        </g>

        {/* ========================================================
            2. CIRCUITO DE POTÊNCIA
            ======================================================== */}
        <g stroke="#000000" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Fases L1, L2, L3 */}
          <text x="800" y="60" fontSize="22" fontWeight="bold" stroke="none" fill="#000">L1</text>
          <text x="950" y="60" fontSize="22" fontWeight="bold" stroke="none" fill="#000">L2</text>
          <text x="1100" y="60" fontSize="22" fontWeight="bold" stroke="none" fill="#000">L3</text>

          {[800, 950, 1100].map((x, i) => (
            <g key={i}>
              <line x1={x} y1="70" x2={x} y2="850" />
              
              {/* Q1 - Disjuntor Tripolar */}
              <g transform={`translate(${x}, 120)`}>
                <line x1="0" y1="0" x2="0" y2="15" />
                <line x1="0" y1="15" x2="15" y2="45" /> {/* Lâmina inclinada */}
                <circle cx="0" cy="15" r="2" fill="#000" stroke="none" />
                <line x1="-8" y1="45" x2="8" y2="45" strokeWidth="2" /> {/* Símbolo proteção */}
              </g>

              {/* F1 - Fusíveis */}
              <g transform={`translate(${x - 12}, 220)`}>
                <rect x="0" y="0" width="24" height="60" />
                <line x1="12" y1="-10" x2="12" y2="70" />
              </g>

              {/* KM1 - Contatos de Potência */}
              <g transform={`translate(${x}, 350)`}>
                <line x1="0" y1="0" x2="0" y2="15" />
                <line x1="0" y1="15" x2="15" y2="45" /> {/* Lâmina inclinada */}
                <circle cx="0" cy="15" r="2" fill="#000" stroke="none" />
              </g>

              {/* FT1 - Elementos térmicos */}
              <g transform={`translate(${x}, 480)`}>
                <line x1="0" y1="0" x2="0" y2="15" />
                {/* Símbolo térmico 'gancho' */}
                <path d="M -10 15 L 0 15 L 0 45 L 10 45" />
                <line x1="0" y1="45" x2="0" y2="60" />
              </g>
            </g>
          ))}

          {/* Acoplamentos Mecânicos (Tracejados) */}
          <line x1="800" y1="135" x2="1100" y2="135" strokeDasharray="6,4" strokeWidth="2" /> {/* Q1 */}
          <line x1="800" y1="365" x2="1100" y2="365" strokeDasharray="6,4" strokeWidth="2" /> {/* KM1 */}
          <line x1="800" y1="510" x2="1100" y2="510" strokeDasharray="6,4" strokeWidth="2" /> {/* FT1 */}

          <text x="1150" y="150" fontSize="20" fontWeight="bold" stroke="none" fill="#000">Q1</text>
          <text x="1150" y="260" fontSize="20" fontWeight="bold" stroke="none" fill="#000">F1</text>
          <text x="1150" y="380" fontSize="20" fontWeight="bold" stroke="none" fill="#000">KM1</text>
          <text x="1150" y="515" fontSize="20" fontWeight="bold" stroke="none" fill="#000">FT1</text>

          {/* Motor Trifásico M1 */}
          <g transform="translate(950, 700)">
            <circle cx="0" cy="0" r="70" strokeWidth="4" />
            <text x="0" y="10" textAnchor="middle" fontSize="48" fontWeight="bold" stroke="none" fill="#000">M</text>
            <text x="0" y="45" textAnchor="middle" fontSize="22" fontWeight="bold" stroke="none" fill="#000">3~</text>
            
            {/* Conexões do motor */}
            <line x1="-150" y1="-100" x2="-55" y2="-45" />
            <line x1="0" y1="-100" x2="0" y2="-70" />
            <line x1="150" y1="-100" x2="55" y2="-45" />
          </g>
          <text x="1040" y="710" fontSize="22" fontWeight="bold" stroke="none" fill="#000">M1</text>
        </g>

        {/* Legendas de Bloco (Rodapé do SVG) */}
        <g transform="translate(50, 920)">
          <rect x="0" y="0" width="600" height="60" rx="4" stroke="#000" strokeWidth="2" />
          <text x="300" y="40" textAnchor="middle" fontSize="22" fontWeight="bold" stroke="none" fill="#000">1. CIRCUITO DE COMANDO (220 V~)</text>
        </g>
        
        <g transform="translate(750, 920)">
          <rect x="0" y="0" width="600" height="60" rx="4" stroke="#000" strokeWidth="2" />
          <text x="300" y="40" textAnchor="middle" fontSize="22" fontWeight="bold" stroke="none" fill="#000">2. CIRCUITO DE POTÊNCIA</text>
        </g>
      </svg>
    </div>
  );
};