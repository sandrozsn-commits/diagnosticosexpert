import React from 'react';
import {
  NormallyOpenContact,
  NormallyClosedContact,
  Fuse,
  BreakerSinglePole,
  ContactorCoil,
  BreakerThreePole,
  ThreePoleContactor,
  ThermalRelay3P,
  Motor3Phase,
  Wire,
  Junction,
} from './ElectricalSymbols';

/**
 * Componente de Diagrama Elétrico: Partida Direta com Selo
 * Reprodução fiel da referência visual utilizando a biblioteca de símbolos.
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
        <g stroke="#111827" strokeWidth="2">
          {/* Barramentos e Identificação */}
          <text x="70" y="85" fontSize="22" fontWeight="bold" fill="#111827">L1</text>
          <Wire x1="100" y1="80" x2="600" y2="80" />
          
          <text x="70" y="855" fontSize="22" fontWeight="bold" fill="#111827">N</text>
          <Wire x1="100" y1="850" x2="400" y2="850" />

          {/* Q2 - Disjuntor monopolar */}
          <BreakerSinglePole x={200} y={150} label="Q2" />
          <Wire x1={200} y1={80} x2={200} y2={115} />

          {/* F2 - Fusível */}
          <Fuse x={200} y={260} label="F2" />
          <text x={230} y={285} fontSize="14" fill="#111827">1A</text>
          <Wire x1={200} y1={185} x2={200} y2={225} />

          {/* FT1 - Relé térmico (NF 95-96) */}
          <NormallyClosedContact x={170} y={370} label="FT1" labelPosition="right" />
          <text x={160} y={350} fontSize="12" fill="#111827">95</text>
          <text x={220} y={395} fontSize="12" fill="#111827">96</text>
          <Wire x1={200} y1={295} x2={200} y2={340} />
          
          {/* S0 - Botão de parada (NF) */}
          <NormallyClosedContact x={200} y={480} label="S0" />
          <text x={190} y={460} fontSize="12" fill="#111827">11</text>
          <text x={250} y={505} fontSize="12" fill="#111827">12</text>
          <Wire x1={230} y1={400} x2={230} y2={450} />
          <Wire x1={230} y1={450} x2={200} y2={450} />

          {/* DERIVAÇÃO DO SELO */}
          <Junction x={260} y={550} />
          <Wire x1={260} y1={510} x2={260} y2={550} />
          
          {/* S1 - Botão de partida (NA) */}
          <NormallyOpenContact x={230} y={620} label="S1" />
          <text x={220} y={600} fontSize="12" fill="#111827">13</text>
          <text x={280} y={645} fontSize="12" fill="#111827">14</text>
          <Wire x1={260} y1={550} x2={260} y2={590} />

          {/* KM1 - Contato auxiliar NA (Selo) */}
          <NormallyOpenContact x={370} y={620} label="KM1" />
          <text x={360} y={600} fontSize="12" fill="#111827">13</text>
          <text x={420} y={645} fontSize="12" fill="#111827">14</text>
          <Wire x1={260} y1={550} x2={400} y2={550} />
          <Wire x1={400} y1={550} x2={400} y2={590} />

          {/* Fechamento do selo */}
          <Wire x1={290} y1={650} x2={290} y2={690} />
          <Wire x1={430} y1={650} x2={430} y2={690} />
          <Wire x1={430} y1={690} x2={290} y2={690} />
          <Junction x={290} y={690} />

          {/* Bobina KM1 */}
          <ContactorCoil x={290} y={770} label="KM1" />
          <Wire x1={290} y1={690} x2={290} y2={730} />
          <Wire x1={290} y1={810} x2={290} y2={850} />
        </g>

        {/* ========================================================
            2. CIRCUITO DE POTÊNCIA
            ======================================================== */}
        <g stroke="#111827" strokeWidth={2}>
          {/* Fases L1, L2, L3 */}
          <text x={800} y={60} fontSize="22" fontWeight="bold" fill="#111827">L1</text>
          <text x={950} y={60} fontSize="22" fontWeight="bold" fill="#111827">L2</text>
          <text x={1100} y={60} fontSize="22" fontWeight="bold" fill="#111827">L3</text>

          {/* Q1 - Disjuntor Tripolar */}
          <BreakerThreePole x={800} y={150} label="Q1" />
          {[800, 950, 1100].map(x => (
             <Wire key={x} x1={x} y1={70} x2={x} y2={112} />
          ))}

          {/* F1 - Fusíveis */}
          {[800, 950, 1100].map(x => (
            <Fuse key={x} x={x} y={260} />
          ))}
          <text x={1220} y={265} fontSize={18} fontWeight="bold" fill="#111827">F1</text>
          {[800, 950, 1100].map(x => (
             <Wire key={x} x1={x} y1={188} x2={x} y2={225} />
          ))}

          {/* KM1 - Contator Tripolar */}
          <ThreePoleContactor x={800} y={380} label="KM1" />
          {[800, 950, 1100].map(x => (
             <Wire key={x} x1={x} y1={295} x2={x} y2={342} />
          ))}

          {/* FT1 - Relé Térmico */}
          <ThermalRelay3P x={800} y={520} label="FT1" />
          {[800, 950, 1100].map(x => (
             <Wire key={x} x1={x} y1={418} x2={x} y2={485} />
          ))}

          {/* Motor Trifásico M1 */}
          <Motor3Phase x={950} y={750} label="M1" />
          <Wire x1={800} y1={555} x2={800} y2={650} />
          <Wire x1={950} y1={555} x2={950} y2={695} />
          <Wire x1={1100} y1={555} x2={1100} y2={650} />
          <Wire x1={800} y1={650} x2={898} y2={710} />
          <Wire x1={1100} y1={650} x2={1002} y2={710} />


          {/* Legendas de Bloco */}
          <g transform="translate(50, 920)">
            <rect x="0" y="0" width="600" height="60" rx="4" fill="none" stroke="#111827" />
            <text x="300" y="40" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#111827">1. CIRCUITO DE COMANDO (220 V~)</text>
          </g>
          
          <g transform="translate(750, 920)">
            <rect x="0" y="0" width="600" height="60" rx="4" fill="none" stroke="#111827" />
            <text x="300" y="40" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#111827">2. CIRCUITO DE POTÊNCIA</text>
          </g>
        </g>
      </svg>
    </div>
  );
};
