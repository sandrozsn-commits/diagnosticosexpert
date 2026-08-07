import React from 'react';

interface SymbolProps {
  x: number;
  y: number;
  label?: string;
  terminals?: [string, string];
}

export const NormallyOpenContact: React.FC<SymbolProps> = ({ x, y, label, terminals }) => (
  <g className="electrical-symbol">
    <line x1={x} y1={y - 20} x2={x} y2={y - 8} stroke="currentColor" strokeWidth="1.5" />
    <line x1={x} y1={y + 8} x2={x} y2={y + 20} stroke="currentColor" strokeWidth="1.5" />
    <line x1={x - 6} y1={y - 8} x2={x + 6} y2={y - 8} stroke="currentColor" strokeWidth="1.5" />
    <line x1={x - 6} y1={y + 8} x2={x + 6} y2={y + 8} stroke="currentColor" strokeWidth="1.5" />
    {label && <text x={x - 12} y={y} textAnchor="end" fontSize="10" className="fill-muted-foreground">{label}</text>}
    {terminals && (
      <>
        <text x={x + 8} y={y - 12} fontSize="8" className="fill-muted-foreground">{terminals[0]}</text>
        <text x={x + 8} y={y + 16} fontSize="8" className="fill-muted-foreground">{terminals[1]}</text>
      </>
    )}
  </g>
);

export const NormallyClosedContact: React.FC<SymbolProps> = ({ x, y, label, terminals }) => (
  <g className="electrical-symbol">
    <line x1={x} y1={y - 20} x2={x} y2={y - 8} stroke="currentColor" strokeWidth="1.5" />
    <line x1={x} y1={y + 8} x2={x} y2={y + 20} stroke="currentColor" strokeWidth="1.5" />
    <line x1={x - 6} y1={y - 8} x2={x + 6} y2={y - 8} stroke="currentColor" strokeWidth="1.5" />
    <line x1={x - 6} y1={y + 8} x2={x + 6} y2={y + 8} stroke="currentColor" strokeWidth="1.5" />
    <line x1={x - 8} y1={y + 5} x2={x + 8} y2={y - 5} stroke="currentColor" strokeWidth="1.5" />
    {label && <text x={x - 12} y={y} textAnchor="end" fontSize="10" className="fill-muted-foreground">{label}</text>}
    {terminals && (
      <>
        <text x={x + 8} y={y - 12} fontSize="8" className="fill-muted-foreground">{terminals[0]}</text>
        <text x={x + 8} y={y + 16} fontSize="8" className="fill-muted-foreground">{terminals[1]}</text>
      </>
    )}
  </g>
);

export const ContactorCoil: React.FC<SymbolProps> = ({ x, y, label, terminals }) => (
  <g className="electrical-symbol">
    <line x1={x} y1={y - 20} x2={x} y2={y - 10} stroke="currentColor" strokeWidth="1.5" />
    <line x1={x} y1={y + 10} x2={x} y2={y + 20} stroke="currentColor" strokeWidth="1.5" />
    <rect x={x - 12} y={y - 10} width="24" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
    {label && <text x={x - 15} y={y + 4} textAnchor="end" fontSize="10" className="fill-muted-foreground">{label}</text>}
    {terminals && (
      <>
        <text x={x + 14} y={y - 4} fontSize="8" className="fill-muted-foreground">{terminals[0]}</text>
        <text x={x + 14} y={y + 10} fontSize="8" className="fill-muted-foreground">{terminals[1]}</text>
      </>
    )}
  </g>
);

export const Fuse: React.FC<SymbolProps> = ({ x, y, label, terminals }) => (
  <g className="electrical-symbol">
    <line x1={x} y1={y - 20} x2={x} y2={y - 10} stroke="currentColor" strokeWidth="1.5" />
    <line x1={x} y1={y + 10} x2={x} y2={y + 20} stroke="currentColor" strokeWidth="1.5" />
    <rect x={x - 6} y={y - 10} width="12" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <line x1={x} y1={y - 10} x2={x} y2={y + 10} stroke="currentColor" strokeWidth="1.5" />
    {label && <text x={x - 12} y={y + 4} textAnchor="end" fontSize="10" className="fill-muted-foreground">{label}</text>}
  </g>
);

