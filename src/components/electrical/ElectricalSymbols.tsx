import React from "react";

export type SymbolProps = {
  x?: number;
  y?: number;
  scale?: number;
  stroke?: string;
  strokeWidth?: number;
  label?: string;
  labelPosition?: "left" | "right" | "top" | "bottom";
};

const DEFAULT_STROKE = "#111827";
const DEFAULT_WIDTH = 2;

function Label({
  text,
  x,
  y,
  position = "right",
  size = 14,
  stroke = DEFAULT_STROKE,
}: {
  text?: string;
  x: number;
  y: number;
  position?: "left" | "right" | "top" | "bottom";
  size?: number;
  stroke?: string;
}) {
  if (!text) return null;

  let tx = x;
  let ty = y;
  let anchor: "start" | "middle" | "end" = "start";

  if (position === "left") {
    tx = x - 12;
    anchor = "end";
  }

  if (position === "right") {
    tx = x + 12;
    anchor = "start";
  }

  if (position === "top") {
    ty = y - 12;
    anchor = "middle";
  }

  if (position === "bottom") {
    ty = y + 24;
    anchor = "middle";
  }

  return (
    <text
      x={tx}
      y={ty}
      textAnchor={anchor}
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize={size}
      fill={stroke}
      stroke="none"
    >
      {text}
    </text>
  );
}

/* ============================================================
   CONTATO NORMALMENTE ABERTO
   Referência: S1 / KM1 auxiliar 13-14
   ============================================================ */

export function NormallyOpenContact({
  x = 0,
  y = 0,
  scale = 1,
  stroke = DEFAULT_STROKE,
  strokeWidth = DEFAULT_WIDTH,
  label,
  labelPosition = "right",
}: SymbolProps) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="square"
    >
      {/* terminal superior */}
      <line x1="0" y1="-30" x2="0" y2="-8" />

      {/* lâmina esquerda */}
      <line x1="0" y1="-8" x2="18" y2="-8" />

      {/* abertura do contato */}
      <line x1="42" y1="8" x2="60" y2="8" />

      {/* terminal inferior */}
      <line x1="60" y1="8" x2="60" y2="30" />

      <Label
        text={label}
        x={60}
        y={2}
        position={labelPosition}
        stroke={stroke}
      />
    </g>
  );
}

/* ============================================================
   CONTATO NORMALMENTE FECHADO
   Referência: FT1 95-96 / S0 11-12
   ============================================================ */

export function NormallyClosedContact({
  x = 0,
  y = 0,
  scale = 1,
  stroke = DEFAULT_STROKE,
  strokeWidth = DEFAULT_WIDTH,
  label,
  labelPosition = "right",
}: SymbolProps) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="square"
    >
      {/* terminal superior */}
      <line x1="0" y1="-30" x2="0" y2="-8" />

      {/* contato */}
      <line x1="0" y1="-8" x2="18" y2="-8" />
      <line x1="42" y1="8" x2="60" y2="8" />

      {/* lâmina diagonal característica do NF */}
      <line x1="18" y1="8" x2="42" y2="-8" />

      {/* terminal inferior */}
      <line x1="60" y1="8" x2="60" y2="30" />

      <Label
        text={label}
        x={60}
        y={2}
        position={labelPosition}
        stroke={stroke}
      />
    </g>
  );
}

/* ============================================================
   FUSÍVEL
   Referência: F1 / F2
   ============================================================ */

export function Fuse({
  x = 0,
  y = 0,
  scale = 1,
  stroke = DEFAULT_STROKE,
  strokeWidth = DEFAULT_WIDTH,
  label,
  labelPosition = "right",
}: SymbolProps) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="white"
    >
      <line x1="0" y1="-35" x2="0" y2="-12" />

      <rect x="-7" y="-12" width="14" height="24" />

      <line x1="0" y1="12" x2="0" y2="35" />

      <Label
        text={label}
        x={8}
        y={4}
        position={labelPosition}
        stroke={stroke}
      />
    </g>
  );
}

