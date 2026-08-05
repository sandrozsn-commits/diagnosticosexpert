/**
 * Diagrama interativo de partida direta (força + comando).
 * Simbologia ABNT simplificada. Componentes clicáveis com explicação
 * e animação do caminho energizado ("Simular acionamento").
 */

import { useEffect, useRef, useState } from "react";

type Part = {
  id: string;
  name: string;
  role: string;
  text: string;
};

const PARTS: Record<string, Part> = {
  q1: {
    id: "q1",
    name: "Q1 — Disjuntor motor",
    role: "Circuito de força",
    text: "Protege o circuito contra curto-circuito e sobrecarga e serve como dispositivo de manobra e seccionamento. É o primeiro ponto a verificar quando nenhuma fase chega ao contator. Seu contato auxiliar também pode alimentar o circuito de comando.",
  },
  km1p: {
    id: "km1p",
    name: "KM1 — Contatos principais",
    role: "Circuito de força",
    text: "São os três contatos de potência (1/2, 3/4, 5/6) fechados pelo campo magnético da bobina. Enquanto a bobina estiver energizada, eles conduzem as três fases até o motor. Contatos colados ou queimados causam falta de fase e motor zumbindo.",
  },
  ft1: {
    id: "ft1",
    name: "FT1 — Relé térmico",
    role: "Proteção",
    text: "Monitora a corrente das três fases por elementos bimetálicos e atua por sobrecarga prolongada. Ao atuar, abre o contato 95/96 no comando e desliga a bobina do contator. Deve ser ajustado à corrente nominal do motor e rearmado após a causa ser corrigida.",
  },
  m1: {
    id: "m1",
    name: "M1 — Motor trifásico",
    role: "Carga",
    text: "Converte energia elétrica em movimento. Recebe as três fases pelos contatos do contator, após a proteção térmica. Falta de uma fase faz o motor zumbir, aquecer e não partir sob carga.",
  },
  f1: {
    id: "f1",
    name: "F1 — Fusível de comando",
    role: "Circuito de comando",
    text: "Protege exclusivamente o circuito de comando contra curto-circuito. Um fusível aberto deixa todo o comando sem tensão, mesmo com a força energizada. Testa-se por continuidade ou medindo tensão antes e depois dele.",
  },
  s0: {
    id: "s0",
    name: "S0 — Botoeira Desliga (NF)",
    role: "Circuito de comando",
    text: "Contato normalmente fechado ligado em série com o comando. Ao ser pressionado, interrompe a alimentação da bobina e desfaz o selo, parando o motor. Contato sujo ou preso aberto impede a partida.",
  },
  s1: {
    id: "s1",
    name: "S1 — Botoeira Liga (NA)",
    role: "Circuito de comando",
    text: "Contato normalmente aberto que fecha momentaneamente ao ser pressionado, energizando a bobina do contator. Depois de solto, quem mantém o circuito é o contato de selo. Se o selo falhar, o motor só funciona com o botão pressionado.",
  },
  selo: {
    id: "selo",
    name: "KM1 13/14 — Contato de selo",
    role: "Circuito de comando",
    text: "Contato auxiliar NA do próprio contator ligado em paralelo com S1. Assim que a bobina atrai, ele fecha e mantém a alimentação após soltar o botão Liga. É a peça-chave da memória do circuito de partida direta.",
  },
  coil: {
    id: "coil",
    name: "KM1 A1/A2 — Bobina",
    role: "Circuito de comando",
    text: "Eletroímã que fecha os contatos principais e auxiliares do contator. Recebe tensão de comando entre A1 e A2 e deve ficar energizada durante todo o funcionamento. Bobina queimada apresenta continuidade infinita e o contator não atraca.",
  },
};

/** fases da animação: 0 parado · 1 comando pronto · 2 S1 pressionado · 3 selado/motor girando */
type Phase = 0 | 1 | 2 | 3;