export const ProtectionDevice: React.FC<SymbolProps> = ({ x, y, label }) => (
  <g className="electrical-symbol">
    <line x1={x} y1={y - 20} x2={x} y2={y - 8} stroke="currentColor" strokeWidth="1.5" />
    <line x1={x} y1={y + 8} x2={x} y2={y + 20} stroke="currentColor" strokeWidth="1.5" />
    <line x1={x - 6} y1={y - 8} x2={x + 6} y2={y - 8} stroke="currentColor" strokeWidth="1.5" />
    <line x1={x - 6} y1={y + 8} x2={x + 6} y2={y + 8} stroke="currentColor" strokeWidth="1.5" />
    <path d={`M${x - 8} ${y - 10} l4 4 l-4 4`} fill="none" stroke="currentColor" strokeWidth="1.5" />
    {label && <text x={x - 12} y={y + 4} textAnchor="end" fontSize="10" className="fill-muted-foreground">{label}</text>}
  </g>
);

export const ThermalContact: React.FC<SymbolProps> = ({ x, y, label, terminals }) => (
  <g className="electrical-symbol">
    <line x1={x} y1={y - 20} x2={x} y2={y - 8} stroke="currentColor" strokeWidth="1.5" />
    <line x1={x} y1={y + 8} x2={x} y2={y + 20} stroke="currentColor" strokeWidth="1.5" />
    <line x1={x - 6} y1={y - 8} x2={x + 6} y2={y - 8} stroke="currentColor" strokeWidth="1.5" />
    <line x1={x - 6} y1={y + 8} x2={x + 6} y2={y + 8} stroke="currentColor" strokeWidth="1.5" />
    <line x1={x - 8} y1={y + 5} x2={x + 8} y2={y - 5} stroke="currentColor" strokeWidth="1.5" />
    {label && <text x={x - 12} y={y} textAnchor="end" fontSize="10" className="fill-muted-foreground">{label}</text>}
    {terminals && (
      <>
        <text x={x + 8} y={y - 12} fontSize="8" className="fill-muted-foreground">{terminals[0]}</text>
        <text x={x + 8} y={y + 16} fontSize="8" className="fill-muted-foreground">{terminals[1]}</text>
      </>
    )}
  </g>
);

export const MainContact: React.FC<SymbolProps> = ({ x, y, label }) => (
  <g className="electrical-symbol">
    <line x1={x} y1={y - 20} x2={x} y2={y - 8} stroke="currentColor" strokeWidth="1.5" />
    <line x1={x} y1={y + 8} x2={x} y2={y + 20} stroke="currentColor" strokeWidth="1.5" />
    <line x1={x - 6} y1={y - 8} x2={x + 6} y2={y - 8} stroke="currentColor" strokeWidth="1.5" />
    <line x1={x - 6} y1={y + 8} x2={x + 6} y2={y + 8} stroke="currentColor" strokeWidth="1.5" />
    {label && <text x={x - 12} y={y + 4} textAnchor="end" fontSize="10" className="fill-muted-foreground">{label}</text>}
  </g>
);

export const Motor3Phase: React.FC<SymbolProps> = ({ x, y, label }) => (
  <g className="electrical-symbol">
    <circle cx={x} cy={y} r="18" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <text x={x} y={y - 2} textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-current">M</text>
    <text x={x} y={y + 8} textAnchor="middle" fontSize="8" className="fill-current">3~</text>
    {label && <text x={x} y={y + 30} textAnchor="middle" fontSize="10" className="fill-muted-foreground">{label}</text>}
  </g>
);

export const Wire: React.FC<{ x1: number; y1: number; x2: number; y2: number }> = ({ x1, y1, x2, y2 }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.5" />
);

export const Node: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <circle cx={x} cy={y} r="2" fill="currentColor" />
);
