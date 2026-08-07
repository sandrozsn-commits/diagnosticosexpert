import type { OccurrenceSpec } from "@/data/case-builder";

export const ROTOR_BOBINADO_REVERSAO: OccurrenceSpec[] = [
  {
    id: "rbr-01",
    title: "Motor reverte com vibração forte",
    level: "iniciante",
    minutes: 13,
    xp: 195,
    equipment: "Motor rotor bobinado 40 cv",
    company: "Estaleiro Baía Sul",
    sector: "Guincho",
    priority: "Alta",
    symptom: 'Ao inverter o sentido, o motor vibra e a corrente sobe demais.',
    objective: "Detectar por que a resistência não está sendo reinserida.",
    steps: [
      {
        situation: "Tranco excessivo na reversão.",
        correct: "Verificar se KM3 desatracou na manobra",
        wrong: [
          ["Inverter fases de entrada", "Isso não resolve a falta de resistência."],
        ],
      },
      {
        situation: "Análise de KM3.",
        reading: "KM3 permanece atracado (soldado).",
        correct: "Desenergizar e testar continuidade de KM3",
        wrong: [
          ["Trocar temporizador", "A falha é mecânica/contato."],
        ],
      },
    ],
    diagnosis: {
      correct: "Contator KM3 travado fechado",
      wrong: [
        ["Curto no rotor", "Faria falha em ambos os sentidos."],
      ],
    },
    fault: "Contator de curto-circuito soldado",
    technical: "Rotor deve partir com resistência para limitar corrente.",
    checklist: ["Verificar KM3", "Testar continuidade"],
    lessons: ["Função da resistência rotórica"],
  },
  {
    id: "rbr-02",
    title: "Motor não reverte em nenhum sentido",
    level: "intermediario",
    minutes: 10,
    xp: 150,
    equipment: "Motor rotor bobinado 35 cv",
    company: "Porto Baía Norte",
    sector: "Guincho",
    priority: "Baixa",
    symptom: 'Sentido direto OK. Botão de reversão sem efeito.',
    objective: "Identificar falha no ramal de comando.",
    steps: [
      {
        situation: "Comando de inversão inoperante.",
        correct: "Verificar tensão no fusível de reversão",
        wrong: [
          ["Inspecionar escovas", "Comando nem atracou contatores."],
        ],
      },
    ],
    diagnosis: {
      correct: "Fusível do ramal de comando de reversão aberto",
      wrong: [
        ["KM2 queimado", "Fusível aberto explica o comando morto."],
      ],
    },
    fault: "Fusível de proteção aberto",
    technical: "Separação de ramais permite diagnósticos por ramal.",
    checklist: ["Trocar fusível", "Medir tensão"],
    lessons: ["Isolamento de falhas por ramal"],
  },
  {
    id: "rbr-03",
    title: "Motor demora para acelerar após reverter",
    level: "intermediario",
    minutes: 13,
    xp: 200,
    equipment: "Motor rotor bobinado 55 cv",
    company: "Estaleiro Costa Azul",
    sector: "Pórtico",
    priority: "Alta",
    symptom: 'Após reverter, o motor demora a atingir a rotação e faz ruído.',
    objective: "Detectar resistência residual.",
    steps: [
      {
        situation: "Motor rodando com aceleração lenta.",
        correct: "Medir queda de tensão em KM3",
        wrong: [
          ["Lubrificar pórtico", "Problema surgiu após reversão."],
        ],
      },
    ],
    diagnosis: {
      correct: "Contato de força de KM3 carbonizado",
      wrong: [
        ["Falta de fase no rotor", "Causaria perda de torque severa."],
      ],
    },
    fault: "Resistência de contato elevada em KM3",
    technical: "Carbonização cria resistência parasita que limita torque.",
    checklist: ["Substituir KM3", "Limpar contatos"],
    lessons: ["Impacto da resistência de contato"],
  },
  {
    id: "rbr-04",
    title: "Reversão não inverte o sentido real",
    level: "avancado",
    minutes: 15,
    xp: 235,
    equipment: "Motor rotor bobinado 45 cv",
    company: "Indústria Naval Sul",
    sector: "Talha",
    priority: "Alta",
    symptom: 'Contator de reversão atraca, mas o motor gira no mesmo sentido.',
    objective: "Identificar erro de fiação na inversão de fases.",
    steps: [
      {
        situation: "KM2 atracado, mas rotação inalterada.",
        correct: "Conferir fiação das fases entre KM1 e KM2",
        wrong: [
          ["Trocar motor", "Motor responde ao campo girante."],
        ],
      },
    ],
    diagnosis: {
      correct: "Erro de montagem: fases não cruzadas na ponte",
      wrong: [
        ["Contator KM2 ruim", "Ele fecha eletricamente."],
      ],
    },
    fault: "Ponte de reversão sem cruzamento de fases",
    technical: "É obrigatório trocar duas fases para reverter o campo.",
    checklist: ["Rastrear cabos", "Ver diagrama"],
    lessons: ["Conceito de campo girante"],
  },
  {
    id: "rbr-05",
    title: "Motor para ao tentar reverter sob carga",
    level: "avancado",
    minutes: 14,
    xp: 210,
    equipment: "Motor rotor bobinado 70 cv",
    company: "Terminal Santos",
    sector: "Pá carregadeira",
    priority: "Alta",
    symptom: 'Reverter em vazio OK. Com carga plena, o térmico desarma.',
    objective: "Avaliar ajuste da proteção térmica.",
    steps: [
      {
        situation: "Desarme do térmico apenas em carga máxima.",
        correct: "Medir corrente de pico na reversão pesada",
        wrong: [
          ["Trocar banco de resistores", "Resistores limitam a corrente."],
        ],
      },
    ],
    diagnosis: {
      correct: "Relé térmico com classe de disparo inadequada",
      wrong: [
        ["Motor em curto", "Funcionaria em vazio."],
      ],
    },
    fault: "Parametrização incorreta da proteção térmica",
    technical: "A reversão sob carga exige classe de disparo maior.",
    checklist: ["Ajustar térmico", "Validar sob carga"],
    lessons: ["Classes de disparo de relés"],
  },
];
