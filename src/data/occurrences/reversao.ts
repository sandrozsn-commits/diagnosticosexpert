import type { OccurrenceSpec } from "@/data/case-builder";

export const REVERSAO: OccurrenceSpec[] = [
  {
    id: "rv-01",
    title: "Motor gira apenas em um sentido",
    level: "iniciante",
    minutes: 9,
    xp: 130,
    equipment: "Motor de esteira 3 cv",
    company: "Têxtil Bandeirante",
    sector: "Transporte de material",
    symptom: "O sentido horário funciona normalmente, mas ao acionar S2 nada acontece: KM2 não atraca.",
    objective: "Localizar the interrupção exclusiva do ramo de comando do sentido anti-horário.",
    steps: [
      {
        situation: "Sentido horário confirmado em operação; o ramo de KM2 está inerte.",
        correct: "Medir tensão na bobina de KM2 com S2 pressionado",
        wrong: [
          ["Trocar as fases na saída de KM2", "A inversão de fases altera o sentido de rotação, não a falha de acionamento da bobina."],
          ["Substituir o contator KM2", "Ainda não se sabe se a bobina recebe tensão."],
        ],
      },
      {
        situation: "A bobina de KM2 não recebe tensão, então a série do ramo está aberta em algum ponto.",
        reading: "Bobina KM2 A1/A2 = 0 V com S2 pressionado. Contato NF KM1 21/22 com continuidade normal.",
        correct: "Testar a continuidade do contato NA da botoeira S2",
        wrong: [
          ["Verificar o relé térmico FT1", "O relé térmico é comum aos dois ramos e o sentido horário funciona."],
          ["Trocar os fusíveis de comando", "F1 alimenta ambos os ramos, e o horário está operando."],
        ],
      },
    ],
    diagnosis: {
      correct: "Botoeira S2 com contato NA aberto (bloco de contato danificado)",
      wrong: [
        ["Intertravamento elétrico atuando indevidamente", "O contato NF de KM1 apresentou continuidade normal."],
        ["Bobina de KM2 queimada", "A bobina sequer recebeu tensão para ser avaliada."],
      ],
    },
    fault: "Botoeira S2 com contato NA defeituoso",
    technical:
      "Em circuitos de reversão, cada sentido possui um ramo próprio. Quando apenas um sentido falha, a investigação deve concentrar-se nos elementos exclusivos daquele ramo — botoeira, contato de intertravamento e bobina — descartando os elementos comuns que comprovadamente funcionam.",
    checklist: [
      "Confirmação do funcionamento do ramo horário",
      "Medição de tensão na bobina de KM2",
      "Teste de continuidade do intertravamento NF",
      "Teste do bloco de contato de S2",
    ],
    lessons: [
      "Elementos comuns e exclusivos em circuitos de reversão",
      "Teste de blocos de contato de botoeiras",
      "Estratégia de eliminação por ramo",
    ],
  },
  {
    id: "rv-02",
    title: "Sentido anti-horário com interrupção intermitente",
    level: "intermediario",
    minutes: 11,
    xp: 160,
    equipment: "Motor 5 cv",
    company: "Têxtil Bandeirante",
    sector: "Logística",
    symptom: "Ao acionar o sentido anti-horário, KM2 às vezes não mantém o selo.",
    objective: "Identificar falha no contato de selo de KM2.",
    steps: [
      {
        situation: "Motor parte mas para ao soltar S2.",
        correct: "Inspecionar o contato NA 13/14 de KM2",
        wrong: [
          ["Trocar motor", "O motor funciona enquanto o botão é pressionado."],
        ],
      },
      {
        situation: "Teste de continuidade no contato de selo.",
        reading: "Contato 13/14 de KM2 com resistência alta (200 ohms) quando fechado.",
        correct: "Substituir bloco de contatos auxiliares de KM2",
        wrong: [
          ["Aumentar tempo de partida", "O problema é de retenção elétrica, não tempo."],
        ],
      },
    ],
    diagnosis: {
      correct: "Contato de selo de KM2 com alta resistência",
      wrong: [
        ["Botoeira S2 com defeito", "O motor parte, logo o botão fecha o circuito."],
      ],
    },
    fault: "Mau contato no auxiliar de KM2",
    technical: "Oxidação no contato de selo impede a corrente de manutenção da bobina.",
    checklist: ["Verificar continuidade do selo", "Substituir bloco auxiliar"],
    lessons: ["Importância da limpeza de contatos de selo"],
  },
  {
    id: "rv-03",
    title: "A reversão não funciona em nenhum sentido",
    level: "intermediario",
    minutes: 10,
    xp: 150,
    equipment: "Motor de portão industrial 2 cv",
    company: "Centro Logístico Leste",
    sector: "Doca de expedição",
    symptom: "Nenhum dos dois sentidos responde ao comando. O painel está energizado e sem sinalização de falha.",
    objective: "Diferenciar falha comum a ambos os ramos de falha localizada em um deles.",
    steps: [
      {
        situation: "Ambos os ramos inertes sugere um elemento comum interrompido.",
        correct: "Medir tensão ao longo da série comum: F1 → FT1 (95/96) → S0",
        wrong: [
          ["Testar as bobinas de KM1 e KM2 com megômetro", "Duas bobinas com falha simultânea é hipótese improvável frente a um elemento comum."],
          ["Substituir as botoeiras S1 e S2", "Ambas as botoeiras defeituosas ao mesmo tempo é hipótese remota."],
        ],
      },
      {
        situation: "A medição percorre a série comum até encontrar a descontinuidade.",
        reading: "Após F1 = 220 V | após FT1 = 220 V | após S0 = 0 V, mesmo com a botoeira em repouso.",
        correct: "Testar o contato NF de S0 e sua fixação mecânica",
        wrong: [
          ["Verificar os contatos de intertravamento", "O intertravamento fica após S0, que já apresenta 0 V."],
          ["Trocar o relé térmico", "Havia 220 V na saída do relé térmico."],
        ],
      },
    ],
    diagnosis: {
      correct: "Botoeira S0 com contato NF permanentemente aberto (haste travada)",
      wrong: [
        ["Fusível de comando F1 aberto", "Havia 220 V medidos após F1."],
        ["Ambas as bobinas queimadas", "As bobinas não recebem tensão em razão da série aberta antes delas."],
      ],
    },
    fault: "Contato NF da botoeira de parada S0 aberto",
    technical:
      "A botoeira de parada em contato NF é elemento comum a todos os ramos do comando. Quando trava aberta, nenhum sentido é acionado. Botoeiras de emergência e parada exigem inspeção periódica, pois a falha nelas paralisa toda a máquina.",
    checklist: [
      "Identificação de elementos comuns aos dois ramos",
      "Medição de tensão progressiva na série de comando",
      "Teste do contato NF de S0",
      "Substituição da botoeira e teste dos dois sentidos",
    ],
    lessons: [
      "Lógica de série comum em comandos com múltiplos ramos",
      "Contatos NF em circuitos de parada",
      "Método de medição progressiva",
    ],
  },
  {
    id: "rv-04",
    title: "O intertravamento impede qualquer acionamento",
    level: "avancado",
    minutes: 14,
    xp: 195,
    equipment: "Mesa de rolos reversível",
    company: "Laminação Vale do Aço",
    sector: "Laminação",
    symptom:
      "Após uma manutenção no painel, nenhum sentido parte. As bobinas recebem tensão intermitente ao acionar as botoeiras.",
    objective: "Verificar se a lógica de intertravamento foi remontada corretamente.",
    steps: [
      {
        situation: "Falha surgida imediatamente após intervenção — forte indício de erro de montagem.",
        correct: "Comparar a fiação executada com o diagrama de comando original",
        wrong: [
          ["Substituir os dois contatores", "Componentes novos reproduzirão o mesmo comportamento se a lógica estiver errada."],
          ["Ajustar o relé térmico para valor máximo", "Ajuste não guarda relação com a impossibilidade de acionamento."],
        ],
      },
      {
        situation: "A conferência do diagrama revela a diferença entre o previsto e o executado.",
        reading:
          "Diagrama: NF de KM2 no ramo de KM1 e NF de KM1 no ramo de KM2. Executado: NF de KM1 no próprio ramo de KM1 e NF de KM2 no próprio ramo de KM2.",
        correct: "Simular a lógica: cada bobina abre o próprio contato NF ao atracar",
        wrong: [
          ["Retirar os contatos de intertravamento do circuito", "Removê-los elimina a proteção contra curto entre fases."],
          ["Trocar as botoeiras de posição", "As botoeiras não participam do erro de intertravamento."],
        ],
      },
    ],
    diagnosis: {
      correct: "Intertravamento invertido: cada contator abre o próprio contato NF (auto-intertravamento)",
      wrong: [
        ["Bobinas com tensão incorreta", "As bobinas atracam momentaneamente, o que comprova tensão adequada."],
        ["Botoeiras com contatos trocados", "As botoeiras energizam corretamente os ramos."],
      ],
    },
    fault: "Erro de montagem: contatos de intertravamento ligados no ramo do próprio contator",
    technical:
      "No intertravamento correto, o contato NF de um contator é inserido no ramo do outro. Ao ligar o NF no próprio ramo, o contator abre a própria alimentação ao atracar, gerando pulsos e impedindo o selo. Correção: cruzar os contatos conforme o diagrama e testar cada sentido isoladamente.",
    checklist: [
      "Comparação da montagem com o diagrama de comando",
      "Rastreio dos contatos auxiliares NF",
      "Correção do cruzamento do intertravamento",
      "Teste funcional dos dois sentidos",
    ],
    lessons: [
      "Leitura de diagramas de reversão",
      "Consequência do auto-intertravamento",
      "Verificação pós-manutenção",
    ],
  },
  {
    id: "rv-05",
    title: "Os dois contatores tentam atracar simultaneamente",
    level: "avancado",
    minutes: 13,
    xp: 200,
    equipment: "Ponte rolante 10 t",
    company: "Estaleiro Norte",
    sector: "Movimentação de carga",
    symptom:
      "Ao acionar o sentido anti-horário, KM1 e KM2 tentam fechar ao mesmo tempo, provocando estalo e atuação do disjuntor.",
    objective: "Verificar a integridade do intertravamento elétrico entre os dois contatores.",
    steps: [
      {
        situation: "Curto entre fases iminente: os dois contatores disputam o fechamento.",
        correct: "Desenergizar e testar a continuidade dos contatos NF de intertravamento KM1 21/22 e KM2 21/22",
        wrong: [
          ["Religar o disjuntor e repetir o comando", "Nova tentativa reproduz o curto entre fases e pode danificar contatores e cabos."],
          ["Aumentar a curva do disjuntor", "Mascarar a proteção diante de um curto franco é conduta inaceitável."],
        ],
      },
      {
        situation: "Os testes de continuidade evidenciam o comportamento anormal de um dos contatos.",
        reading: "KM2 21/22: abre corretamente ao acionar o contator. KM1 21/22: permanece fechado mesmo com KM1 atracado.",
        correct: "Inspecionar mecanicamente o bloco auxiliar de KM1",
        wrong: [
          ["Substituir as duas botoeiras", "As botoeiras atuam corretamente: o problema aparece com o contator já energizado."],
          ["Inverter os cabos de intertravamento", "Alterar a fiação sem diagnóstico cria uma segunda falha sobre a primeira."],
        ],
      },
    ],
    diagnosis: {
      correct: "Contato NF de intertravamento de KM1 travado fechado por bloco auxiliar danificado",
      wrong: [
        ["Falta de intertravamento mecânico", "O bloqueio mecânico existe; a falha está no contato elétrico que permite energizar as duas bobinas."],
        ["Botoeiras S1 e S2 acionadas juntas", "O comando anti-horário foi acionado isoladamente."],
      ],
    },
    fault: "Bloco auxiliar NF de KM1 danificado, anulando o intertravamento elétrico",
    technical:
      "O intertravamento elétrico impede que uma bobina seja energizada enquanto a outra estiver ativa. Com o contato NF travado fechado, ambas as bobinas podem ser alimentadas e o fechamento simultâneo provoca curto entre fases. Bloco auxiliar deve ser substituído e o intertravamento mecânico verificado como segunda barreira.",
    checklist: [
      "Desenergização imediata do painel",
      "Teste de continuidade dos contatos NF de intertravamento",
      "Inspeção do bloco auxiliar de KM1",
      "Verificação do intertravamento mecânico",
    ],
    lessons: [
      "Intertravamento elétrico versus mecânico",
      "Consequências do fechamento simultâneo de contatores",
      "Manutenção preventiva de blocos auxiliares",
    ],
  },
];