/* ============================================================
   DISJUNTOR MONOPOLAR
   Referência: Q2
   ============================================================ */

export function BreakerSinglePole({
  x = 0,
  y = 0,
  scale = 1,
  stroke = DEFAULT_STROKE,
  strokeWidth = DEFAULT_WIDTH,
  label,
  labelPosition = "right",
}: SymbolProps) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="square"
    >
      <line x1="0" y1="-35" x2="0" y2="-12" />

      {/* contato móvel */}
      <line x1="-7" y1="-8" x2="9" y2="-8" />
      <line x1="9" y1="-8" x2="-2" y2="10" />

      <line x1="0" y1="10" x2="0" y2="35" />

      <Label
        text={label}
        x={12}
        y={4}
        position={labelPosition}
        stroke={stroke}
      />
    </g>
  );
}

/* ============================================================
   CONTATO PRINCIPAL
   Referência: polos de Q1 e KM1
   ============================================================ */

export function MainContact({
  x = 0,
  y = 0,
  scale = 1,
  stroke = DEFAULT_STROKE,
  strokeWidth = DEFAULT_WIDTH,
}: SymbolProps) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="square"
    >
      <line x1="0" y1="-30" x2="0" y2="-8" />

      {/* lâmina móvel */}
      <line x1="0" y1="-8" x2="17" y2="8" />

      <line x1="17" y1="8" x2="17" y2="30" />
    </g>
  );
}

/* ============================================================
   BOBINA DO CONTATOR
   Referência: KM1 A1-A2
   ============================================================ */

export function ContactorCoil({
  x = 0,
  y = 0,
  scale = 1,
  stroke = DEFAULT_STROKE,
  strokeWidth = DEFAULT_WIDTH,
  label = "KM1",
  labelPosition = "left",
}: SymbolProps) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="white"
    >
      <line x1="0" y1="-40" x2="0" y2="-15" />

      <rect x="-17" y="-15" width="34" height="30" />

      <line x1="0" y1="15" x2="0" y2="40" />

      <Label
        text={label}
        x={-20}
        y={4}
        position={labelPosition}
        stroke={stroke}
      />

      <text
        x="-30"
        y="-20"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="10"
        fill={stroke}
        stroke="none"
        textAnchor="middle"
      >
        A1
      </text>

      <text
        x="-30"
        y="28"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="10"
        fill={stroke}
        stroke="none"
        textAnchor="middle"
      >
        A2
      </text>
    </g>
  );
}

/* ============================================================
   DISJUNTOR TRIPOLAR
   Referência: Q1
   ============================================================ */

export function BreakerThreePole({
  x = 0,
  y = 0,
  scale = 1,
  stroke = DEFAULT_STROKE,
  strokeWidth = DEFAULT_WIDTH,
  label = "Q1",
}: SymbolProps) {
  const positions = [0, 60, 120];

  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="square"
    >
      {positions.map((px) => (
        <g key={px}>
          <line x1={px} y1="-38" x2={px} y2="-10" />

          <line x1={px - 7} y1="-10" x2={px + 8} y2="-10" />

          <line
            x1={px + 8}
            y1="-10"
            x2={px - 3}
            y2="9"
          />

          <line x1={px} y1="9" x2={px} y2="38" />
        </g>
      ))}

      {/* acoplamento mecânico */}
      <line
        x1="0"
        y1="18"
        x2="120"
        y2="18"
        strokeDasharray="6 5"
      />

      <text
        x="140"
        y="5"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="14"
        fill={stroke}
        stroke="none"
      >
        {label}
      </text>
    </g>
  );
}

/* ============================================================
   CONTATOR TRIPOLAR
   Referência: KM1
   ============================================================ */

