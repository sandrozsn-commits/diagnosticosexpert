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
];
