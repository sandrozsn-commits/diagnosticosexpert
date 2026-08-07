import type { DiagramSpec } from "@/components/circuit-diagram";

export type CircuitId =
  | "partida-direta"
  | "reversao"
  | "estrela-triangulo"
  | "compensadora"
  | "soft-starter"
  | "inversor"
  | "botoeiras"
  | "sensores"
  | "rele-temporizador"
  | "rele-nivel"
  | "dahlander"
  | "rotor-bobinado"
  | "reversao-automatica"
  | "estrela-triangulo-freio"
  | "partida-sequencial";

export type Circuit = {
  id: CircuitId;
  name: string;
  description: string;
  components: string[];
  diagram: DiagramSpec;
};

export const CIRCUITS: Circuit[] = [
  {
    id: "partida-direta",
    name: "Partida Direta",
    description: "Acionamento de motor trifásico por contator único com selo e proteção térmica.",
    components: [
      "Disjuntor Q1",
      "Fusíveis de comando F1/F2",
      "Botoeira Desliga S0 (NF)",
      "Botoeira Liga S1 (NA)",
      "Contator KM1",
      "Contato de selo KM1 13/14",
      "Relé térmico FT1 (95/96)",
      "Motor trifásico M1",
    ],
    diagram: {
      title: "Partida direta com selo",
      leftRail: "L1 (fase)",
      rightRail: "N",
      rungs: [
        {
          els: [
            { t: "breaker", label: "Q1" },
            { t: "fuse", label: "F1" },
            { t: "nc", label: "FT1 95/96" },
            { t: "nc", label: "S0" },
            { t: "no", label: "S1" },
            { t: "coil", label: "KM1" },
          ],
          branch: { from: 4, to: 4, els: [{ t: "no", label: "KM1 13/14 (selo)" }] },
          note: "Comando 220 V — selo em paralelo com S1",
        },
        {
          els: [
            { t: "breaker", label: "Q1 (potência)" },
            { t: "no", label: "KM1 1/2·3/4·5/6" },
            { t: "thermal", label: "FT1" },
            { t: "motor", label: "M1 3~" },
          ],
          note: "Circuito de potência L1/L2/L3",
        },
      ],
    },
  },
  {
    id: "reversao",
    name: "Partida com Reversão",
    description: "Dois contatores invertendo duas fases, com intertravamento elétrico e mecânico.",
    components: [
      "Disjuntor Q1",
      "Fusíveis de comando F1/F2",
      "Botoeira Desliga S0 (NF)",
      "Botoeira Horário S1 (NA)",
      "Botoeira Anti-horário S2 (NA)",
      "Contator KM1 (horário)",
      "Contator KM2 (anti-horário)",
      "Intertravamento elétrico KM1/KM2 (NF)",
      "Intertravamento mecânico entre contatores",
      "Relé térmico FT1",
      "Motor trifásico M1",
    ],
    diagram: {
      title: "Reversão com intertravamento",
      leftRail: "L1 (fase)",
      rightRail: "N",
      rungs: [
        {
          els: [
            { t: "fuse", label: "F1" },
            { t: "nc", label: "FT1" },
            { t: "nc", label: "S0" },
            { t: "no", label: "S1" },
            { t: "nc", label: "KM2 21/22" },
            { t: "coil", label: "KM1" },
          ],
          branch: { from: 3, to: 3, els: [{ t: "no", label: "KM1 13/14" }] },
          note: "Sentido horário — intertravado por contato NF de KM2",
        },
        {
          els: [
            { t: "wire" },
            { t: "wire" },
            { t: "wire" },
            { t: "no", label: "S2" },
            { t: "nc", label: "KM1 21/22" },
            { t: "coil", label: "KM2" },
          ],
          branch: { from: 3, to: 3, els: [{ t: "no", label: "KM2 13/14" }] },
          note: "Sentido anti-horário — intertravamento mecânico no bloco KM1/KM2",
        },
        {
          els: [
            { t: "no", label: "KM1 / KM2" },
            { t: "thermal", label: "FT1" },
            { t: "motor", label: "M1 3~" },
          ],
          note: "Potência: KM2 inverte L1 e L3",
        },
      ],
    },
  },
  {
    id: "estrela-triangulo",
    name: "Partida Estrela-Triângulo",
    description: "Partida com tensão reduzida em estrela e comutação temporizada para triângulo.",
    components: [
      "Disjuntor Q1",
      "Fusíveis de comando F1/F2",
      "Botoeira Desliga S0 (NF)",
      "Botoeira Liga S1 (NA)",
      "Contator principal KM1",
      "Contator estrela KM2",
      "Contator triângulo KM3",
      "Relé temporizador KT1 (Y/Δ)",
      "Intertravamento KM2/KM3 (NF)",
      "Relé térmico FT1",
      "Motor trifásico M1 (6 pontas)",
    ],
    diagram: {
      title: "Estrela-triângulo temporizada",
      leftRail: "L1 (fase)",
      rightRail: "N",
      rungs: [
        {
          els: [
            { t: "fuse", label: "F1" },
            { t: "nc", label: "FT1" },
            { t: "nc", label: "S0" },
            { t: "no", label: "S1" },
            { t: "coil", label: "KM1" },
            { t: "box", label: "KT1 (t)" },
          ],
          branch: { from: 3, to: 3, els: [{ t: "no", label: "KM1 13/14" }] },
          note: "Energização do contator principal e partida da temporização",
        },
        {
          els: [
            { t: "no", label: "KT1 15/16 (t)" },
            { t: "nc", label: "KM3 21/22" },
            { t: "coil", label: "KM2 (estrela)" },
          ],
          note: "Estrela ativa até o fim do tempo ajustado",
        },
        {
          els: [
            { t: "no", label: "KT1 15/18 (t)" },
            { t: "nc", label: "KM2 21/22" },
            { t: "coil", label: "KM3 (triângulo)" },
          ],
          note: "Comutação para triângulo com intertravamento",
        },
        {
          els: [
            { t: "no", label: "KM1 + KM2/KM3" },
            { t: "thermal", label: "FT1" },
            { t: "motor", label: "M1 3~" },
          ],
          note: "Potência com motor de 6 pontas",
        },
      ],
    },
  },
  {
    id: "compensadora",
    name: "Partida com Chave Compensadora",
    description: "Partida com autotransformador em taps reduzidos e transição para tensão plena.",
    components: [
      "Disjuntor Q1",
      "Fusíveis de comando F1/F2",
      "Botoeira Desliga S0 (NF)",
      "Botoeira Liga S1 (NA)",
      "Contator de neutro do autotransformador KM1",
      "Contator de tap KM2 (65 %/80 %)",
      "Contator de rede KM3",
      "Autotransformador de partida T1",
      "Relé temporizador KT1",
      "Relé térmico FT1",
      "Motor trifásico M1",
    ],
    diagram: {
      title: "Chave compensadora (autotransformador)",
      leftRail: "L1 (fase)",
      rightRail: "N",
      rungs: [
        {
          els: [
            { t: "fuse", label: "F1" },
            { t: "nc", label: "FT1" },
            { t: "nc", label: "S0" },
            { t: "no", label: "S1" },
            { t: "coil", label: "KM1 (neutro)" },
            { t: "box", label: "KT1 (t)" },
          ],
          branch: { from: 3, to: 3, els: [{ t: "no", label: "KM1 13/14" }] },
          note: "Fecha o neutro do autotransformador e inicia o tempo de partida",
        },
        {
          els: [
            { t: "no", label: "KM1 13/14" },
            { t: "nc", label: "KM3 21/22" },
            { t: "coil", label: "KM2 (tap 65 %)" },
          ],
          note: "Motor alimentado em tensão reduzida pelo tap T1",
        },
        {
          els: [
            { t: "no", label: "KT1 15/18 (t)" },
            { t: "nc", label: "KM2 21/22" },
            { t: "coil", label: "KM3 (rede plena)" },
          ],
          note: "Transição para tensão plena e desligamento de T1",
        },
        {
          els: [
            { t: "box", label: "T1 autotrafo" },
            { t: "thermal", label: "FT1" },
            { t: "motor", label: "M1 3~" },
          ],
          note: "Potência com autotransformador de partida",
        },
      ],
    },
  },
  {
    id: "soft-starter",
    name: "Partida com Soft Starter",
    description: "Partida suave eletrônica com rampa de tensão, bypass e sinal de falha.",
    components: [
      "Disjuntor Q1",
      "Fusíveis ultrarrápidos F1/F2/F3",
      "Soft starter SS1",
      "Entrada de comando (start/stop)",
      "Contator de bypass KM2",
      "Relé de saída 'em regime' (top of ramp)",
      "Relé térmico / proteção FT1",
      "Motor trifásico M1",
    ],
    diagram: {
      title: "Soft starter com bypass",
      leftRail: "L1 (fase)",
      rightRail: "N",
      rungs: [
        {
          els: [
            { t: "fuse", label: "F1" },
            { t: "nc", label: "S0" },
            { t: "no", label: "S1" },
            { t: "box", label: "SS1 start" },
          ],
          branch: { from: 2, to: 2, els: [{ t: "no", label: "selo K1" }] },
          note: "Entrada digital de partida do soft starter",
        },
        {
          els: [
            { t: "no", label: "SS1 top of ramp" },
            { t: "nc", label: "SS1 falha" },
            { t: "coil", label: "KM2 (bypass)" },
          ],
          note: "Bypass fecha ao final da rampa de aceleração",
        },
        {
          els: [
            { t: "box", label: "SS1 potência" },
            { t: "thermal", label: "FT1" },
            { t: "motor", label: "M1 3~" },
          ],
          note: "Potência: soft starter em série, bypass em paralelo",
        },
      ],
    },
  },
  {
    id: "inversor",
    name: "Partida com Inversor de Frequência",
    description: "Acionamento com inversor, comandos digitais de entrada e referência analógica.",
    components: [
      "Disjuntor Q1",
      "Inversor de frequência VFD1",
      "Entrada digital DI1 (gira/para)",
      "Entrada digital DI2 (reverso)",
      "Referência analógica AI1 (0-10 V)",
      "Relé de falha DO1",
      "Reator / filtro de entrada",
      "Motor trifásico M1",
    ],
    diagram: {
      title: "Inversor de frequência",
      leftRail: "24 Vcc",
      rightRail: "0 V",
      rungs: [
        {
          els: [
            { t: "nc", label: "S0 (para)" },
            { t: "no", label: "S1 (gira)" },
            { t: "box", label: "VFD1 DI1" },
          ],
          branch: { from: 1, to: 1, els: [{ t: "no", label: "selo K1" }] },
          note: "Comando a dois fios/três fios na entrada digital DI1",
        },
        {
          els: [
            { t: "no", label: "S2 (reverso)" },
            { t: "box", label: "VFD1 DI2" },
          ],
          note: "Inversão de sentido por entrada digital",
        },
        {
          els: [
            { t: "sensor", label: "Potenciômetro" },
            { t: "box", label: "VFD1 AI1" },
          ],
          note: "Referência de velocidade 0-10 V",
        },
        {
          els: [
            { t: "breaker", label: "Q1" },
            { t: "box", label: "VFD1 U/V/W" },
            { t: "motor", label: "M1 3~" },
          ],
          note: "Potência: rede → inversor → motor",
        },
      ],
    },
  },
  {
    id: "botoeiras",
    name: "Comando por Botoeiras",
    description: "Comando manual com botoeiras em múltiplos pontos, selo e sinalização.",
    components: [
      "Fusíveis de comando F1/F2",
      "Botoeira Desliga S0 (NF) — painel",
      "Botoeira Desliga S0' (NF) — campo",
      "Botoeira Liga S1 (NA) — painel",
      "Botoeira Liga S1' (NA) — campo",
      "Botão de emergência (NF com trava)",
      "Contator KM1 e contato de selo",
      "Sinaleiras H1 (ligado) / H2 (falha)",
    ],
    diagram: {
      title: "Comando por botoeiras (dois pontos)",
      leftRail: "L1 (fase)",
      rightRail: "N",
      rungs: [
        {
          els: [
            { t: "fuse", label: "F1" },
            { t: "nc", label: "Emergência" },
            { t: "nc", label: "S0 / S0' (série)" },
            { t: "no", label: "S1 // S1'" },
            { t: "coil", label: "KM1" },
          ],
          branch: { from: 3, to: 3, els: [{ t: "no", label: "KM1 13/14 (selo)" }] },
          note: "Desliga em série, liga em paralelo",
        },
        {
          els: [
            { t: "no", label: "KM1 43/44" },
            { t: "coil", label: "H1 ligado" },
          ],
          note: "Sinalização de estado",
        },
        {
          els: [
            { t: "no", label: "FT1 97/98" },
            { t: "coil", label: "H2 falha" },
          ],
        },
      ],
    },
  },
  {
    id: "sensores",
    name: "Comando por Sensores",
    description: "Acionamento automático por sensores indutivo, capacitivo e fotoelétrico em 24 Vcc.",
    components: [
      "Fonte 24 Vcc",
      "Sensor indutivo B1 (PNP)",
      "Sensor fotoelétrico B2",
      "Relé de interface K1",
      "Contator KM1",
      "Botoeira de emergência",
      "Motor / esteira M1",
    ],
    diagram: {
      title: "Comando por sensores 24 Vcc",
      leftRail: "+24 Vcc",
      rightRail: "0 V",
      rungs: [
        {
          els: [
            { t: "nc", label: "Emergência" },
            { t: "sensor", label: "B1 indutivo PNP" },
            { t: "coil", label: "K1 (interface)" },
          ],
          note: "Saída do sensor comanda o relé de interface",
        },
        {
          els: [
            { t: "sensor", label: "B2 fotoelétrico" },
            { t: "nc", label: "K1 21/22" },
            { t: "coil", label: "K2" },
          ],
          note: "Intertravamento entre sensores",
        },
        {
          els: [
            { t: "no", label: "K1 13/14" },
            { t: "coil", label: "KM1" },
          ],
          note: "Interface 24 Vcc → comando 220 V",
        },
        {
          els: [
            { t: "no", label: "KM1" },
            { t: "thermal", label: "FT1" },
            { t: "motor", label: "M1 esteira" },
          ],
        },
      ],
    },
  },
  {
    id: "rele-temporizador",
    name: "Comando com Relé Temporizador",
    description: "Sequenciamento por temporizadores com retardo na energização e na desenergização.",
    components: [
      "Fusíveis de comando F1/F2",
      "Botoeira Liga S1 / Desliga S0",
      "Temporizador KT1 (ON delay)",
      "Temporizador KT2 (OFF delay)",
      "Contator KM1 (etapa 1)",
      "Contator KM2 (etapa 2)",
      "Relé térmico FT1",
      "Motores M1 / M2",
    ],
    diagram: {
      title: "Sequência temporizada ON/OFF delay",
      leftRail: "L1 (fase)",
      rightRail: "N",
      rungs: [
        {
          els: [
            { t: "fuse", label: "F1" },
            { t: "nc", label: "S0" },
            { t: "no", label: "S1" },
            { t: "coil", label: "KM1" },
            { t: "box", label: "KT1 ON delay" },
          ],
          branch: { from: 2, to: 2, els: [{ t: "no", label: "KM1 13/14" }] },
          note: "Etapa 1 parte imediatamente e arma KT1",
        },
        {
          els: [
            { t: "no", label: "KT1 15/18 (t)" },
            { t: "nc", label: "FT1" },
            { t: "coil", label: "KM2" },
          ],
          note: "Etapa 2 entra após o tempo ajustado",
        },
        {
          els: [
            { t: "no", label: "KM2 13/14" },
            { t: "box", label: "KT2 OFF delay" },
          ],
          note: "Retardo na desenergização (ventilação/pós-ciclo)",
        },
        {
          els: [
            { t: "no", label: "KM1 / KM2" },
            { t: "thermal", label: "FT1" },
            { t: "motor", label: "M1 / M2" },
          ],
        },
      ],
    },
  },
  {
    id: "rele-nivel",
    name: "Comando com Relé de Nível",
    description: "Controle automático de bomba por relé de nível com eletrodos e proteção contra marcha a seco.",
    components: [
      "Fusíveis de comando F1/F2",
      "Relé de nível KN1",
      "Eletrodo de referência E1 (comum)",
      "Eletrodo de nível mínimo E2",
      "Eletrodo de nível máximo E3",
      "Chave seletora manual/automático",
      "Contator KM1",
      "Relé térmico FT1",
      "Motobomba M1",
    ],
    diagram: {
      title: "Controle de nível por eletrodos",
      leftRail: "L1 (fase)",
      rightRail: "N",
      rungs: [
        {
          els: [
            { t: "fuse", label: "F1" },
            { t: "box", label: "KN1 relé nível" },
            { t: "sensor", label: "E1/E2/E3" },
          ],
          note: "Eletrodos: comum, mínimo e máximo no reservatório",
        },
        {
          els: [
            { t: "nc", label: "S0" },
            { t: "no", label: "KN1 15/18" },
            { t: "nc", label: "FT1" },
            { t: "coil", label: "KM1" },
          ],
          branch: { from: 1, to: 1, els: [{ t: "no", label: "Seletora manual" }] },
          note: "Automático pelo relé de nível ou manual pela seletora",
        },
        {
          els: [
            { t: "no", label: "KM1" },
            { t: "thermal", label: "FT1" },
            { t: "motor", label: "M1 bomba" },
          ],
        },
      ],
    },
  },
  {
    id: "dahlander",
    name: "Motor Dahlander",
    description: "Partida de motor Dahlander de duas velocidades com intertravamento elétrico.",
    components: ["Contator KM1 (baixa)", "Contator KM2 (alta)", "Contator KM3 (alta)", "Relé térmico FT1/FT2"],
    diagram: { title: "Dahlander (simplificado)", leftRail: "L1", rightRail: "N", rungs: [] },
  },
  {
    id: "rotor-bobinado",
    name: "Motor de Rotor Bobinado",
    description: "Partida com resistência rotórica progressiva via contatores.",
    components: ["Contator de estator KM1", "Contator de curto KM2", "Resistores R1/R2/R3"],
    diagram: { title: "Rotor bobinado", leftRail: "L1", rightRail: "N", rungs: [] },
  },
  {
    id: "reversao-automatica",
    name: "Reversão Automática",
    description: "Reversão temporizada ou por fim de curso para transportadores.",
    components: ["Temporizador de ciclo", "Sensores de fim de curso", "Contatores de sentido"],
    diagram: { title: "Reversão automática", leftRail: "L1", rightRail: "N", rungs: [] },
  },
  {
    id: "estrela-triangulo-freio",
    name: "Y/Δ com Freio Magnético",
    description: "Partida estrela-triângulo combinada com frenagem eletromagnética de segurança.",
    components: ["Contator de freio KM4", "Retificador", "Bobina de freio"],
    diagram: { title: "Y/Δ com freio", leftRail: "L1", rightRail: "N", rungs: [] },
  },
  {
    id: "partida-sequencial",
    name: "Partida Sequencial",
    description: "Partida temporizada de motores em cascata para evitar picos na rede.",
    components: ["Temporizadores de estágio", "Contatores KM1/KM2/KM3", "Intertravamentos"],
    diagram: { title: "Partida sequencial", leftRail: "L1", rightRail: "N", rungs: [] },
  },
];

export const CIRCUIT_BY_ID: Record<string, Circuit> = Object.fromEntries(
  CIRCUITS.map((c) => [c.id, c]),
);

export function circuitOf(id: string): Circuit | undefined {
  return CIRCUIT_BY_ID[id];
}
