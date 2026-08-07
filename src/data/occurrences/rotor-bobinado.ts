import type { OccurrenceSpec } from "@/data/case-builder";

export const ROTOR_BOBINADO: OccurrenceSpec[] = [
  {
    id: "rb-01",
    title: "Motor não parte, painel totalmente sem resposta",
    level: "iniciante",
    minutes: 9,
    xp: 140,
    equipment: "Motor rotor bobinado 60 cv",
    company: "Usina Cana Doce",
    sector: "Moenda",
    priority: "Baixa",
    symptom: "Ao pressionar S1, nada acontece — nenhum contator atraca, sinaleira apagada.",
    objective: "Localizar a falha na alimentação do comando do sistema rotórico.",
    steps: [
      {
        situation: "Sistema inerte ao comando de partida.",
        correct: "Verificar a tensão nos fusíveis de proteção do circuito de comando",
        wrong: [
          ["Inspecionar as escovas", "Se o comando nem atracou KM1, as escovas ainda não entraram em jogo."],
          ["Substituir o motor", "Troca inútil se o comando não está enviando sinal."],
          ["Trocar a botoeira S1", "Uma botoeira não apagaria a sinaleira de painel ligado."],
          ["Medir a isolação do rotor", "O rotor é parte da carga; o problema é no controle."],
        ],
      },
      {
        situation: "Análise da proteção.",
        reading: "Entrada do fusível de comando: 220 V. Saída: 0 V.",
        correct: "Substituir o fusível queimado e testar o circuito",
        wrong: [
          ["Trocar a botoeira S1", "Sinaleira apagada indica falta de energia geral no comando."],
          ["Jumpear o fusível", "Prática perigosa: pode causar incêndio no painel."],
          ["Inverter as fases da rede", "Isso não restaura a alimentação do comando."],
          ["Substituir o contator KM1", "KM1 não tem tensão na bobina por falta de fusível."],
        ],
      },
    ],
    diagnosis: {
      correct: "Fusível de comando aberto",
      wrong: [
        ["Bobina de KM1 queimada", "Não apagaria a sinaleira de painel ligado."],
        ["Falta de fase na potência", "O comando deveria funcionar independentemente da potência."],
        ["Emergência acionada", "Emergência impediria o acionamento, mas não necessariamente apagaria a sinaleira de rede."],
        ["Motor com rotor travado", "Não impede o atracamento dos contatores de comando."],
      ],
    },
    fault: "Fusível de proteção do comando aberto",
    technical: "A primeira etapa de qualquer diagnóstico em painéis 'mortos' é verificar a alimentação do comando.",
    checklist: [
      "Teste de fusíveis",
      "Medição de tensão de comando",
    ],
    lessons: [
      "Fluxo lógico de diagnóstico em comandos elétricos",
      "Proteção de circuitos de manobra",
    ],
  },
  {
    id: "rb-02",
    title: "Motor parte mas não desenvolve torque suficiente",
    level: "intermediario",
    minutes: 13,
    xp: 190,
    equipment: "Motor rotor bobinado 50 cv",
    company: "Mineradora Serra Alta",
    sector: "Britagem",
    priority: "Alta",
    symptom: "Motor parte, gira devagar, faz muito ruído e não vence a carga.",
    objective: "Identificar a falha na retirada progressiva das resistências rotóricas.",
    steps: [
      {
        situation: "Motor girando em baixa velocidade com som de carga pesada.",
        correct: "Verificar se o contator de curto-circuitamento KM2 atracou",
        wrong: [
          ["Trocar o banco de resistores", "O motor partiu, logo o banco está atuando."],
          ["Inverter as fases de entrada", "O motor já gira; inversão não resolve torque baixo por resistência residual."],
          ["Substituir o motor", "O motor funciona, o problema é o controle da corrente rotórica."],
          ["Lixar os anéis coletores", "Os anéis permitem a partida; o problema é o curto-circuitamento posterior."],
        ],
      },
      {
        situation: "KM2 deveria ter fechado para curto-circuitar o rotor.",
        reading: "Bobina de KM2 = 220 V presentes. KM2 permanece aberto.",
        correct: "Verificar a integridade mecânica e a bobina de KM2",
        wrong: [
          ["Testar os anéis coletores", "O motor partiu; o circuito rotórico está fechado pelos resistores."],
          ["Trocar os fusíveis de potência", "O motor está girando; há potência chegando."],
          ["Aumentar a bitola dos cabos", "A queda de tensão não é o problema; o problema é o KM2 inerte."],
          ["Trocar o temporizador", "A bobina de KM2 já tem 220V; o temporizador já atuou."],
        ],
      },
    ],
    diagnosis: {
      correct: "Contator KM2 não atracando, mantendo a resistência rotórica total no circuito",
      wrong: [
        ["Escovas gastas", "Causariam interrupção total ou faiscamento."],
        ["Falta de fase", "O ronco seria muito mais forte e o motor poderia nem partir."],
        ["Tensão de comando baixa", "A medição confirmou 220V na bobina."],
        ["Curto-circuito no rotor", "Isso faria o motor partir como se fosse de gaiola (corrente altíssima)."],
      ],
    },
    fault: "Falha no contator de curto-circuitamento rotórico KM2",
    technical: "Motores de rotor bobinado partem com resistências externas. Se KM2 falha, o motor opera na curva de alta resistência.",
    checklist: [
      "Medição de tensão na bobina de KM2",
      "Teste mecânico de atracamento",
    ],
    lessons: [
      "Funcionamento do controle de torque via rotor bobinado",
      "Diagnóstico de contatores de aceleração",
    ],
  },
  {
    id: "rb-03",
    title: "Motor não atinge a velocidade nominal",
    level: "intermediario",
    minutes: 13,
    xp: 200,
    equipment: "Motor rotor bobinado 100 cv, 2 estágios",
    company: "Mineradora Pedra Negra",
    sector: "Correia transportadora",
    priority: "Alta",
    symptom: "O motor acelera até um certo ponto, mas nunca chega na velocidade final.",
    objective: "Identificar a falha no último estágio de aceleração rotórica.",
    steps: [
      {
        situation: "Motor rodando abaixo da rotação nominal.",
        correct: "Observar se todos os contatores de aceleração (KM2 e KM3) atracaram",
        wrong: [
          ["Trocar banco de resistores", "Houve aceleração inicial."],
        ],
      },
      {
        situation: "Monitoramento da sequência.",
        reading: "KM1 e KM2 atracados. KM3 permanece aberto.",
        correct: "Medir a tensão na bobina de KM3 e testar a saída do temporizador",
        wrong: [
          ["Substituir as escovas", "Contato escova-anel está permitindo passagem de corrente."],
        ],
      },
    ],
    diagnosis: {
      correct: "Contator KM3 não atracando, mantendo parte da resistência no rotor",
      wrong: [
        ["Banco R1 aberto", "O motor nem teria torque para a primeira aceleração."],
      ],
    },
    fault: "Falha no contator de curto-circuitamento final KM3",
    technical: "Se o último contator (KM3) não fecha, o rotor nunca é totalmente curto-circuitado.",
    checklist: [
      "Verificação da bobina de KM3",
      "Teste do temporizador",
    ],
    lessons: [
      "Controle de velocidade por estágios rotóricos",
      "Impacto da resistência residual",
    ],
  },
  {
    id: "rb-04",
    title: "Motor com torque insuficiente após manutenção",
    level: "intermediario",
    minutes: 15,
    xp: 225,
    equipment: "Motor rotor bobinado 80 cv",
    company: "Metalúrgica Ferro Bruto",
    sector: "Prensa de forjaria",
    priority: "Alta",
    symptom: "Após manutenção, o motor gira normal em vazio, mas trava sob carga.",
    objective: "Detectar o erro de reconexão do circuito rotórico.",
    steps: [
      {
        situation: "Motor sem força para partida pesada após intervenção.",
        correct: "Verificar a fiação das escovas e a sequência no banco de resistores",
        wrong: [
          ["Trocar o motor", "Funciona em vazio, bobinas internas devem estar boas."],
        ],
      },
      {
        situation: "Conferência da ligação.",
        reading: "Cabos das escovas das fases rotóricas R2 e R3 estão invertidos no banco.",
        correct: "Corrigir a sequência de fases rotóricas reconectando as escovas",
        wrong: [
          ["Lixar os anéis novamente", "A falha é de ligação elétrica."],
        ],
      },
    ],
    diagnosis: {
      correct: "Inversão de fases no circuito rotórico (conexão das escovas)",
      wrong: [
        ["Falta de fase no rotor", "Teria dificuldade extrema mesmo em vazio."],
      ],
    },
    fault: "Fases rotóricas invertidas na conexão das escovas",
    technical: "Inversão de fases no rotor altera a relação angular entre os campos, reduzindo o torque.",
    checklist: [
      "Identificação de cabos rotóricos",
      "Teste de torque sob carga",
    ],
    lessons: [
      "Importância da polaridade e faseamento no rotor",
      "Diferença entre vazio e sob carga",
    ],
  },
  {
    id: "rb-05",
    title: "Faiscamento excessivo nos anéis coletores",
    level: "avancado",
    minutes: 14,
    xp: 215,
    equipment: "Motor rotor bobinado 75 cv",
    company: "Siderúrgica Vale do Aço",
    sector: "Laminação",
    priority: "Média",
    symptom: "Aparecem faíscas visíveis nos anéis coletores e cheiro de queimado.",
    objective: "Diagnosticar a causa do mau contato no conjunto anel-escova.",
    steps: [
      {
        situation: "Faiscamento intermitente e ruído de atrito irregular.",
        correct: "Desenergizar e inspecionar o comprimento das escovas",
        wrong: [
          ["Limpar anéis com motor girando", "Extremamente perigoso e proibido."],
        ],
      },
      {
        situation: "Inspeção visual.",
        reading: "Escovas abaixo do limite. Mola de pressão da fase L3 visivelmente frouxa.",
        correct: "Verificar a pressão das molas e o estado da superfície dos anéis",
        wrong: [
          ["Lixar com lixa grossa", "Danifica a pátina protetora."],
        ],
      },
    ],
    diagnosis: {
      correct: "Escovas de carvão desgastadas e molas de pressão frouxas",
      wrong: [
        ["Banco de resistores em curto", "Causaria aceleração brusca."],
      ],
    },
    fault: "Desgaste excessivo das escovas e perda de pressão das molas",
    technical: "Escovas curtas ou molas cansadas causam pequenos arcos elétricos (faiscamento).",
    checklist: [
      "Medição do comprimento das escovas",
      "Teste de pressão das molas",
    ],
    lessons: [
      "Manutenção preventiva de motores de anéis",
      "Importância da pátina nos anéis coletores",
    ],
  },
];
