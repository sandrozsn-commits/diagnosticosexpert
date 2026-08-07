import type { OccurrenceSpec } from "@/data/case-builder";

export const REVERSAO_AUTOMATICA: OccurrenceSpec[] = [
  {
    id: "ra-01",
    title: "Reversão automática não ocorre no tempo programado",
    level: "iniciante",
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
    title: "Motor reverte com atraso progressivo",
    level: "intermediario",
    minutes: 10,
    xp: 150,
    equipment: "Motor 5 cv",
    company: "Distribuidora Central de Grãos",
    sector: "Logística",
    symptom: "O ciclo de reversão está ficando cada vez mais longo ao longo do dia.",
    objective: "Identificar aquecimento excessivo no temporizador.",
    steps: [
      {
        situation: "Temporizador operando em ambiente com alta temperatura.",
        correct: "Medir a temperatura interna do painel",
        wrong: [
          ["Trocar o motor", "O motor não controla o tempo de reversão."],
        ],
      },
      {
        situation: "Monitoramento do componente.",
        reading: "Temperatura do temporizador = 75°C. Limite técnico = 55°C.",
        correct: "Melhorar a ventilação do painel",
        wrong: [
          ["Reduzir carga do motor", "O calor é ambiental/painel, não do motor."],
        ],
      },
    ],
    diagnosis: {
      correct: "Deriva térmica no temporizador por falta de ventilação",
      wrong: [
        ["Desgaste mecânico", "Componente eletrônico."],
      ],
    },
    fault: "Superaquecimento do temporizador",
    technical: "O calor altera a constante de tempo dos circuitos analógicos de temporização.",
    checklist: ["Verificar ventiladores do painel", "Limpar filtros"],
    lessons: ["Impacto da temperatura na precisão eletrônica"],
  },
  {
    id: "ra-03",
    title: "Ciclo de reversão não inicia após parada de emergência",
    level: "intermediario",
    minutes: 10,
    xp: 160,
    equipment: "Motor 3 cv",
    company: "Distribuidora Central de Grãos",
    sector: "Silo",
    symptom: "Após rearmar a emergência, o sistema não retoma o ciclo automático.",
    objective: "Identificar falta de pulso de 'reset/start' na lógica.",
    steps: [
      {
        situation: "Emergência rearmada, mas contatores não atracam.",
        correct: "Verificar tensão na entrada de 'start' do temporizador de ciclo",
        wrong: [
          ["Trocar o temporizador", "Pode ser apenas falta de comando de partida."],
          ["Substituir os fusíveis", "A sinaleira de painel ligado está acesa."],
        ],
      },
      {
        situation: "Análise da série de comando.",
        reading: "Tensão presente após a emergência, mas o contato NA de KM1 (selo de partida) não fechou.",
        correct: "Pressionar botão 'Reset/Liga' para reiniciar a lógica",
        wrong: [
          ["Jumpear a emergência", "Ação perigosa e desnecessária."],
          ["Inverter o sentido do motor", "O motor já está no sentido correto."],
        ],
      },
    ],
    diagnosis: {
      correct: "Lógica aguardando pulso de inicialização após queda de energia/emergência",
      wrong: [
        ["Falha no temporizador", "O componente está íntegro, apenas aguardando comando."],
        ["Curto-circuito", "Não houve desarme de proteção."],
      ],
    },
    fault: "Procedimento de reinicialização não executado",
    technical: "Sistemas automáticos costumam exigir um pulso manual de confirmação após paradas de segurança.",
    checklist: ["Rearmar emergência", "Pressionar botão de liga"],
    lessons: ["Diferença entre rearmar hardware e reiniciar lógica"],
  },
  {
    id: "ra-04",
    title: "Reversão instável com vibração no contator",
    level: "avancado",
    minutes: 12,
    xp: 190,
    equipment: "Motor 5 cv",
    company: "Fabricante Nortel",
    sector: "Transporte",
    symptom: "No momento da troca de sentido, o contator vibra intensamente antes de estabilizar.",
    objective: "Detectar tempo morto insuficiente.",
    steps: [
      {
        situation: "Vibração audível na transição.",
        correct: "Medir o tempo de intervalo entre a saída de KM1 e entrada de KM2",
        wrong: [
          ["Trocar contator", "Vibração pode ser lógica (tempo morto)."],
        ],
      },
      {
        situation: "Leitura do osciloscópio/cronômetro digital.",
        reading: "Intervalo = 10ms. Recomendado = 50ms para extinção de arco.",
        correct: "Aumentar o tempo morto no temporizador de transição",
        wrong: [
          ["Trocar mola do contator", "Não resolve a sobreposição de sinais."],
          ["Aumentar a bitola dos cabos", "A queda de tensão não é a causa primária aqui."],
        ],
      },
    ],
    diagnosis: {
      correct: "Tempo morto insuficiente causando arco elétrico residual",
      wrong: [
        ["Bobina fraca", "Vibração ocorre apenas na troca."],
        ["Falta de fase", "O motor gira normalmente após a transição."],
      ],
    },
    fault: "Ajuste de tempo morto muito baixo",
    technical: "O arco elétrico de um contator deve extinguir-se totalmente antes do outro fechar.",
    checklist: ["Aumentar tempo de pausa", "Verificar câmaras de extinção"],
    lessons: ["Importância do tempo morto em reversões"],
  },
  {
    id: "ra-05",
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
