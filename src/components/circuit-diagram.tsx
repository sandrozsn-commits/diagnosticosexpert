/**
 * Renderizador de diagramas de comando em SVG.
 * Simbologia baseada em IEC 60617 / prática ABNT-IEC.
 * Estilo técnico limpo (CAD-like).
 */

export type DiagramElement = {
  t: "no" | "nc" | "coil" | "fuse" | "thermal" | "motor" | "box" | "breaker" | "sensor" | "wire";
  label?: string;
};

export type DiagramRung = {
  els: DiagramElement[];
  /** ramo paralelo (selo, intertravamento, retorno) */
  branch?: { from: number; to: number; els: DiagramElement[] };
  note?: string;
};

export type DiagramSpec = {
  title: string;
  leftRail: string;
  rightRail: string;
  rungs: DiagramRung[];
};

/* ---------------- geometria ---------------- */

const COL_W = 190;
const PAD_L = 54;
const PAD_R = 26;
const TOP = 34;
const STEP = 62;
const BRANCH_DX = 54;

const TERMINALS: Record<DiagramElement["t"], [string, string] | null> = {
  no: ["13", "14"],
  nc: ["11", "12"],
  coil: ["A1", "A2"],
  fuse: ["1", "2"],
  thermal: ["95", "96"],
  breaker: ["1", "2"],
  sensor: ["3", "4"],
  motor: null,
  box: ["A1", "A2"],
  wire: null,
};

