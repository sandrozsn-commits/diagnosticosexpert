import React from 'react';
import {
  NormallyOpenContact,
  NormallyClosedContact,
  ContactorCoil,
  MainContact,
  Fuse,
  ThermalContact,
  Motor3Phase,
  ProtectionDevice,
  Wire,
  Node
} from './electrical-symbols';

export const DirectStartDiagram: React.FC = () => {
  return (
    <div className="w-full bg-white p-4 border rounded-lg shadow-sm overflow-x-auto">
      <svg 
        viewBox="0 0 800 600" 
        className="w-full h-auto text-slate-900"
        style={{ minWidth: '600px' }}
      >
        {/* Background Grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.5" fill="#e2e8f0" />
          </pattern>
        </defs>
        <rect width="800" height="600" fill="url(#grid)" />

        {/* --- CIRCUITO DE COMANDO --- */}
        <text x="50" y="30" fontSize="14" fontWeight="bold" className="fill-slate-500 uppercase">1. Circuito de Comando (220 V~)</text>
        
        {/* Rails */}
        <text x="40" y="65" fontSize="12" className="fill-slate-400">L1</text>
        <Wire x1={60} y1={60} x2={300} y2={60} />
        
        <text x="40" y="545" fontSize="12" className="fill-slate-400">N</text>
        <Wire x1={60} y1={540} x2={300} y2={540} />

        {/* Main Branch */}
        <Node x={100} y={60} />
        <Wire x1={100} y1={60} x2={100} y2={80} />
        <ProtectionDevice x={100} y={100} label="Q1" />
        
        <Wire x1={100} y1={120} x2={100} y2={140} />
        <Fuse x={100} y={160} label="F1" />
        
        <Wire x1={100} y1={180} x2={100} y2={200} />
        <ThermalContact x={100} y={220} label="FT1" terminals={["95", "96"]} />
        
        <Wire x1={100} y1={240} x2={100} y2={260} />
        <NormallyClosedContact x={100} y={280} label="S0 (PARADA)" terminals={["11", "12"]} />
        
        <Wire x1={100} y1={300} x2={100} y2={320} />
        
        {/* Parallel S1 and KM1 Seal */}
        <Node x={100} y={320} />
        <Wire x1={100} y1={320} x2={160} y2={320} />
        <Wire x1={160} y1={320} x2={160} y2={340} />
        <NormallyOpenContact x={160} y={360} label="KM1" terminals={["13", "14"]} />
        <Wire x1={160} y1={380} x2={160} y2={400} />
        <Wire x1={160} y1={400} x2={100} y2={400} />
        <Node x={100} y={400} />
        
        <NormallyOpenContact x={100} y={360} label="S1 (PARTIDA)" terminals={["13", "14"]} />
        
        <Wire x1={100} y1={380} x2={100} y2={460} />
        <ContactorCoil x={100} y={480} label="KM1" terminals={["A1", "A2"]} />
        
        <Wire x1={100} y1={500} x2={100} y2={540} />
        <Node x={100} y={540} />

        {/* --- CIRCUITO DE POTÊNCIA --- */}
        <text x="450" y="30" fontSize="14" fontWeight="bold" className="fill-slate-500 uppercase">2. Circuito de Potência</text>
        
        {/* Phases */}
        <text x="480" y="50" fontSize="10" className="fill-slate-400">L1</text>
        <text x="520" y="50" fontSize="10" className="fill-slate-400">L2</text>
        <text x="560" y="50" fontSize="10" className="fill-slate-400">L3</text>
        
        {/* Potencia Lines */}
        {/* L1 */}
        <Wire x1={480} y1={60} x2={480} y2={80} />
        <ProtectionDevice x={480} y={100} label="Q1" />
        <Wire x1={480} y1={120} x2={480} y2={200} />
        <MainContact x={480} y={220} label="KM1" />
        <Wire x1={480} y1={240} x2={480} y2={320} />
        <MainContact x={480} y={340} label="FT1" />
        <Wire x1={480} y1={360} x2={520} y2={440} />

        {/* L2 */}
        <Wire x1={520} y1={60} x2={520} y2={80} />
        <ProtectionDevice x={520} y={100} />
        <Wire x1={520} y1={120} x2={520} y2={200} />
        <MainContact x={520} y={220} />
        <Wire x1={520} y1={240} x2={520} y2={320} />
        <MainContact x={520} y={340} />
        <Wire x1={520} y1={360} x2={520} y2={440} />

        {/* L3 */}
        <Wire x1={560} y1={60} x2={560} y2={80} />
        <ProtectionDevice x={560} y={100} />
        <Wire x1={560} y1={120} x2={560} y2={200} />
        <MainContact x={560} y={220} />
        <Wire x1={560} y1={240} x2={560} y2={320} />
        <MainContact x={560} y={340} />
        <Wire x1={560} y1={360} x2={520} y2={440} />

        {/* Motor */}
        <Motor3Phase x={520} y={480} label="M1" />

        {/* Legend */}
        <g transform="translate(450, 480)">
          <text x={0} y={0} fontSize="10" fontWeight="bold" className="fill-slate-500">LEGENDA:</text>
          <text x={0} y={15} fontSize="9" className="fill-slate-400">Q1: Disjuntor Geral</text>
          <text x={0} y={27} fontSize="9" className="fill-slate-400">F1: Fusível de Comando</text>
          <text x={0} y={39} fontSize="9" className="fill-slate-400">KM1: Contator de Potência</text>
          <text x={0} y={51} fontSize="9" className="fill-slate-400">FT1: Relé Térmico</text>
          <text x={0} y={63} fontSize="9" className="fill-slate-400">S0/S1: Botoeiras Desliga/Liga</text>
          <text x={0} y={75} fontSize="9" className="fill-slate-400">M1: Motor Trifásico</text>
        </g>
      </svg>
      <div className="mt-2 text-[10px] text-muted-foreground italic text-center">
        Representação baseada em simbologia IEC 60617 / prática ABNT-IEC.
      </div>
    </div>
  );
};
