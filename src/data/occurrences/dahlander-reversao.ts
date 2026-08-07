import type { OccurrenceSpec } from "@/data/case-builder";

export const DAHLANDER_REVERSAO: OccurrenceSpec[] = [
  {
    id: "dhr-01",
    title: "Motor reverte mas perde a velocidade alta",
    level: "iniciante",
    minutes: 15,
    xp: 225,
    equipment: "Motor Dahlander 2 velocidades c/ reversão 7,5 cv",
    company: "Frigorífico Bom Pastor",
    sector: "Câmara fria — esteira reversível",
    priority: "Média",
    symptom: 'No sentido horário, as duas velocidades funcionam normalmente. No sentido anti-horário, só a velocidade baixa responde.',
    objective: "Identificar a falha isolada na lógica combinada de reversão e velocidade alta.",
    steps: [
      {
        situation: "Teste anti-horário: S3 (baixa) OK, mas S4 (alta) não aciona.",
        correct: "Verificar a continuidade do contato auxiliar de KM2 na linha de alta",
        wrong: [
          ["Trocar os contatores KM4 e KM5", "Eles funcionam no sentido horário."],
        ],
      },
      {
        situation: "Análise da permissão de sentido.",
        reading: "Contato auxiliar NA de KM2 não apresenta continuidade.",
        correct: "Inspecionar mecanicamente o bloco auxiliar de KM2",
        wrong: [
          ["Trocar a botoeira S4", "O bloqueio está no contato de KM2."],
        ],
      },
    ],
    diagnosis: {
      correct: "Mau contato em contato auxiliar de KM2",
      wrong: [
        ["Falta de fase", "Impediria ambas as velocidades."],
      ],
    },
    fault: "Mau contato em auxiliar específico",
    technical: "Em Dahlander com reversão, KM2 deve liberar a velocidade alta.",
    checklist: ["Testar auxiliares de KM2", "Limpar contatos"],
    lessons: ["Complexidade de lógicas combinadas"],
  },
  {
    id: "dhr-02",
    title: "Motor não reverte em nenhuma velocidade",
    level: "intermediario",
    minutes: 10,
    xp: 150,
    equipment: "Motor Dahlander 2 velocidades c/ reversão 5 cv",
    company: "Curtume Rio das Pedras",
    sector: "Tambor",
    priority: "Baixa",
    symptom: 'Sentido original OK. Reversão nada acontece.',
    objective: "Localizar a interrupção no ramal de comando de reversão.",
    steps: [
      {
        situation: "Comando anti-horário inerte.",
        correct: "Medir a tensão no fusível do ramal de reversão",
        wrong: [
          ["Substituir o motor", "O motor funciona no sentido direto."],
        ],
      },
    ],
    diagnosis: {
      correct: "Fusível do ramal de comando de reversão aberto",
      wrong: [
        ["Bobinas queimadas", "Pouco provável falha múltipla."],
      ],
    },
    fault: "Fusível de reversão aberto",
    technical: "Proteção isolada para o ramal de manobra inversa.",
    checklist: ["Trocar fusível", "Testar botoeira"],
    lessons: ["Ramais de comando independentes"],
  },
  {
    id: "dhr-03",
    title: "Estalo e desarme ao trocar de sentido rápido",
    level: "intermediario",
    minutes: 13,
    xp: 205,
    equipment: "Motor Dahlander 15 cv",
    company: "Estamparia Metal Cromo",
    sector: "Prensa",
    priority: "Alta",
    symptom: 'Se troca de sentido rápido demais, o disjuntor desarma.',
    objective: "Identificar falha na coordenação de tempo.",
    steps: [
      {
        situation: "Curto por sobreposição de arco elétrico.",
        correct: "Verificar estado do temporizador de segurança entre reversões",
        wrong: [
          ["Aumentar disjuntor", "Ação insegura."],
        ],
      },
    ],
    diagnosis: {
      correct: "Falta de tempo morto entre reversões",
      wrong: [
        ["Curto no motor", "Funciona se partir devagar."],
      ],
    },
    fault: "Ausência de intervalo de segurança",
    technical: "O arco elétrico precisa de tempo para extinguir antes da nova manobra.",
    checklist: ["Instalar temporizador", "Ajustar tempo morto"],
    lessons: ["Extinção de arco elétrico"],
  },
  {
    id: "dhr-04",
    title: "Reversão desarma disjuntor apenas em alta",
    level: "avancado",
    minutes: 15,
    xp: 230,
    equipment: "Motor Dahlander 20 cv",
    company: "Papelão Vale Verde",
    sector: "Guilhotina",
    priority: "Alta",
    symptom: 'Reversão em baixa OK. Reversão em alta desarma disjuntor.',
    objective: "Detectar falha de intertravamento na alta velocidade.",
    steps: [
      {
        situation: "Curto específico na manobra de alta.",
        correct: "Comparar intertravamento de baixa com o de alta",
        wrong: [
          ["Trocar térmico", "Desarme é por curto (disjuntor)."],
        ],
      },
    ],
    diagnosis: {
      correct: "Falta de intertravamento cruzado entre contatores de alta",
      wrong: [
        ["Motor em curto", "Funciona em alta se partir direto."],
      ],
    },
    fault: "Erro de fiação no intertravamento de alta",
    technical: "A lógica deve cobrir todas as combinações de contatores.",
    checklist: ["Conferir diagrama", "Rastrear fios"],
    lessons: ["Importância do intertravamento total"],
  },
  {
    id: "dhr-05",
    title: "Reversão demora excessivamente",
    level: "avancado",
    minutes: 12,
    xp: 190,
    equipment: "Motor Dahlander 10 cv",
    company: "Serraria Pinheiral",
    sector: "Mesa de corte",
    priority: "Média",
    symptom: 'O motor leva 5 segundos parado antes de reverter.',
    objective: "Identificar erro de parametrização.",
    steps: [
      {
        situation: "Atraso lógico perceptível.",
        correct: "Medir ajuste do relé de tempo de reversão",
        wrong: [
          ["Substituir contatores", "Atraso é comandado."],
        ],
      },
    ],
    diagnosis: {
      correct: "Temporizador com ajuste de tempo excessivo",
      wrong: [
        ["Bobina fraca", "Não causa atraso lógico."],
      ],
    },
    fault: "Ajuste incorreto do temporizador",
    technical: "Equilíbrio entre segurança contra arco e produtividade.",
    checklist: ["Reajustar tempo", "Validar operação"],
    lessons: ["Parametrização de proteções"],
  },
];
