import type { OccurrenceSpec } from "@/data/case-builder";

export const ROTOR_BOBINADO: OccurrenceSpec[] = [
  {
    id: "rb-01",
    title: "Motor parte mas não desenvolve torque suficiente",
    level: "intermediario",
    minutes: 13,
    xp: 190,
    equipment: "Motor rotor bobinado 50 cv",
    company: "Mineradora Serra Alta",
    sector: "Britagem",
    priority: "Alta",
    symptom: "Motor parte, gira devagar, faz muito ruído e não consegue vencer a carga do britador. Permanece nessa condição até o desligamento manual.",
    objective: "Identificar a falha na retirada progressiva das resistências rotóricas.",
    steps: [
      {
        situation: "Motor girando em baixa velocidade com som característico de carga pesada.",
        correct: "Verificar se o contator de curto-circuitamento KM2 atracou",
        wrong: [
          ["Trocar o banco de resistores R1/R2/R3", "O banco está atuando (o motor partiu), o problema é a sua retirada."],
          ["Aumentar o ajuste do relé térmico", "O motor está operando em condição anormal; aumentar o ajuste apenas agrava o risco de queima."],
        ],
      },
      {
        situation: "KM2 deveria ter fechado para curto-circuitar o rotor após a partida.",
        reading: "Bobina de KM2 = 220 V presentes. KM2 permanece aberto (armadura não move).",
        correct: "Verificar a integridade mecânica e a bobina de KM2",
        wrong: [
          ["Testar os anéis coletores", "Se o motor partiu, o circuito rotórico está fechado pelos resistores; os anéis estão conduzindo."],
          ["Trocar o temporizador de partida", "A bobina de KM2 já recebeu tensão; o temporizador cumpriu seu papel."],
        ],
      },
    ],
    diagnosis: {
      correct: "Contator KM2 não atracando, mantendo a resistência rotórica total no circuito",
      wrong: [
        ["Escovas de carvão gastas", "Escovas gastas causariam interrupção total ou faiscamento, não falta de torque com corrente estável."],
        ["Falta de fase no estator", "O ruído seria diferente e a corrente de estator estaria muito desequilibrada."],
      ],
    },
    fault: "Falha no contator de curto-circuitamento rotórico KM2",
    technical: "Motores de rotor bobinado partem com resistências externas para aumentar o torque de partida e reduzir a corrente. Se o contator KM2 falha em curto-circuitar o rotor, o motor opera na curva de alta resistência, não atingindo a rotação nominal sob carga.",
    checklist: [
      "Medição de tensão na bobina de KM2",
      "Teste mecânico de atracamento de KM2",
      "Verificação dos contatos de potência de KM2",
      "Inspeção do banco de resistores",
    ],
    lessons: [
      "Funcionamento do controle de torque via rotor bobinado",
      "Importância da retirada de resistências rotóricas",
      "Diagnóstico de contatores de aceleração",
    ],
  },
  {
    id: "rb-02",
    title: "Faiscamento excessivo nos anéis coletores",
    level: "avancado",
    minutes: 14,
    xp: 215,
    equipment: "Motor rotor bobinado 75 cv",
    company: "Siderúrgica Vale do Aço",
    sector: "Laminação",
    priority: "Média",
    symptom: "Durante a operação normal, aparecem faíscas visíveis na região dos anéis coletores, acompanhadas de um cheiro de queimado leve.",
    objective: "Diagnosticar a causa do mau contato no conjunto anel-escova.",
    steps: [
      {
        situation: "Faiscamento intermitente e ruído de atrito irregular no conjunto rotórico.",
        correct: "Desenergizar, bloquear o painel e inspecionar o comprimento das escovas",
        wrong: [
          ["Limpar os anéis coletores com o motor girando", "Prática extremamente perigosa e proibida — risco de acidente grave."],
          ["Substituir o contator de estator KM1", "A falha é mecânica/elétrica no rotor, não no comando do estator."],
        ],
      },
      {
        situation: "Inspeção visual do porta-escovas e das molas de pressão.",
        reading: "Escovas de duas fases abaixo da marca de limite. Mola de pressão da fase L3 visivelmente frouxa.",
        correct: "Verificar a pressão das molas e o estado da superfície dos anéis",
        wrong: [
          ["Lixar os anéis com lixa grossa", "Lixa grossa danifica a pátina protetora e acelera o desgaste das escovas."],
          ["Aplicar graxa nos anéis para reduzir atrito", "Graxa é isolante e causará falha total de condução e possível incêndio."],
        ],
      },
    ],
    diagnosis: {
      correct: "Escovas de carvão desgastadas e molas de pressão frouxas",
      wrong: [
        ["Banco de resistores em curto", "Um curto no banco não causaria faiscamento nos anéis, mas aceleração brusca."],
        ["Desbalanceamento de fases no estator", "O problema é localizado no contato deslizante do rotor."],
      ],
    },
    fault: "Desgaste excessivo das escovas e perda de pressão das molas",
    technical: "O contato entre escovas e anéis coletores deve ser mantido por uma pressão constante. Escovas curtas ou molas cansadas causam pequenos arcos elétricos (faiscamento), que carbonizam a superfície e aumentam a resistência, podendo levar à queima do conjunto.",
    checklist: [
      "Medição do comprimento das escovas",
      "Teste de pressão das molas com dinamômetro",
      "Limpeza da fuligem de carvão",
      "Substituição do conjunto de escovas",
    ],
    lessons: [
      "Manutenção preventiva de motores de anéis",
      "Identificação de faiscamento destrutivo",
      "Importância da pátina nos anéis coletores",
    ],
  },
  {
    id: "rb-03",
    title: "Motor não parte, painel totalmente sem resposta",
    level: "iniciante",
    minutes: 9,
    xp: 140,
    equipment: "Motor rotor bobinado 60 cv",
    company: "Usina Cana Doce",
    sector: "Moenda",
    priority: "Baixa",
    symptom: "Ao pressionar S1, nada acontece — nenhum contator atraca, nenhum ruído, sinaleira de painel ligado apagada.",
    objective: "Localizar a falha na alimentação do comando do sistema rotórico.",
    steps: [
      {
        situation: "Sistema inerte ao comando de partida.",
        correct: "Verificar a tensão nos fusíveis de proteção do circuito de comando",
        wrong: [
          ["Inspecionar as escovas do motor", "Se o comando nem atracou o contator de estator, as escovas ainda não entraram em jogo."],
          ["Medir a resistência do rotor", "Falha de comando deve ser investigada no painel, antes de ir ao motor."],
        ],
      },
      {
        situation: "Análise da proteção geral do circuito de manobra.",
        reading: "Entrada do fusível de comando: 220 V. Saída: 0 V.",
        correct: "Substituir o fusível queimado e testar o circuito",
        wrong: [
          ["Trocar a botoeira S1", "A sinaleira apagada indica falta de energia geral no comando, não falha no contato de S1."],
          ["Religar o disjuntor de potência Q1", "Q1 protege a força; o sintoma é de falha no comando."],
        ],
      },
    ],
    diagnosis: {
      correct: "Fusível de comando aberto",
      wrong: [
        ["Bobina de KM1 queimada", "Uma bobina queimada não apagaria a sinaleira de painel ligado."],
        ["Falta de fase no motor", "O comando funcionaria (atracaria contatores) mesmo com falta de fase na potência."],
      ],
    },
    fault: "Fusível de proteção do comando aberto",
    technical: "A primeira etapa de qualquer diagnóstico em painéis 'mortos' é verificar a alimentação do comando. Em motores de rotor bobinado, o comando do estator (KM1) e dos estágios rotóricos (KM2, etc.) depende dessa proteção comum.",
    checklist: [
      "Teste de fusíveis",
      "Medição de tensão de comando",
      "Verificação de bornes soltos",
      "Teste funcional de partida",
    ],
    lessons: [
      "Fluxo lógico de diagnóstico em comandos elétricos",
      "Proteção de circuitos de manobra",
      "Identificação de falhas de alimentação",
    ],
  },
  {
    id: "rb-04",
    title: "Motor não atinge a velocidade nominal, para em um estágio intermediário",
    level: "intermediario",
    minutes: 13,
    xp: 200,
    equipment: "Motor rotor bobinado 100 cv, partida em 2 estágios",
    company: "Mineradora Pedra Negra",
    sector: "Correia transportadora principal",
    priority: "Alta",
    symptom: "O motor acelera até um certo ponto, dá uma pequena melhora, mas nunca chega na velocidade final. Fica roncando no estágio intermediário.",
    objective: "Identificar a falha no último estágio de aceleração rotórica.",
    steps: [
      {
        situation: "Motor rodando abaixo da rotação nominal com carga parcial.",
        correct: "Observar se todos os contatores de aceleração (KM2 e KM3) atracaram",
        wrong: [
          ["Trocar o banco de resistores", "Se houve aceleração inicial, os resistores estão conduzindo."],
          ["Lubrificar a correia transportadora", "O ronco e a falta de velocidade sugerem falha elétrica de torque, não atrito."],
        ],
      },
      {
        situation: "Monitoramento da sequência de partida rotórica.",
        reading: "KM1 e KM2 atracados. KM3 (curto-circuito final) permanece aberto mesmo após o tempo do temporizador.",
        correct: "Medir a tensão na bobina de KM3 e testar a saída do temporizador de 2º estágio",
        wrong: [
          ["Substituir as escovas", "Se KM2 funcionou, o contato escova-anel está permitindo a passagem de corrente."],
          ["Inverter fases do estator", "Inverter fases mudaria o sentido, não resolveria o travamento em estágio de partida."],
        ],
      },
    ],
    diagnosis: {
      correct: "Contator KM3 não atracando, mantendo parte da resistência no rotor",
      wrong: [
        ["Banco de resistores R1 aberto", "Se R1 estivesse aberto, o motor nem teria torque para a primeira aceleração."],
        ["Temporizador de 1º estágio falhou", "O motor chegou ao estágio intermediário, logo o 1º estágio (KM2) funcionou."],
      ],
    },
    fault: "Falha no contator de curto-circuitamento final KM3",
    technical: "Em motores de rotor bobinado com múltiplos estágios, cada contator retira uma seção de resistência. Se o último contator (KM3) não fecha, o rotor nunca é totalmente curto-circuitado, operando com uma resistência residual que limita o torque e a velocidade final sob carga.",
    checklist: [
      "Verificação da bobina de KM3",
      "Teste do temporizador de segundo estágio",
      "Inspeção de contatos de potência de KM3",
      "Medição de rotação final (RPM)",
    ],
    lessons: [
      "Controle de velocidade por estágios rotóricos",
      "Impacto da resistência residual no torque final",
      "Diagnóstico de sequenciamento de contatores",
    ],
  },
  {
    id: "rb-05",
    title: "Motor com torque de partida insuficiente após manutenção, mas funciona bem em vazio",
    level: "avancado",
    minutes: 15,
    xp: 225,
    equipment: "Motor rotor bobinado 80 cv",
    company: "Metalúrgica Ferro Bruto",
    sector: "Prensa de forjaria",
    priority: "Alta",
    symptom: "Após manutenção nos anéis coletores, o motor gira normal sem carga, mas trava e o térmico atua ao tentar partir com a prensa carregada.",
    objective: "Detectar o erro de reconexão do circuito rotórico.",
    steps: [
      {
        situation: "Motor sem força para partida pesada após intervenção técnica.",
        correct: "Verificar a fiação das escovas e a sequência de ligação no banco de resistores",
        wrong: [
          ["Trocar o motor", "O motor funciona em vazio, sugerindo que as bobinas internas estão boas."],
          ["Aumentar a pressão das escovas", "Pressão excessiva causa desgaste, não resolve falta severa de torque."],
        ],
      },
      {
        situation: "Conferência da ligação do circuito de rotor após a troca de escovas.",
        reading: "Cabos das escovas das fases rotóricas R2 e R3 estão invertidos na conexão com o banco de resistores.",
        correct: "Corrigir a sequência de fases rotóricas reconectando as escovas corretamente",
        wrong: [
          ["Lixar os anéis coletores novamente", "A falha é de ligação elétrica, não de superfície de contato."],
          ["Trocar o banco de resistores", "O problema surgiu após mexer nas escovas; o banco não mudou."],
        ],
      },
    ],
    diagnosis: {
      correct: "Inversão de fases no circuito rotórico (conexão das escovas)",
      wrong: [
        ["Falta de fase no rotor", "Com falta de fase o motor teria dificuldade extrema mesmo em vazio."],
        ["Curto-circuito entre anéis", "Geraria queima imediata de fusíveis, não falta de torque sob carga."],
      ],
    },
    fault: "Fases rotóricas invertidas na conexão das escovas",
    technical: "Embora a inversão de fases no rotor não mude o sentido de giro (determinado pelo estator), ela altera a relação angular entre os campos, reduzindo drasticamente o torque de partida. Em vazio o motor vence o atrito, mas sob carga a falha de torque impede a aceleração.",
    checklist: [
      "Identificação de cabos rotóricos",
      "Verificação de diagrama de manutenção",
      "Teste de torque sob carga controlada",
      "Medição de corrente rotórica balanceada",
    ],
    lessons: [
      "Importância da polaridade e faseamento no rotor",
      "Diagnóstico pós-manutenção",
      "Diferença entre operação em vazio e sob carga",
    ],
  },
];
