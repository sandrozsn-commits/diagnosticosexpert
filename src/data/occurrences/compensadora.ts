import type { OccurrenceSpec } from "@/data/case-builder";

export const COMPENSADORA: OccurrenceSpec[] = [
  {
    id: "cp-01",
    title: "Motor não parte no tap reduzido",
    level: "iniciante",
    minutes: 12,
    xp: 170,
    equipment: "Motor de bomba 50 cv",
    company: "Estação de Bombeamento Norte",
    sector: "Captação",
    symptom: "Ao acionar S1, KM1 fecha o neutro do autotransformador, mas o motor não recebe tensão e não parte.",
    objective: "Verificar a energização do tap de partida do autotransformador.",
    steps: [
      {
        situation: "Neutro do autotransformador fechado; motor parado e silencioso.",
        correct: "Medir tensão na bobina do contator de tap KM2",
        wrong: [
          ["Elevar o tap de 65 % para 80 %", "Sem saber se KM2 é energizado, mudar o tap não altera o resultado."],
          ["Trocar o autotransformador T1", "Componente caro trocado sem qualquer evidência de falha."],
          ["Verificar a botoeira S0", "Se S0 estivesse aberta, o KM1 (neutro) não teria atracado."],
          ["Trocar o motor", "Nenhum contator de potência fechou ainda; o motor não é o culpado."],
        ],
      },
      {
        situation: "A medição indica se o comando alcança o contator de tap.",
        reading: "Bobina KM2 = 0 V. Contato auxiliar KM1 13/14 no ramo de KM2: sem continuidade com KM1 atracado.",
        correct: "Testar o contato auxiliar KM1 13/14 que habilita o ramo de KM2",
        wrong: [
          ["Substituir o temporizador KT1", "O temporizador atua na transição final, não na energização do tap."],
          ["Verificar o relé térmico", "O relé térmico está fechado — KM1 chegou a atracar."],
          ["Inverter as fases de comando", "Inverter fases não corrige um contato auxiliar que não fecha."],
          ["Limpar os contatos de potência de KM2", "A bobina de KM2 nem recebe tensão; limpar potência é prematuro."],
        ],
      },
    ],
    diagnosis: {
      correct: "Contato auxiliar NA de KM1 (13/14) sem fechar, impedindo a energização de KM2",
      wrong: [
        ["Autotransformador com enrolamento aberto", "O motor sequer é energizado, pois o contator de tap não fecha."],
        ["Tap incorreto selecionado", "A seleção de tap não impede a energização da bobina."],
        ["Falta de fase", "O comando KM1 atracou, logo a fase de comando está presente."],
        ["Bobina de KM2 queimada", "A bobina nem chegou a receber tensão."],
      ],
    },
    fault: "Contato auxiliar NA de KM1 defeituoso",
    technical:
      "Na chave compensadora, KM1 fecha o ponto comum do autotransformador e habilita, por contato auxiliar, o contator de tap. Um auxiliar oxidado ou desgastado interrompe a sequência sem qualquer sinalização de falha, dando a impressão de defeito no autotransformador.",
    checklist: [
      "Medição de tensão na bobina de KM2",
      "Teste do contato auxiliar KM1 13/14",
      "Substituição do bloco auxiliar",
      "Teste de partida completa em tap reduzido",
    ],
    lessons: [
      "Sequência de contatores na chave compensadora",
      "Papel dos contatos auxiliares na lógica sequencial",
      "Diagnóstico por evidência antes de trocar componentes",
    ],
  },
  {
    id: "cp-02",
    title: "Transição para tensão plena não acontece",
    level: "intermediario",
    minutes: 12,
    xp: 175,
    equipment: "Motor de ventilador 60 cv",
    company: "Fundição Ferro Novo",
    sector: "Ventilação forçada",
    symptom:
      "O motor acelera no tap reduzido, mas permanece nessa condição; o autotransformador aquece e a rotação não atinge o valor nominal.",
    objective: "Descobrir por que o contator de rede plena não é acionado ao término do tempo.",
    steps: [
      {
        situation: "Partida presa no tap reduzido, com T1 sob esforço contínuo.",
        correct: "Verificar a contagem e a saída temporizada de KT1",
        wrong: [
          ["Deixar a máquina operando no tap reduzido", "O autotransformador não é dimensionado para regime contínuo e pode queimar."],
          ["Trocar o motor de posição na linha", "A falha está na sequência de comando, não na alimentação do motor."],
          ["Substituir o contator KM1", "KM1 está operando e mantendo o tap reduzido."],
          ["Verificar a botoeira S1", "S1 iniciou a partida corretamente; o erro é na transição."],
        ],
      },
      {
        situation: "A saída temporizada é o gatilho da entrada de KM3.",
        reading: "KT1 conclui a contagem e fecha 15/18 (continuidade confirmada). Bobina de KM3 permanece com 0 V.",
        correct: "Testar o contato NF de intertravamento KM2 21/22 no ramo de KM3",
        wrong: [
          ["Substituir o temporizador KT1", "O contato temporizado fechou corretamente."],
          ["Aumentar o tempo de partida", "Prolongar o tempo agrava o aquecimento do autotransformador."],
          ["Trocar o autotransformador", "O autotransformador funciona no tap; a falha é no acionamento da rede plena."],
          ["Inverter as fases da bobina de KM3", "Bobinas de CA não têm polaridade."],
        ],
      },
    ],
    diagnosis: {
      correct: "Contato NF de intertravamento de KM2 permanentemente aberto, bloqueando o ramo de KM3",
      wrong: [
        ["Temporizador sem comutar", "A continuidade em 15/18 foi confirmada após a contagem."],
        ["Bobina de KM3 queimada", "A bobina nem chega a receber tensão."],
        ["Falta de fase na potência", "O motor gira no tap, provando que há potência."],
        ["Disjuntor de comando desarmado", "O comando está ativo no tap reduzido."],
      ],
    },
    fault: "Contato de intertravamento NF de KM2 aberto",
    technical:
      "O contato NF de KM2 protege contra a energização simultânea do tap e da rede plena. Quando esse contato fica travado aberto, o comando de KM3 nunca é habilitado e a máquina permanece em tensão reduzida, sobrecarregando o autotransformador, que possui regime de partida limitado.",
    checklist: [
      "Verificação da saída temporizada de KT1",
      "Medição de tensão na bobina de KM3",
      "Teste do contato NF de KM2",
      "Substituição do bloco auxiliar e teste de transição",
    ],
    lessons: [
      "Regime de partida de autotransformadores",
      "Intertravamento em chaves compensadoras",
      "Riscos de operação prolongada em tensão reduzida",
    ],
  },
  {
    id: "cp-03",
    title: "Partida com conjugado insuficiente e motor 'travado'",
    level: "intermediario",
    minutes: 10,
    xp: 145,
    equipment: "Motor de transportador 40 cv",
    company: "Cimento Rio Claro",
    sector: "Transporte de clínquer",
    symptom: "Após a manutenção, o motor não consegue vencer a carga na partida e permanece rosnando até o desarme.",
    objective: "Verificar a tensão efetivamente aplicada ao motor durante a partida.",
    steps: [
      {
        situation: "O motor recebe comando e tensão, mas não desenvolve conjugado suficiente.",
        correct: "Medir a tensão entre fases nos terminais do motor durante a partida",
        wrong: [
          ["Lubrificar os mancais do transportador", "A carga mecânica não mudou desde antes da manutenção."],
          ["Substituir o contator de tap", "O contator fecha corretamente e conduz corrente."],
          ["Trocar as fases de entrada", "Isso inverteria a rotação, mas não corrigiria a queda de conjugado."],
          ["Ajustar o temporizador KT1", "O problema é de força na partida, não de tempo de comutação."],
        ],
      },
      {
        situation: "A tensão medida é comparada com a esperada para o tap especificado.",
        reading: "Tensão medida na partida: 190 V (50 % de 380 V). Projeto especifica tap de 80 %.",
        correct: "Conferir em qual derivação do autotransformador os cabos estão conectados",
        wrong: [
          ["Aumentar o tempo de partida", "Prolongar a partida em tensão insuficiente apenas aquece o motor."],
          ["Reduzir o ajuste do relé térmico", "Reduzir o ajuste provocaria desarmes ainda mais rápidos."],
          ["Substituir o autotransformador", "O componente está funcionando, apenas a conexão foi feita no tap errado."],
          ["Trocar a bobina de KM1", "KM1 está operando normalmente."],
        ],
      },
    ],
    diagnosis: {
      correct: "Cabos ligados no tap de 50 % em vez do tap de 80 % previsto em projeto",
      wrong: [
        ["Motor com enrolamento danificado", "A tensão aplicada está abaixo do previsto: o conjugado reduzido é esperado."],
        ["Relé térmico com ajuste baixo", "O motor não chega a acelerar; o desarme é consequência da partida prolongada."],
        ["Falta de fase no tap", "A tensão medida foi entre fases, confirmando presença das mesmas."],
        ["Temporizador KT1 queimado", "A falha ocorre antes da transição temporizada."],
      ],
    },
    fault: "Derivação (tap) incorreta no autotransformador de partida",
    technical:
      "O conjugado de partida varia com o quadrado da tensão aplicada: no tap de 50 % o motor entrega apenas 25 % do conjugado nominal. Cargas de alta inércia exigem taps mais altos. Após qualquer manutenção no autotransformador, a derivação deve ser conferida contra o projeto.",
    checklist: [
      "Medição da tensão aplicada ao motor na partida",
      "Comparação com o tap especificado em projeto",
      "Conferência física das derivações de T1",
      "Reconexão no tap correto e novo teste",
    ],
    lessons: [
      "Relação quadrática entre tensão e conjugado",
      "Escolha de taps em chaves compensadoras",
      "Conferência pós-manutenção contra o projeto",
    ],
  },
  {
    id: "cp-04",
    title: "Autotransformador aquece excessivamente na partida",
    level: "avancado",
    minutes: 14,
    xp: 205,
    equipment: "Motor de moinho 75 cv",
    company: "Mineradora Serra Azul",
    sector: "Moagem",
    symptom:
      "Após três partidas em sequência, o autotransformador exala cheiro de verniz queimado e a temperatura do painel sobe rapidamente.",
    objective: "Avaliar o regime de manobras e o tempo de partida em relação à capacidade de T1.",
    steps: [
      {
        situation: "Aquecimento anormal do autotransformador em regime de partidas repetidas.",
        correct: "Levantar o número de partidas por hora e o tempo de cada partida",
        wrong: [
          ["Instalar um ventilador no painel", "Trata o sintoma sem corrigir o excesso de energia dissipada em T1."],
          ["Reduzir o tap para 50 %", "Tap menor reduz o conjugado, prolonga a partida e aumenta o aquecimento."],
          ["Trocar o motor por um de maior potência", "O motor não está sobrecarregado; o excesso é de partidas em T1."],
          ["Substituir os contatores de potência", "Contatores não causam aquecimento em T1 por manobras excessivas."],
        ],
      },
      {
        situation: "Os dados operacionais são comparados às especificações do fabricante.",
        reading: "Operação real: 9 partidas/hora, 14 s cada. Placa de T1: máximo 3 partidas/hora, 15 s cada.",
        correct: "Comparar o regime operacional com a placa de características de T1",
        wrong: [
          ["Substituir o relé térmico do motor", "O motor não está em sobrecarga; o problema é térmico no autotransformador."],
          ["Trocar os cabos de potência", "As seções estão adequadas e não há aquecimento nos condutores."],
          ["Inverter as fases da rede", "Isso não altera a dissipação térmica do autotransformador."],
          ["Verificar a botoeira S1", "S1 opera normalmente; o problema é a frequência de uso."],
        ],
      },
    ],
    diagnosis: {
      correct: "Regime de partidas acima do admissível para o autotransformador de partida",
      wrong: [
        ["Enrolamento de T1 em curto", "O aquecimento acompanha o número de partidas, não ocorre em regime permanente."],
        ["Tap ligado de forma incorreta", "A tensão de partida medida corresponde ao tap de 65 % especificado."],
      ],
    },
    fault: "Frequência de partidas superior ao regime nominal do autotransformador",
    technical:
      "Autotransformadores de partida são dimensionados para regime intermitente, com número limitado de manobras por hora. Excedê-lo eleva a temperatura do enrolamento além da classe de isolamento. A solução envolve rever a operação, ampliar o intervalo entre partidas ou migrar para soft starter em processos com manobras frequentes.",
    checklist: [
      "Levantamento do número e da duração das partidas",
      "Leitura da placa de características de T1",
      "Comparação com o regime admissível",
      "Proposta de adequação operacional ou tecnológica",
    ],
    lessons: [
      "Regime intermitente e classes de isolamento",
      "Escolha entre compensadora e soft starter",
      "Análise de dados operacionais no diagnóstico",
    ],
  },
  {
    id: "cp-05",
    title: "Disjuntor desarma no instante da transição",
    level: "avancado",
    minutes: 13,
    xp: 200,
    equipment: "Motor de bomba 100 cv",
    company: "Estação de Bombeamento Norte",
    sector: "Recalque",
    symptom: "A partida no tap é normal, mas no instante da passagem para tensão plena o disjuntor geral atua.",
    objective: "Analisar a sequência de abertura e fechamento dos contatores na transição.",
    steps: [
      {
        situation: "O desarme ocorre em milissegundos, no exato ponto da transição.",
        correct: "Verificar a sequência: abertura de KM1 (neutro) antes do fechamento de KM3",
        wrong: [
          ["Aumentar a corrente de ajuste do disjuntor", "Elevar a proteção diante de um pico real expõe cabos e equipamentos."],
          ["Reduzir o tempo do tap", "Tempo menor aumenta o pico, agravando o desarme."],
          ["Trocar o motor", "O motor funciona no tap; a falha é de sequência elétrica."],
          ["Verificar o relé térmico", "O desarme é pelo disjuntor (magnético), não térmico."],
        ],
      },
      {
        situation: "A conferência da lógica de transição revela como as manobras estão encadeadas.",
        reading:
          "Diagrama prevê abertura do contator de neutro antes de KM3 (transição fechada). Executado: KM1 permanece fechado quando KM3 atraca, curto-circuitando parte do enrolamento de T1.",
        correct: "Conferir o encadeamento dos contatos auxiliares na transição",
        wrong: [
          ["Substituir o disjuntor geral", "O disjuntor atua corretamente diante de uma corrente elevada real."],
          ["Trocar o motor", "O motor não participa da falha de sequência de manobra."],
          ["Limpar os contatos de KM3", "O problema é o KM1 que não abre; KM3 está fechando."],
          ["Inverter as fases no autotransformador", "Isso não corrige a sobreposição de contatores."],
        ],
      },
    ],
    diagnosis: {
      correct: "Sequência de transição incorreta: neutro do autotransformador não abre antes da entrada da rede plena",
      wrong: [
        ["Autotransformador com espiras em curto", "O curto é criado pela própria manobra, não pelo enrolamento."],
        ["Temporizador com tempo excessivo", "O tempo de tap está adequado à aceleração da carga."],
        ["Falta de fase", "Se houvesse falta de fase, o desarme não seria exclusivo da transição."],
        ["Bobina de KM3 queimada", "Se KM3 não atracasse, não haveria curto-circuito."],
      ],
    },
    fault: "Erro de sequência na transição da chave compensadora",
    technical:
      "Na transição, o contator de neutro deve abrir para que o autotransformador atue momentaneamente como reator, evitando curto entre espiras quando a rede plena é aplicada. Sem essa abertura, parte do enrolamento fica curto-circuitada e a corrente resultante provoca o desarme da proteção.",
    checklist: [
      "Análise da sequência de manobras na transição",
      "Comparação da fiação com o diagrama de projeto",
      "Correção do encadeamento dos auxiliares",
      "Teste de partida com registro de corrente",
    ],
    lessons: [
      "Transição aberta e transição fechada",
      "Função do contator de neutro em T1",
      "Leitura de diagramas de chave compensadora",
    ],
  },
];
