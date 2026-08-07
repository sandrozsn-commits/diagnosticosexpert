import type { OccurrenceSpec } from "@/data/case-builder";

export const REVERSAO_AUTOMATICA: OccurrenceSpec[] = [
  {
    id: "ra-01",
    title: "Reversão automática não ocorre no tempo programado",
    level: "intermediario",
    minutes: 12,
    xp: 180,
    equipment: "Motor 5 cv c/ reversão automática temporizada",
    company: "Distribuidora Central de Grãos",
    sector: "Silo — transportador de vaivém",
    priority: "Média",
    symptom: "O transportador deveria reverter o sentido a cada 45 segundos automaticamente, mas às vezes passa mais de 2 minutos sem reverter.",
    objective: "Identificar a instabilidade no temporizador de ciclo.",
    steps: [
      {
        situation: "Motor rodando em um sentido além do tempo ajustado; temporizador parece 'congelado'.",
        correct: "Medir a tensão de alimentação nos bornes do temporizador durante a contagem",
        wrong: [
          ["Trocar o temporizador por um novo", "Se a causa for externa (alimentação), o novo temporizador apresentará o mesmo erro."],
          ["Reduzir o tempo de ajuste para 10 segundos", "Mudar o ajuste não resolve a falha de contagem inconsistente."],
        ],
      },
      {
        situation: "Monitoramento da tensão de comando enquanto o temporizador opera.",
        reading: "Tensão oscilando entre 160 V e 220 V nos bornes de alimentação do temporizador.",
        correct: "Verificar a conexão do neutro e a estabilidade da fonte de comando",
        wrong: [
          ["Trocar os contatores de reversão", "Os contatores estão funcionando; o problema é o comando que não envia o sinal de troca."],
          ["Substituir os cabos do motor", "A instabilidade está na alimentação do comando, não na potência."],
        ],
      },
    ],
    diagnosis: {
      correct: "Tensão de alimentação do temporizador instável, causando falhas na contagem",
      wrong: [
        ["Ajuste de tempo corrompido", "Temporizadores analógicos/digitais não mudam o ajuste sozinhos por erro de hardware sem queimar."],
        ["Fim de curso travado", "O sistema é por tempo, não por sensores de fim de curso."],
      ],
    },
    fault: "Oscilação intermitente na tensão de alimentação do temporizador de ciclo",
    technical: "Relés temporizadores eletrônicos exigem tensão estável para manter a precisão da base de tempo. Quedas de tensão podem causar resets internos ou atrasos na carga dos capacitores de temporização, resultando em ciclos inconsistentes.",
    checklist: [
      "Medição de tensão de alimentação contínua",
      "Reaperto de bornes de comando",
      "Verificação de interferência eletromagnética",
      "Instalação de estabilizador ou filtro se necessário",
    ],
    lessons: [
      "Sensibilidade de componentes eletrônicos a variações de tensão",
      "Importância da estabilidade do comando",
      "Diagnóstico de falhas intermitentes",
    ],
  },
  {
    id: "ra-02",
    title: "Motor reverte em ciclo contínuo sem parar",
    level: "avancado",
    minutes: 14,
    xp: 220,
    equipment: "Motor 3 cv c/ reversão automática por fim de curso",
    company: "Fabricante de Embalagens Nortel",
    sector: "Linha de corte — mesa reversível",
    priority: "Alta",
    symptom: "A mesa deveria reverter ao atingir o fim de curso e parar após 3 ciclos. Fica revertendo continuamente sem nunca parar.",
    objective: "Detectar a falha no sensor de limite ou na lógica de parada.",
    steps: [
      {
        situation: "Mesa batendo nos limites e revertendo sem respeitar a contagem de ciclos.",
        correct: "Testar a continuidade dos sensores de fim de curso nos pontos de parada",
        wrong: [
          ["Substituir o contador de ciclos", "Antes de trocar o contador, deve-se verificar se ele está recebendo o sinal de parada."],
          ["Desligar o disjuntor e lubrificar a mesa", "A falha é lógica de controle, não atrito mecânico."],
        ],
      },
      {
        situation: "Teste das chaves fim de curso (limites) da mesa.",
        reading: "Fim de curso de parada final: Contato NF permanece fechado mesmo com a alavanca pressionada fisicamente.",
        correct: "Verificar o mecanismo interno da chave fim de curso de parada",
        wrong: [
          ["Inverter os contatores KM1 e KM2", "Os contatores estão revertendo; o erro é a falta do comando de parada."],
          ["Trocar a botoeira de emergência", "A emergência funciona se pressionada; a falha é na automação do ciclo."],
        ],
      },
    ],
    diagnosis: {
      correct: "Chave de fim de curso de parada com contato travado fechado",
      wrong: [
        ["Erro na programação do contador", "O sinal físico de limite não está sendo interrompido na chave."],
        ["Bobina do contator com curto", "Se houvesse curto, a proteção atuaria ou o contator não atracaria."],
      ],
    },
    fault: "Chave fim de curso (Stop Limit) travada mecanicamente fechada",
    technical: "Em sistemas de ciclo automático, o sensor de fim de curso atua como a interrupção da série de comando. Se o contato NF trava fechado (falha mecânica na alavanca ou soldagem de contatos), o sistema nunca recebe o sinal de 'chegada', mantendo a reversão indefinidamente.",
    checklist: [
      "Teste de continuidade das chaves fim de curso",
      "Inspeção visual do acionamento mecânico dos sensores",
      "Limpeza ou substituição do sensor defeituoso",
      "Verificação da fiação do contador de ciclos",
    ],
    lessons: [
      "Confiabilidade de sensores mecânicos",
      "Lógica de parada em automações simples",
      "Riscos de travamento de chaves fim de curso",
    ],
  },
];
