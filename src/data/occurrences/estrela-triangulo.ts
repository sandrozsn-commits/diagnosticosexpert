import type { OccurrenceSpec } from "@/data/case-builder";

export const ESTRELA_TRIANGULO: OccurrenceSpec[] = [
  {
    id: "yd-01",
    title: "Não ocorre a transição de estrela para triângulo",
    level: "iniciante",
    minutes: 12,
    xp: 165,
    equipment: "Motor trifásico 20 cv",
    company: "Cerâmica Monte Verde",
    sector: "Moagem",
    symptom:
      "O motor parte em estrela e permanece indefinidamente nessa condição, com rotação reduzida e ruído constante.",
    objective: "Verificar por que o comando de comutação temporizada não é emitido.",
    steps: [
      {
        situation: "KM1 e KM2 energizados; KM3 nunca atraca.",
        correct: "Observar o LED de contagem e o ajuste de tempo do temporizador KT1",
        wrong: [
          ["Substituir o contator KM3", "Antes é preciso saber se o comando de comutação chega até a bobina de KM3."],
          ["Reduzir a carga da máquina", "A carga não impede a comutação temporizada do comando."],
        ],
      },
      {
        situation: "O temporizador é a origem do comando de transição.",
        reading: "KT1 alimentado (LED de rede aceso), tempo ajustado em 7 s, LED de saída permanece apagado após 30 s.",
        correct: "Medir continuidade do contato temporizado 15/18 de KT1 ao final da contagem",
        wrong: [
          ["Ajustar o tempo para o valor mínimo", "Se a saída não comuta, qualquer tempo continuará sem efeito."],
          ["Trocar a bobina de KM2", "KM2 está operando corretamente em estrela."],
        ],
      },
    ],
    diagnosis: {
      correct: "Temporizador KT1 com contato de saída 15/18 sem comutar (relé interno defeituoso)",
      wrong: [
        ["Bobina de KM3 queimada", "A bobina não recebe comando, pois o contato temporizado não fecha."],
        ["Intertravamento KM2/KM3 aberto", "O intertravamento apenas atuaria após a saída do temporizador comutar."],
      ],
    },
    fault: "Relé temporizador KT1 com saída travada",
    technical:
      "Na partida estrela-triângulo, o temporizador comanda a saída de KM2 e a entrada de KM3 após o tempo de aceleração. Com o contato temporizado inoperante, o motor permanece em estrela, com conjugado reduzido a um terço, aquecendo e podendo não atingir a rotação nominal.",
    checklist: [
      "Verificação de alimentação e ajuste de KT1",
      "Observação do LED de saída ao fim da contagem",
      "Teste de continuidade do contato 15/18",
      "Substituição do temporizador e teste da comutação",
    ],
    lessons: [
      "Função do temporizador na partida Y/Δ",
      "Conjugado reduzido em ligação estrela",
      "Teste de contatos temporizados",
    ],
  },
  {
    id: "yd-02",
    title: "Temporizador não inicia a contagem na partida",
    level: "intermediario",
    minutes: 10,
    xp: 140,
    equipment: "Motor de misturador 15 cv",
    company: "Alimentos Vale Claro",
    sector: "Preparo de massa",
    symptom:
      "Ao pressionar S1, KM1 atraca, mas o temporizador permanece apagado e nenhuma etapa seguinte acontece.",
    objective: "Verificar a alimentação do relé temporizador no circuito de comando.",
    steps: [
      {
        situation: "Contator principal fechado; temporizador sem sinalização.",
        correct: "Medir tensão nos bornes de alimentação A1/A2 do temporizador KT1",
        wrong: [
          ["Girar o ajuste de tempo para conferir resposta", "Sem alimentação, o ajuste não produz efeito algum."],
          ["Trocar o contator KM1", "KM1 atracou normalmente."],
        ],
      },
      {
        situation: "A ausência de tensão leva ao rastreio da fiação até o temporizador.",
        reading: "A1/A2 de KT1 = 0 V com KM1 atracado. Borne de origem no barramento de comando: 220 V.",
        correct: "Rastrear o condutor de alimentação entre o barramento e o borne A1",
        wrong: [
          ["Substituir o temporizador", "O temporizador não está alimentado; a substituição não muda nada."],
          ["Testar as botoeiras", "O comando funcionou: KM1 está energizado."],
        ],
      },
    ],
    diagnosis: {
      correct: "Condutor de alimentação do temporizador desconectado no borne A1",
      wrong: [
        ["Temporizador com defeito interno", "Há 0 V na entrada: o componente sequer foi alimentado."],
        ["Contato de selo de KM1 aberto", "KM1 permanece atracado após soltar a botoeira."],
      ],
    },
    fault: "Cabo de alimentação de KT1 solto no borne A1",
    technical:
      "Terminais frouxos são causa recorrente após vibração ou manutenção. A verificação de tensão diretamente nos bornes do componente separa falha de alimentação de falha interna, evitando trocas indevidas e reduzindo o tempo de parada.",
    checklist: [
      "Medição de tensão nos bornes do temporizador",
      "Confirmação de tensão no barramento de comando",
      "Rastreio e reaperto do condutor",
      "Teste do ciclo completo de partida",
    ],
    lessons: [
      "Verificação de alimentação antes de substituir componentes",
      "Torque e inspeção de bornes",
      "Leitura de bornes A1/A2 in relés",
    ],
  },
  {
    id: "yd-03",
    title: "Contator triângulo não atraca após o tempo",
    level: "intermediario",
    minutes: 11,
    xp: 165,
    equipment: "Motor de compressor 30 cv",
    company: "Ar Comprimido Industrial",
    sector: "Central de utilidades",
    symptom:
      "O temporizador atinge o tempo, KM2 abre e o motor perde tensão. KM3 não atraca e a máquina para completamente.",
    objective: "Determinar por que o ramo de triângulo não é energizado após a comutação.",
    steps: [
      {
        situation: "A estrela é desfeita corretamente, mas o triângulo não entra.",
        correct: "Medir tensão na bobina de KM3 no instante da comutação",
        wrong: [
          ["Substituir o temporizador", "O temporizador comutou: KM2 foi desenergizado no tempo ajustado."],
          ["Reduzir o tempo de estrela", "O tempo não interfere na energização da bobina de KM3."],
        ],
      },
      {
        situation: "A tensão da bobina indica se o comando chega ao contator.",
        reading: "Bobina KM3 A1/A2 = 220 V presentes no instante da comutação, contator não atraca. Resistência da bobina: infinita.",
        correct: "Medir a resistência ôhmica da bobina de KM3 desenergizada",
        wrong: [
          ["Verificar o intertravamento com KM2", "A bobina recebe a tensão nominal: o intertravamento está fechado."],
          ["Trocar os fusíveis de comando", "Há tensão plena disponível na bobina."],
        ],
      },
    ],
    diagnosis: {
      correct: "Bobina do contator triângulo KM3 queimada (circuito aberto)",
      wrong: [
        ["Contato temporizado defeituoso", "O contato temporizado entregou 220 V na bobina."],
        ["Intertravamento KM2 aberto", "Se estivesse aberto, não haveria tensão na bobina."],
      ],
    },
    fault: "Bobina de KM3 em circuito aberto",
    technical:
      "Bobina com resistência infinita indica enrolamento interrompido, geralmente por sobretensão, sobreaquecimento ou envelhecimento. Diante de tensão nominal presente e contator inerte, a medição ôhmica confirma o diagnóstico com segurança e evita substituições desnecessárias.",
    checklist: [
      "Medição de tensão na bobina no instante da comutação",
      "Medição de resistência da bobina desenergizada",
      "Comparação com o valor típico do modelo",
      "Substituição do contator e teste completo do ciclo",
    ],
    lessons: [
      "Ensaio ôhmico de bobinas de contatores",
      "Diferenciar falha de comando de falha de componente",
      "Causas de queima de bobinas",
    ],
  },
  {
    id: "yd-04",
    title: "Contator estrela permanece energizado após a comutação",
    level: "avancado",
    minutes: 13,
    xp: 205,
    equipment: "Motor de exaustor 25 cv",
    company: "Fundição Ferro Novo",
    sector: "Exaustão de gases",
    symptom:
      "No instante da transição há um estalo violento no painel e a proteção geral atua. KM2 e KM3 aparecem fechados juntos.",
    objective: "Verificar por que a estrela não é desfeita antes da entrada do triângulo.",
    steps: [
      {
        situation: "Fechamento simultâneo de estrela e triângulo equivale a um curto entre fases.",
        correct: "Desenergizar e verificar mecanicamente se KM2 retorna ao repouso ao desenergizar a bobina",
        wrong: [
          ["Religar e observar novamente o estalo", "Repetir a falha submete a instalação a novo curto franco."],
          ["Aumentar o tempo do temporizador", "O tempo não corrige o fechamento simultâneo dos contatores."],
        ],
      },
      {
        situation: "O teste mecânico revela o comportamento do contator estrela.",
        reading: "Bobina de KM2 with 0 V, porém a armadura permanece atracada. Retorno só ocorre com esforço manual.",
        correct: "Inspecionar mola de retorno e guias do contator KM2",
        wrong: [
          ["Substituir o temporizador KT1", "O temporizador comutou corretamente no tempo previsto."],
          ["Refazer o intertravamento elétrico", "O intertravamento elétrico não impede o travamento mecânico da armadura."],
        ],
      },
    ],
    diagnosis: {
      correct: "Contator KM2 travado mecanicamente (mola de retorno rompida)",
      wrong: [
        ["Contato temporizado com atraso excessivo", "O tempo de comutação medido está correto."],
        ["Curto na fiação de comando", "A bobina de KM2 está comprovadamente desenergizada."],
      ],
    },
    fault: "Travamento mecânico do contator estrela KM2",
    technical:
      "Se o contator estrela não abre ao ser desenergizado, o fechamento do contator triângulo curto-circuita as fases. A mola de retorno, poeira metálica e guias desgastadas são causas frequentes em ambientes de fundição. Além da troca do contator, o intertravamento elétrico e a limpeza do painel devem ser revistos.",
    checklist: [
      "Bloqueio do painel após identificação do curto",
      "Teste de retorno mecânico de KM2 sem tensão",
      "Inspeção de mola e guias",
      "Substituição do contator e limpeza do painel",
    ],
    lessons: [
      "Consequência do fechamento simultâneo Y e Δ",
      "Manutenção mecânica de contatores",
      "Ambientes agressivos e desgaste de componentes",
    ],
  },
  {
    id: "yd-05",
    title: "Motor desarma durante a comutação",
    level: "avancado",
    minutes: 14,
    xp: 210,
    equipment: "Motor de britador 40 cv",
    company: "Mineradora Serra Azul",
    sector: "Britagem primária",
    symptom: "A partida em estrela é normal, mas no instante da troca para triângulo o disjuntor de potência desarma.",
    objective: "Avaliar o tempo de estrela e a sobrecorrente no instante da comutação.",
    steps: [
      {
        situation: "A falha acontece exatamente no instante da transição.",
        correct: "Cronometrar o tempo ajustado em KT1 e comparar com o tempo de aceleração da carga",
        wrong: [
          ["Aumentar a curva de disparo do disjuntor", "Mascarar o disparo sem entender a sobrecorrente é conduta inaceitável."],
          ["Substituir o contator triângulo", "O contator fecha corretamente no instante da comutação."],
        ],
      },
      {
        situation: "Os tempos medidos revelam a inadequação do ajuste.",
        reading: "Tempo de KT1: 3 s. Tempo de aceleração da carga até 90 % da rotação: 11 s. Corrente na comutação: 6,4 × In.",
        correct: "Verificar o tempo de transição morta entre a abertura de KM2 e o fechamento de KM3",
        wrong: [
          ["Trocar o motor por um de maior potência", "O motor está adequado à carga: o problema é o instante da comutação."],
          ["Reapertar os cabos de potência", "Não há evidência de mau contato nas leituras."],
        ],
      },
    ],
    diagnosis: {
      correct: "Tempo de estrela insuficiente para a inércia da carga, gerando pico de corrente na comutação",
      wrong: [
        ["Disjuntor subdimensionado", "A corrente medida de 6,4 × In justifica a atuação de qualquer proteção correta."],
        ["Contator estrela com contatos colados", "KM2 abre corretamente antes do fechamento de KM3."],
      ],
    },
    fault: "Ajuste de tempo do temporizador incompatível com a inércia da carga",
    technical:
      "Comutar para triângulo antes que o motor atinga cerca de 90 % da rotação nominal produz pico de corrente próximo ao de uma partida direta. O tempo de estrela deve ser ajustado ao tempo real de aceleração da carga, respeitando também a transição morta de 30 a 100 ms entre KM2 e KM3.",
    checklist: [
      "Medição do tempo de aceleração da carga",
      "Comparação com o tempo ajustado em KT1",
      "Medição da corrente no instante da comutação",
      "Reajuste do tempo e verificação da transição morta",
    ],
    lessons: [
      "Critérios de ajuste do tempo de estrela",
      "Transição morta em partidas Y/Δ",
      "Relação entre inércia da carga e corrente de comutação",
    ],
  },
];