export function ThreePoleContactor({
  x = 0,
  y = 0,
  scale = 1,
  stroke = DEFAULT_STROKE,
  strokeWidth = DEFAULT_WIDTH,
  label = "KM1",
}: SymbolProps) {
  const positions = [0, 60, 120];

  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="square"
    >
      {positions.map((px) => (
        <g key={px}>
          <line x1={px} y1="-38" x2={px} y2="-8" />

          <line
            x1={px}
            y1="-8"
            x2={px + 17}
            y2="9"
          />

          <line x1={px + 17} y1="9" x2={px + 17} y2="38" />
        </g>
      ))}

      <line
        x1="0"
        y1="20"
        x2="120"
        y2="20"
        strokeDasharray="6 5"
      />

      <text
        x="140"
        y="5"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="14"
        fill={stroke}
        stroke="none"
      >
        {label}
      </text>
    </g>
  );
}

/* ============================================================
   RELÉ TÉRMICO TRIPOLAR
   Referência: FT1
   ============================================================ */

export function ThermalRelay3P({
  x = 0,
  y = 0,
  scale = 1,
  stroke = DEFAULT_STROKE,
  strokeWidth = DEFAULT_WIDTH,
  label = "FT1",
}: SymbolProps) {
  const positions = [0, 60, 120];

  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="square"
    >
      {positions.map((px) => (
        <g key={px}>
          <line x1={px} y1="-35" x2={px} y2="-10" />

          {/* elemento térmico em forma de elemento de proteção */}
          <path
            d={`
              M ${px - 9} -10
              L ${px + 9} -10
              L ${px + 9} 7
              L ${px - 9} 7
              L ${px - 9} 22
              L ${px + 9} 22
            `}
          />

          <line x1={px} y1="22" x2={px} y2="35" />
        </g>
      ))}

      <text
        x="140"
        y="5"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="14"
        fill={stroke}
        stroke="none"
      >
        {label}
      </text>
    </g>
  );
}

/* ============================================================
   MOTOR TRIFÁSICO
   Referência: M1
   ============================================================ */

export function Motor3Phase({
  x = 0,
  y = 0,
  scale = 1,
  stroke = DEFAULT_STROKE,
  strokeWidth = DEFAULT_WIDTH,
  label = "M1",
}: SymbolProps) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="white"
    >
      <circle cx="0" cy="0" r="55" />

      <text
        x="0"
        y="-3"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="27"
        fill={stroke}
        stroke="none"
      >
        M
      </text>

      <text
        x="0"
        y="24"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="16"
        fill={stroke}
        stroke="none"
      >
        3~
      </text>

      <text
        x="72"
        y="5"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="14"
        fill={stroke}
        stroke="none"
      >
        {label}
      </text>
    </g>
  );
}

/* ============================================================
   CONDUTOR
   ============================================================ */

export function Wire({
  x1,
  y1,
  x2,
  y2,
  stroke = DEFAULT_STROKE,
  strokeWidth = DEFAULT_WIDTH,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke?: string;
  strokeWidth?: number;
  dashed?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={dashed ? "6 5" : undefined}
      fill="none"
    />
  );
}

/* ============================================================
   JUNÇÃO
   ============================================================ */

export function Junction({
  x,
  y,
  radius = 3.5,
  fill = DEFAULT_STROKE,
}: {
  x: number;
  y: number;
  radius?: number;
  fill?: string;
}) {
  return <circle cx={x} cy={y} r={radius} fill={fill} />;
}

/* ============================================================
   TERMINAL
   ============================================================ */

export function Terminal({
  x,
  y,
  label,
  position = "left",
  stroke = DEFAULT_STROKE,
}: {
  x: number;
  y: number;
  label: string;
  position?: "left" | "right";
  stroke?: string;
}) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r="2.5"
        fill="white"
        stroke={stroke}
        strokeWidth="1.5"
      />

      <text
        x={position === "left" ? x - 10 : x + 10}
        y={y + 4}
        textAnchor={position === "left" ? "end" : "start"}
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="12"
        fill={stroke}
      >
        {label}
      </text>
    </g>
  );
}
