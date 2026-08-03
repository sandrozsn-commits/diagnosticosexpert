/**
 * Renderizador de diagramas de comando em SVG.
 * Puramente ilustrativo nesta etapa (sem interação).
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

const LEFT = 34;
const RIGHT = 386;
const TOP = 34;

function rungY(i: number) {
  return TOP + i * 62;
}

function Element({ el, cx, cy }: { el: DiagramElement; cx: number; cy: number }) {
  const label = el.label ? (
    <text
      x={cx}
      y={cy - 16}
      textAnchor="middle"
      className="fill-muted-foreground"
      fontSize="9"
      fontFamily="ui-monospace, monospace"
    >
      {el.label}
    </text>
  ) : null;

  switch (el.t) {
    case "wire":
      return <>{label}</>;
    case "no":
      return (
        <>
          {label}
          <line x1={cx - 10} y1={cy - 7} x2={cx - 10} y2={cy + 7} />
          <line x1={cx + 10} y1={cy - 7} x2={cx + 10} y2={cy + 7} />
          <line x1={cx - 10} y1={cy + 6} x2={cx + 10} y2={cy - 6} />
        </>
      );
    case "nc":
      return (
        <>
          {label}
          <line x1={cx - 10} y1={cy - 7} x2={cx - 10} y2={cy + 7} />
          <line x1={cx + 10} y1={cy - 7} x2={cx + 10} y2={cy + 7} />
          <line x1={cx - 10} y1={cy + 6} x2={cx + 10} y2={cy - 6} />
          <line x1={cx - 13} y1={cy - 9} x2={cx + 6} y2={cy + 10} />
        </>
      );
    case "coil":
      return (
        <>
          {label}
          <rect x={cx - 14} y={cy - 9} width="28" height="18" rx="2" />
          <line x1={cx} y1={cy - 9} x2={cx} y2={cy + 9} />
        </>
      );
    case "fuse":
      return (
        <>
          {label}
          <rect x={cx - 12} y={cy - 6} width="24" height="12" rx="1" />
        </>
      );
    case "breaker":
      return (
        <>
          {label}
          <line x1={cx - 10} y1={cy} x2={cx - 10} y2={cy - 8} />
          <line x1={cx - 10} y1={cy - 8} x2={cx + 9} y2={cy + 4} />
          <line x1={cx + 10} y1={cy - 8} x2={cx + 10} y2={cy + 8} />
          <line x1={cx + 4} y1={cy - 12} x2={cx + 14} y2={cy - 12} />
        </>
      );
    case "thermal":
      return (
        <>
          {label}
          <rect x={cx - 14} y={cy - 8} width="28" height="16" rx="2" />
          <path d={`M${cx - 8} ${cy + 3} l4 -6 l4 6 l4 -6`} fill="none" />
        </>
      );
    case "sensor":
      return (
        <>
          {label}
          <rect x={cx - 12} y={cy - 9} width="24" height="18" rx="2" />
          <path d={`M${cx - 5} ${cy - 4} l10 8 M${cx - 5} ${cy + 4} l10 -8`} />
        </>
      );
    case "motor":
      return (
        <>
          {label}
          <circle cx={cx} cy={cy} r="14" />
          <text x={cx} y={cy + 3.5} textAnchor="middle" fontSize="9" className="fill-current" stroke="none">
            M
          </text>
        </>
      );
    case "box":
      return (
        <>
          {label}
          <rect x={cx - 30} y={cy - 14} width="60" height="28" rx="3" />
        </>
      );
  }
}

function positions(n: number) {
  const usable = RIGHT - LEFT;
  const step = usable / (n + 1);
  return Array.from({ length: n }, (_, i) => LEFT + step * (i + 1));
}

export function CircuitDiagram({ spec, className }: { spec: DiagramSpec; className?: string }) {
  const height = rungY(spec.rungs.length - 1) + 60;

  return (
    <figure className={className}>
      <svg
        viewBox={`0 0 420 ${height}`}
        role="img"
        aria-label={`Diagrama de comando — ${spec.title}`}
        className="h-auto w-full text-foreground"
        stroke="currentColor"
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      >
        {/* trilhos */}
        <line x1={LEFT} y1={TOP - 18} x2={LEFT} y2={height - 26} />
        <line x1={RIGHT} y1={TOP - 18} x2={RIGHT} y2={height - 26} />
        <text x={LEFT} y={TOP - 24} fontSize="9" textAnchor="middle" className="fill-muted-foreground" stroke="none">
          {spec.leftRail}
        </text>
        <text x={RIGHT} y={TOP - 24} fontSize="9" textAnchor="middle" className="fill-muted-foreground" stroke="none">
          {spec.rightRail}
        </text>

        {spec.rungs.map((rung, ri) => {
          const y = rungY(ri);
          const xs = positions(rung.els.length);
          const nodes = [LEFT, ...xs.map((x, i) => (i < xs.length - 1 ? (x + xs[i + 1]) / 2 : RIGHT))];

          return (
            <g key={ri}>
              <line x1={LEFT} y1={y} x2={RIGHT} y2={y} />
              {rung.els.map((el, i) => (
                <g key={i}>
                  <Element el={el} cx={xs[i]} cy={y} />
                </g>
              ))}
              {rung.branch && (() => {
                const a = rung.branch.from === 0 ? LEFT : (xs[rung.branch.from - 1] + xs[rung.branch.from]) / 2;
                const b =
                  rung.branch.to >= xs.length - 1
                    ? Math.min(RIGHT, xs[xs.length - 1] + 26)
                    : (xs[rung.branch.to] + xs[rung.branch.to + 1]) / 2;
                const by = y + 30;
                const bxs = Array.from(
                  { length: rung.branch.els.length },
                  (_, i) => a + ((b - a) / (rung.branch!.els.length + 1)) * (i + 1),
                );
                return (
                  <g>
                    <path d={`M${a} ${y} V${by} H${b} V${y}`} />
                    {rung.branch.els.map((el, i) => (
                      <g key={i}>
                        <Element el={el} cx={bxs[i]} cy={by} />
                      </g>
                    ))}
                  </g>
                );
              })()}
              {rung.note && (
                <text
                  x={LEFT}
                  y={y + (rung.branch ? 48 : 22)}
                  fontSize="8.5"
                  className="fill-muted-foreground"
                  stroke="none"
                >
                  {rung.note}
                </text>
              )}
              {/* nós de conexão */}
              {nodes.slice(0, 0)}
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-[10px] uppercase tracking-wide text-muted-foreground">
        {spec.title}
      </figcaption>
    </figure>
  );
}