export function InteractiveCircuit({ className }: { className?: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const start = () => {
    clear();
    setPhase(1);
    timers.current.push(setTimeout(() => setPhase(2), 700));
    timers.current.push(setTimeout(() => setPhase(3), 1500));
  };

  const stop = () => {
    clear();
    setPhase(0);
  };

  const live = phase >= 1; // comando com tensão
  const coilOn = phase >= 2; // bobina energizada
  const running = phase >= 3; // selado + motor girando
  const part = selected ? PARTS[selected] : null;

  /** cor do condutor conforme energização */
  const w = (on: boolean) => (on ? "stroke-primary" : "stroke-muted-foreground/50");
  const flow = (on: boolean) => (on ? "circuit-flow" : "");

  const Hit = ({
    id,
    x,
    y,
    w: hw,
    h,
  }: {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }) => (
    <rect
      x={x}
      y={y}
      width={hw}
      height={h}
      rx="4"
      fill="transparent"
      stroke="none"
      tabIndex={0}
      role="button"
      aria-label={PARTS[id].name}
      onClick={() => setSelected(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setSelected(id);
        }
      }}
      className={`cursor-pointer outline-none transition-colors ${
        selected === id ? "fill-primary/10 stroke-primary" : "hover:fill-primary/5"
      }`}
      strokeWidth="1"
    />
  );

  const Txt = ({
    x,
    y,
    children,
    anchor = "start",
    size = 8.5,
    muted = true,
  }: {
    x: number;
    y: number;
    children: React.ReactNode;
    anchor?: "start" | "middle" | "end";
    size?: number;
    muted?: boolean;
  }) => (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      fontFamily="ui-monospace, monospace"
      className={muted ? "fill-muted-foreground" : "fill-foreground"}
      stroke="none"
    >
      {children}
    </text>
  );

  return (
    <div className={className}>
      <style>{`
        @keyframes circuit-dash { to { stroke-dashoffset: -24; } }
        .circuit-flow { stroke-dasharray: 6 6; animation: circuit-dash 0.6s linear infinite; }
        @keyframes circuit-spin { to { transform: rotate(360deg); } }
        .circuit-spin { animation: circuit-spin 1.2s linear infinite; transform-origin: 72px 322px; }
      `}</style>

      <svg
        viewBox="0 0 520 400"
        role="img"
        aria-label="Diagrama interativo: circuito de força e de comando da partida direta"
        className="h-auto w-full text-foreground"
        fill="none"
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        {/* ---------- separador ---------- */}
        <line x1="170" y1="14" x2="170" y2="386" className="stroke-border" strokeDasharray="4 5" />
        <Txt x={14} y={14} size={9} muted={false}>
          FORÇA — L1/L2/L3
        </Txt>
        <Txt x={188} y={14} size={9} muted={false}>
          COMANDO — L1/N
        </Txt>

        {/* =========== CIRCUITO DE FORÇA =========== */}
        {[40, 72, 104].map((x, i) => (
          <g key={x}>
            <Txt x={x} y={30} anchor="middle">{`L${i + 1}`}</Txt>
            {/* alimentação até Q1 */}
            <line x1={x} y1={36} x2={x} y2={58} className={`${w(live)} ${flow(live)}`} />
            {/* Q1 -> KM1 */}
            <line x1={x} y1={92} x2={x} y2={128} className={`${w(live)} ${flow(live)}`} />
            {/* KM1 -> FT1 */}
            <line x1={x} y1={162} x2={x} y2={196} className={`${w(running)} ${flow(running)}`} />
            {/* FT1 -> motor */}
            <line x1={x} y1={230} x2={x} y2={260} className={`${w(running)} ${flow(running)}`} />
            <line x1={x} y1={260} x2={72} y2={292} className={`${w(running)} ${flow(running)}`} />
          </g>
        ))}

        {/* Q1 — disjuntor motor */}
        {[40, 72, 104].map((x) => (
          <g key={`q${x}`} className={w(live)}>
            <line x1={x} y1={58} x2={x + 9} y2={80} />
            <line x1={x} y1={80} x2={x} y2={92} />
            <path d={`M${x - 5} 60 l5 4 l-5 4`} className="fill-none" />
          </g>
        ))}
        <rect x="26" y="52" width="94" height="46" rx="4" className="stroke-border" strokeDasharray="3 3" />
        <Txt x={124} y={78} size={9}>
          Q1
        </Txt>
        <Hit id="q1" x={24} y={50} w={98} h={50} />

        {/* KM1 contatos principais */}
        {[40, 72, 104].map((x) => (
          <g key={`k${x}`} className={w(running)}>
            <line x1={x} y1={128} x2={x} y2={134} />
            <line x1={x} y1={156} x2={x} y2={162} />
            {running ? (
              <line x1={x} y1={134} x2={x} y2={156} />
            ) : (
              <line x1={x} y1={156} x2={x + 10} y2={133} />
            )}
          </g>
        ))}
        <rect x="26" y="126" width="94" height="38" rx="4" className="stroke-border" strokeDasharray="3 3" />
        <Txt x={124} y={148} size={9}>
          KM1
        </Txt>
        <Hit id="km1p" x={24} y={124} w={98} h={42} />

        {/* FT1 relé térmico */}
        <rect x="26" y="196" width="94" height="34" rx="3" className={w(running)} />
        {[40, 72, 104].map((x) => (
          <path key={`t${x}`} d={`M${x - 5} 222 q6 -9 0 -18`} className={`${w(running)} fill-none`} />
        ))}
        <Txt x={124} y={216} size={9}>
          FT1
        </Txt>
        <Hit id="ft1" x={24} y={194} w={98} h={38} />

        {/* Motor */}
        <circle cx="72" cy="322" r="30" className={w(running)} />
        {running && (
          <path
            d="M72 296 a26 26 0 0 1 22 13"
            className="circuit-spin stroke-primary"
            strokeWidth="2"
            fill="none"
          />
        )}
        <text
          x="72"
          y="319"
          textAnchor="middle"
          fontSize="11"
          fontFamily="ui-monospace, monospace"
          className="fill-foreground"
          stroke="none"
        >
          M
        </text>
        <text
          x="72"
          y="333"
          textAnchor="middle"
          fontSize="9"
          fontFamily="ui-monospace, monospace"
          className="fill-muted-foreground"
          stroke="none"
        >
          3~
        </text>
        <Txt x={110} y={326} size={9}>
          M1
        </Txt>
        <Hit id="m1" x={40} y={290} w={64} h={64} />

        {/* =========== CIRCUITO DE COMANDO =========== */}
        {/* barramentos */}
        <line x1="196" y1="34" x2="500" y2="34" className={`${w(live)} ${flow(live)}`} />
        <line x1="196" y1="366" x2="500" y2="366" className={w(live)} />
        <Txt x={196} y={28}>
          L1
        </Txt>
        <Txt x={196} y={380}>
          N
        </Txt>

        {/* ramal principal x=300 */}
        {/* L1 -> F1 */}
        <line x1="300" y1="34" x2="300" y2="60" className={`${w(live)} ${flow(live)}`} />
        {/* F1 */}
        <rect x="292" y="60" width="16" height="26" className={w(live)} />
        <line x1="300" y1="60" x2="300" y2="86" className={w(live)} />
        <Txt x={286} y={76} anchor="end">
          F1
        </Txt>
        <Hit id="f1" x={272} y={56} w={56} h={34} />

        {/* F1 -> S0 */}
        <line x1="300" y1="86" x2="300" y2="116" className={`${w(live)} ${flow(live)}`} />
        {/* S0 NF */}
        <g className={w(live)}>
          <line x1="300" y1="116" x2="300" y2="122" />
          <line x1="300" y1="144" x2="300" y2="150" />
          <line x1="300" y1="144" x2="311" y2="123" />
          <line x1="305" y1="122" x2="314" y2="122" />
          <line x1="311" y1="122" x2="311" y2="118" />
          <line x1="288" y1="133" x2="305" y2="133" strokeDasharray="2 2" />
        </g>
        <Txt x={284} y={128} anchor="end">
          S0
        </Txt>
        <Txt x={284} y={140} anchor="end">
          NF
        </Txt>
        <Hit id="s0" x={266} y={112} w={62} h={42} />

        {/* S0 -> nó do selo */}
        <line x1="300" y1="150" x2="300" y2="180" className={`${w(live)} ${flow(live)}`} />
        <circle cx="300" cy="180" r="2.6" className={live ? "fill-primary" : "fill-muted-foreground"} stroke="none" />

        {/* S1 NA */}
        <g className={w(coilOn)}>
          <line x1="300" y1="180" x2="300" y2="196" />
          <line x1="300" y1="218" x2="300" y2="234" />
          {coilOn && phase === 2 ? (
            <line x1="300" y1="196" x2="300" y2="218" />
          ) : (
            <line x1="300" y1="218" x2="311" y2="197" />
          )}
          <line x1="288" y1="207" x2="305" y2="207" strokeDasharray="2 2" />
        </g>
        <Txt x={284} y={202} anchor="end">
          S1
        </Txt>
        <Txt x={284} y={214} anchor="end">
          NA
        </Txt>
        <Hit id="s1" x={266} y={190} w={62} h={40} />

        {/* ramo de selo x=380 */}
        <path d="M300 180 H380 V234 H300" className={`${w(running)} ${flow(running)}`} />
        <g className={w(running)}>
          <line x1="380" y1="196" x2="380" y2="200" />
          <line x1="380" y1="214" x2="380" y2="218" />
          {running ? (
            <line x1="380" y1="200" x2="380" y2="214" />
          ) : (
            <line x1="380" y1="214" x2="391" y2="197" />
          )}
        </g>
        <Txt x={398} y={202}>
          KM1 13/14
        </Txt>
        <Txt x={398} y={214}>
          selo
        </Txt>
        <Hit id="selo" x={366} y={190} w={110} h={38} />
        <circle cx="300" cy="234" r="2.6" className={running || coilOn ? "fill-primary" : "fill-muted-foreground"} stroke="none" />

        {/* nó -> bobina */}
        <line x1="300" y1="234" x2="300" y2="280" className={`${w(coilOn)} ${flow(coilOn)}`} />
        <rect x="278" y="280" width="44" height="28" rx="2" className={w(coilOn)} />
        <Txt x={272} y={288} anchor="end">
          A1
        </Txt>
        <Txt x={272} y={306} anchor="end">
          A2
        </Txt>
        <Txt x={330} y={298}>
          KM1
        </Txt>
        <Hit id="coil" x={276} y={278} w={48} h={32} />
        <line x1="300" y1="308" x2="300" y2="366" className={`${w(coilOn)} ${flow(coilOn)}`} />

        {/* contato FT1 95/96 no comando */}
        <g className={w(live)}>
          <line x1="440" y1="34" x2="440" y2="60" className={`${w(live)} ${flow(live)}`} />
          <line x1="440" y1="60" x2="440" y2="66" />
          <line x1="440" y1="88" x2="440" y2="94" />
          <line x1="440" y1="88" x2="451" y2="67" />
          <line x1="445" y1="66" x2="454" y2="66" />
          <line x1="451" y1="66" x2="451" y2="62" />
        </g>
        <Txt x={424} y={72} anchor="end">
          FT1
        </Txt>
        <Txt x={424} y={84} anchor="end">
          95/96
        </Txt>
        <path d="M440 94 V116 H300" className={w(live)} strokeDasharray="3 3" />
        <Hit id="ft1" x={410} y={56} w={56} h={44} />
      </svg>

      {/* ---------- controles ---------- */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={phase === 0 ? start : stop}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {phase === 0 ? "Simular acionamento" : "Parar simulação"}
        </button>
        <span className="text-xs text-muted-foreground">
          {phase === 0 && "Circuito desenergizado"}
          {phase === 1 && "Comando energizado — aguardando S1"}
          {phase === 2 && "S1 pressionado — bobina KM1 atraindo"}
          {phase === 3 && "Selo fechado — motor em funcionamento"}
        </span>
      </div>

      {/* ---------- painel do componente ---------- */}
      <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3">
        {part ? (
          <>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-foreground">{part.name}</p>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{part.role}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                fechar
              </button>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{part.text}</p>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            Clique em qualquer componente do diagrama para ver a função dele no circuito.
          </p>
        )}
      </div>
    </div>
  );
}