/** separa "KM1 13/14 (selo)" em rótulo e par de terminais */
function parseLabel(el: DiagramElement) {
  const raw = el.label ?? "";
  const all = [...raw.matchAll(/(\d{1,2})\s*\/\s*(\d{1,2})/g)];
  const m = all[0];
  const terminals = m ? ([m[1], m[2]] as [string, string]) : TERMINALS[el.t];
  let text = raw;
  for (const hit of all) text = text.replace(hit[0], "");
  text = text
    .replace(/·+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  return { text, terminals };
}

/* ---------------- símbolos ---------------- */

function Symbol({
  el,
  x,
  y,
  side = "left",
}: {
  el: DiagramElement;
  x: number;
  y: number;
  side?: "left" | "right" | "above";
}) {
  const { text, terminals } = parseLabel(el);
  const isButton = /^-?S\d/i.test(text) || /botoeira/i.test(text);
  const leftGap = el.t === "motor" ? 34 : el.t === "box" ? 26 : isButton ? 26 : 22;

  const name = text ? (
    <text
      x={side === "above" ? x : side === "left" ? x - leftGap : x + 30}
      y={side === "above" ? y - 26 : y + 3}
      textAnchor={side === "above" ? "middle" : side === "left" ? "end" : "start"}
      fontSize="8.5"
      fontFamily="ui-monospace, monospace"
      className="fill-muted-foreground"
      stroke="none"
    >
      {text}
    </text>
  ) : null;



  const term = terminals ? (
    <>
      <text
        x={x + 15}
        y={y - 12}
        fontSize="7"
        fontFamily="ui-monospace, monospace"
        className="fill-muted-foreground"
        stroke="none"
      >
        {terminals[0]}
      </text>
      <text
        x={x + 15}
        y={y + 18}
        fontSize="7"
        fontFamily="ui-monospace, monospace"
        className="fill-muted-foreground"
        stroke="none"
      >
        {terminals[1]}
      </text>
    </>
  ) : null;

  switch (el.t) {
    case "wire":
      return null;

    /* contato NA: lâmina inclinada, terminal superior aberto */
    case "no":
    case "breaker":
      return (
        <>
          {name}
          {term}
          <line x1={x} y1={y - 14} x2={x} y2={y - 10} />
          <line x1={x} y1={y + 10} x2={x} y2={y + 14} />
          <line x1={x} y1={y + 10} x2={x + 11} y2={y - 11} />
          {el.t === "breaker" && (
            <>
              <path d={`M${x - 4} ${y - 14} l4 4 l-4 4`} fill="none" />
              <path d={`M${x - 4} ${y - 6} l4 4 l-4 4`} fill="none" />
            </>
          )}
          {isButton && (
            <>
              <line x1={x - 12} y1={y} x2={x + 5} y2={y} strokeDasharray="2 2" />
              <line x1={x - 12} y1={y - 4} x2={x - 12} y2={y + 4} />
            </>
          )}
        </>
      );

    /* contato NF: lâmina inclinada apoiada na barra do terminal superior */
    case "nc":
      return (
        <>
          {name}
          {term}
          <line x1={x} y1={y - 14} x2={x} y2={y - 10} />
          <line x1={x} y1={y + 10} x2={x} y2={y + 14} />
          <line x1={x} y1={y + 10} x2={x + 11} y2={y - 11} />
          <line x1={x + 5} y1={y - 10} x2={x + 14} y2={y - 10} />
          <line x1={x + 11} y1={y - 10} x2={x + 11} y2={y - 14} />
          {isButton && (
            <>
              <line x1={x - 12} y1={y} x2={x + 5} y2={y} strokeDasharray="2 2" />
              <line x1={x - 12} y1={y - 4} x2={x - 12} y2={y + 4} />
            </>
          )}
        </>
      );

    /* bobina de contator: retângulo A1/A2 */
    case "coil":
      return (
        <>
          {name}
          {term}
          <line x1={x} y1={y - 14} x2={x} y2={y - 10} />
          <line x1={x} y1={y + 10} x2={x} y2={y + 14} />
          <rect x={x - 13} y={y - 10} width="26" height="20" />
        </>
      );

    /* fusível: retângulo com traço axial */
    case "fuse":
      return (
        <>
          {name}
          {term}
          <line x1={x} y1={y - 14} x2={x} y2={y - 11} />
          <line x1={x} y1={y + 11} x2={x} y2={y + 14} />
          <rect x={x - 7} y={y - 11} width="14" height="22" />
          <line x1={x} y1={y - 11} x2={x} y2={y + 11} />
        </>
      );

    /* relé térmico: retângulo com elemento bimetálico */
    case "thermal":
      return (
        <>
          {name}
          {term}
          <line x1={x} y1={y - 14} x2={x} y2={y - 11} />
          <line x1={x} y1={y + 11} x2={x} y2={y + 14} />
          <rect x={x - 11} y={y - 11} width="22" height="22" />
          <path d={`M${x - 5} ${y + 6} q5 -6 0 -12`} fill="none" />
          <line x1={x - 5} y1={y} x2={x + 7} y2={y} />
        </>
      );

    /* sensor de proximidade: losango com terminais */
    case "sensor":
      return (
        <>
          {name}
          {term}
          <line x1={x} y1={y - 14} x2={x} y2={y - 11} />
          <line x1={x} y1={y + 11} x2={x} y2={y + 14} />
          <path d={`M${x} ${y - 11} l11 11 l-11 11 l-11 -11 Z`} />
          <line x1={x - 4} y1={y} x2={x + 4} y2={y} />
        </>
      );

    /* motor trifásico */
    case "motor":
      return (
        <>
          {name}
          <line x1={x} y1={y - 20} x2={x} y2={y - 16} />
          <circle cx={x} cy={y + 2} r="18" />
          <text
            x={x}
            y={y - 2}
            textAnchor="middle"
            fontSize="9"
            fontFamily="ui-monospace, monospace"
            className="fill-current"
            stroke="none"
          >
            M
          </text>
          <text
            x={x}
            y={y + 10}
            textAnchor="middle"
            fontSize="8"
            fontFamily="ui-monospace, monospace"
            className="fill-current"
            stroke="none"
          >
            3~
          </text>
        </>
      );

    /* bloco genérico (temporizador, soft-starter, inversor) */
    case "box":
      return (
        <>
          {name}
          {term}
          <line x1={x} y1={y - 18} x2={x} y2={y - 14} />
          <line x1={x} y1={y + 14} x2={x} y2={y + 18} />
          <rect x={x - 17} y={y - 14} width="34" height="28" />
          <path d={`M${x - 8} ${y - 6} h16 M${x} ${y - 6} v8`} fill="none" />
        </>
      );
  }
}

/* ---------------- diagrama ---------------- */

function Node({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r="2.2" className="fill-current" stroke="none" />;
}

export function CircuitDiagram({ spec, className }: { spec: DiagramSpec; className?: string }) {
  const cols = spec.rungs.length;
  const maxEls = Math.max(...spec.rungs.map((r) => r.els.length));
  const width = PAD_L + cols * COL_W + PAD_R;
  const bottom = TOP + (maxEls + 1) * STEP;
  const height = bottom + 30;

  return (
    <figure className={className}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Diagrama de comando — ${spec.title}`}
        className="h-auto w-full text-foreground"
        stroke="currentColor"
        strokeWidth="1.15"
        fill="none"
        strokeLinecap="round"
      >
        <defs>
          <pattern id="cad-grid" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="0.6" cy="0.6" r="0.5" className="fill-muted-foreground/40" stroke="none" />
          </pattern>
        </defs>
        <rect x="0" y="0" width={width} height={height} fill="url(#cad-grid)" stroke="none" />

        {/* barramentos */}
        <line x1={PAD_L - 30} y1={TOP} x2={width - 10} y2={TOP} />
        <line x1={PAD_L - 30} y1={bottom} x2={width - 10} y2={bottom} />
        <text
          x={PAD_L - 30}
          y={TOP - 8}
          fontSize="8.5"
          fontFamily="ui-monospace, monospace"
          className="fill-muted-foreground"
          stroke="none"
        >
          {spec.leftRail}
        </text>
        <text
          x={PAD_L - 30}
          y={bottom + 14}
          fontSize="8.5"
          fontFamily="ui-monospace, monospace"
          className="fill-muted-foreground"
          stroke="none"
        >
          {spec.rightRail}
        </text>

        {spec.rungs.map((rung, ri) => {
          const x = PAD_L + ri * COL_W + COL_W / 2;
          const ys = rung.els.map((_, i) => TOP + (i + 1) * STEP);

          const branch = rung.branch;
          const bTop = branch ? ys[branch.from] - STEP / 2 : 0;
          const bBottom = branch ? ys[Math.min(branch.to, ys.length - 1)] + STEP / 2 : 0;
          const bx = x + BRANCH_DX;

          return (
            <g key={ri}>
              {/* condutor vertical do ramal */}
              <line x1={x} y1={TOP} x2={x} y2={bottom} />
              <Node x={x} y={TOP} />
              <Node x={x} y={bottom} />

              {rung.els.map((el, i) => (
                <Symbol key={i} el={el} x={x} y={ys[i]} />
              ))}

              {branch && (
                <>
                  <path d={`M${x} ${bTop} H${bx} V${bBottom} H${x}`} />
                  <Node x={x} y={bTop} />
                  <Node x={x} y={bBottom} />
                  {branch.els.map((el, i) => (
                    <Symbol
                      key={i}
                      el={el}
                      x={bx}
                      side="right"
                      y={bTop + ((bBottom - bTop) / (branch.els.length + 1)) * (i + 1)}
                    />

                  ))}
                </>
              )}
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-2 space-y-1">
        <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
          {spec.title} — Simbologia baseada em IEC 60617
        </span>
        {spec.rungs
          .filter((r) => r.note)
          .map((r, i) => (
            <span key={i} className="block text-[10px] leading-relaxed text-muted-foreground">
              • {r.note}
            </span>
          ))}
      </figcaption>
    </figure>
  );
}
