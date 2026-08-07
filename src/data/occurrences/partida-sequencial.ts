import type { OccurrenceSpec } from "@/data/case-builder";

export const PARTIDA_SEQUENCIAL: OccurrenceSpec[] = [
  {
    id: "sq-01",
    title: "Motores partem simultaneamente em vez de sequencialmente",
    level: "intermediario",
    minutes: 13,
    xp: 195,
    equipment: "3 motores 10 cv c/ partida sequencial temporizada",
    company: "Cerealista Trigo Dourado",
    sector: "Linha de transporte de grãos (3 esteiras em série)",
    priority: "Média",
    symptom: "Ao pressionar Liga Geral, os três motores partem praticamente juntos, ignorando o intervalo de 3 segundos.",
    objective: "Identificar o erro de fiação nos temporizadores de estágio.",
    steps: [
      {
        situation: "Sobrecarga momentânea na rede pelo arranque simultâneo dos 3 motores.",
        correct: "Inspecionar as conexões dos temporizadores TR1 e TR2",
        wrong: [
          ["Reduzir o ajuste de tempo nos temporizadores", "Se eles já partem juntos, reduzir o tempo não mudará o comportamento."],
          ["Trocar os 3 contatores", "Os contatores estão fechando (até demais), o problema é o comando que os ativa."],
        ],
      },
      {
        situation: "Conferência do tipo de contato utilizado nos blocos temporizados.",
        reading: "TR1 e TR2 usando os bornes de contato instantâneo (13/14) em vez dos temporizados (15/18).",
        correct: "Corrigir a fiação para os terminais de contato temporizado",
        wrong: [
          ["Substituir os motores", "Os motores estão partindo; a falha é na lógica de sequenciamento."],
          ["Instalar um CLP", "Solução desproporcional para um erro de fiação em temporizadores analógicos."],
        ],
      },
    ],
    diagnosis: {
      correct: "Erro de fiação: contatos instantâneos usados no lugar de temporizados",
      wrong: [
        ["Temporizadores queimados", "Se estivessem queimados, os motores seguintes provavelmente não partiriam."],
        ["Curto-circuito na botoeira Liga", "A botoeira liga o primeiro motor corretamente; ela não ativaria os outros sem a lógica."],
      ],
    },
    fault: "Fiação incorreta nos blocos de tempo (uso de contatos instantâneos)",
    technical: "Muitos relés temporizadores possuem contatos instantâneos (que fecham junto com a bobina) e contatos temporizados (que esperam o tempo ajustado). Se a fiação for feita nos instantâneos, a sequência é anulada e todos os estágios partem simultaneamente, gerando picos de corrente perigosos.",
    checklist: [
      "Conferência da numeração de bornes (IEC/ABNT)",
      "Teste de continuidade dos contatos temporizados",
      "Correção do diagrama de fiação",
      "Teste de partida escalonada",
    ],
    lessons: [
      "Diferença entre contatos instantâneos e temporizados",
      "Impacto de partidas simultâneas na rede elétrica",
      "Leitura técnica de bornes de relés",
    ],
  },
  {
    id: "sq-02",
    title: "Sequência trava no segundo motor e não avança para o terceiro",
    level: "avancado",
    minutes: 15,
    xp: 225,
    equipment: "3 motores 20 cv c/ partida sequencial e intertravamento",
    company: "Indústria Química Rio Claro",
    sector: "Sistema de mistura em série",
    priority: "Alta",
    symptom: "M1 parte, M2 parte na sequência certa, mas M3 nunca parte — o processo trava na segunda etapa.",
    objective: "Localizar a falha de permissão entre o segundo e o terceiro estágio.",
    steps: [
      {
        situation: "M1 e M2 rodando; temporizador de M3 alimentado mas M3 não atraca.",
        correct: "Medir tensão na bobina de KM3 e testar o contato de permissão de KM2",
        wrong: [
          ["Substituir o motor M3", "Ainda não se sabe se o comando chega ao contator de M3."],
          ["Trocar o temporizador TR2", "O temporizador está alimentado e concluiu a contagem (LED aceso)."],
        ],
      },
      {
        situation: "Teste da cadeia de permissão KM2 (NA) → TR2 (t) → KM3.",
        reading: "Saída de TR2 com 220 V. Entrada da bobina de KM3 com 0 V. Contato auxiliar NA de KM2 (bornes 13/14) aberto mesmo com KM2 atracado.",
        correct: "Verificar o acionamento mecânico do contato auxiliar de KM2",
        wrong: [
          ["Jumpear o contato de KM2", "Prática que anula a segurança da sequência: M3 poderia partir sem M2 estar realmente rodando."],
          ["Trocar o relé térmico de M2", "M2 está rodando; o térmico está fechado."],
        ],
      },
    ],
    diagnosis: {
      correct: "Contato auxiliar NA de KM2 não fecha fisicamente (folga mecânica)",
      wrong: [
        ["Bobina de KM3 queimada", "A bobina não recebeu tensão; não é possível concluir que esteja queimada."],
        ["Erro na lógica de intertravamento", "A lógica está correta, mas um componente físico falhou em executá-la."],
      ],
    },
    fault: "Falha mecânica no contato auxiliar de permissão de KM2",
    technical: "Em partidas sequenciais, o fechamento de um contator garante que o próximo estágio só parta se o anterior estiver efetivamente atracado. Uma folga mecânica no bloco auxiliar pode impedir o fechamento elétrico do contato NA, quebrando a corrente de comando para o próximo motor.",
    checklist: [
      "Medição de tensão ponto a ponto na cadeia de comando",
      "Teste de continuidade de auxiliares sob acionamento",
      "Ajuste ou substituição do bloco auxiliar de KM2",
      "Teste da sequência completa",
    ],
    lessons: [
      "Conceito de permissão em lógica sequencial",
      "Falhas mecânicas em contatos auxiliares",
      "Importância do feedback de estado (contato NA)",
    ],
  },
  {
    id: "sq-03",
    title: "Motor 1 não parte",
    level: "iniciante",
    minutes: 8,
    xp: 120,
    equipment: "3 motores",
    company: "Trigo Dourado",
    sector: "Logística",
    symptom: "Ao ligar o comando geral, nem o motor 1 parte.",
    objective: "Verificar alimentação do primeiro estágio.",
    steps: [
      {
        situation: "Comando geral inerte.",
        correct: "Testar a botoeira Liga geral",
        wrong: [
          ["Trocar temporizadores", "A falha é no início da lógica."],
        ],
      },
    ],
    diagnosis: {
      correct: "Botoeira S1 com mau contato",
      wrong: ["Motor queimado"],
    },
    fault: "Botoeira de comando aberta",
    technical: "Falha no contato de entrada da lógica.",
    checklist: ["Testar continuidade de S1"],
    lessons: ["Diagnóstico inicial de lógica de comando"],
  },
  {
    id: "sq-04",
    title: "Temporizador de estágio 2 falha em rearmar",
    level: "intermediario",
    minutes: 12,
    xp: 170,
    equipment: "3 motores",
    company: "Trigo Dourado",
    sector: "Logística",
    symptom: "M1 parte, mas após o tempo, M2 não entra e M1 continua rodando.",
    objective: "Identificar falha no temporizador.",
    steps: [
      {
        situation: "M1 rodando, KT1 conta tempo mas não comuta.",
        correct: "Medir saída de KT1",
        wrong: [
          ["Trocar M2", "O problema é o comando do contator."],
        ],
      },
    ],
    diagnosis: {
      correct: "KT1 com contato de saída travado",
      wrong: ["KM2 queimado"],
    },
    fault: "Defeito interno no temporizador",
    technical: "Contato de comutação não fecha.",
    checklist: ["Substituir KT1"],
    lessons: ["Testes de temporizadores"],
  },
  {
    id: "sq-05",
    title: "Motor 3 desarma por sobrecarga instantaneamente",
    level: "avancado",
    minutes: 14,
    xp: 210,
    equipment: "3 motores",
    company: "Trigo Dourado",
    sector: "Logística",
    symptom: "M1 e M2 ok, mas ao entrar M3, o térmico FT3 desarma em 1s.",
    objective: "Detectar curto no ramo de M3.",
    steps: [
      {
        situation: "Desarme do térmico FT3.",
        correct: "Medir corrente de M3 durante partida",
        wrong: [
          ["Aumentar ajuste FT3", "Risco de queima."],
        ],
      },
    ],
    diagnosis: {
      correct: "Curto-circuito parcial no enrolamento de M3",
      wrong: ["Térmico descalibrado"],
    },
    fault: "Defeito no enrolamento do motor M3",
    technical: "Curto entre espiras causa sobrecorrente severa na partida.",
    checklist: ["Medir isolamento", "Medir resistência de fases"],
    lessons: ["Diagnóstico de curtos em motores"],
  },
];
