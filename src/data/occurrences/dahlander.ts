import type { OccurrenceSpec } from "@/data/case-builder";

export const DAHLANDER: OccurrenceSpec[] = [
  {
    id: "dh-01",
    title: "O motor não muda para a velocidade alta",
    level: "intermediario",
    minutes: 12,
    xp: 180,
    equipment: "Motor Dahlander 2 velocidades 10 cv",
    company: "Têxtil Bragança",
    sector: "Tear industrial",
    priority: "Média",
    symptom: "Ao pressionar S2 (velocidade alta), KM1 (baixa) desarma normalmente, mas KM2/KM3 (alta) não atracam. O motor simplesmente para.",
    objective: "Identificar por que a transição para a velocidade alta é bloqueada no comando.",
    steps: [
      {
        situation: "KM1 desenergizado após pressionar S2; KM2 e KM3 inertes.",
        correct: "Medir a continuidade do contato NF de intertravamento KM1 (21/22) no ramo de alta",
        wrong: [
          ["Substituir o motor Dahlander", "Troca prematura: o problema parece ser na lógica de acionamento dos contatores."],
          ["Verificar a tensão nos bornes do motor", "Se os contatores não fecharam, não haverá tensão no motor por definição."],
        ],
      },
      {
        situation: "O intertravamento elétrico deve permitir a entrada da outra velocidade.",
        reading: "Contato NF KM1 21/22: circuito aberto, mesmo com KM1 desenergizado eletricamente.",
        correct: "Verificar o estado mecânico do contator KM1 e seu bloco auxiliar",
        wrong: [
          ["Trocar a botoeira S2", "S2 funcionou ao desenergizar KM1; o bloqueio está adiante."],
          ["Jumpear o intertravamento de KM1", "Risco grave: se KM1 estiver realmente travado fechado, o jumper causará um curto-circuito."],
        ],
      },
    ],
    diagnosis: {
      correct: "Contato NF de intertravamento de KM1 não retorna a tempo (KM1 travado mecanicamente)",
      wrong: [
        ["Bobinas de KM2 e KM3 queimadas", "Pouco provável que duas bobinas falhem simultaneamente sem comando."],
        ["Disjuntor de comando Q1 aberto", "KM1 chegou a atracar e desatracar, logo há tensão no comando."],
      ],
    },
    fault: "Contator KM1 travado mecanicamente (contatos soldados ou trava física)",
    technical: "O intertravamento elétrico NF de KM1 impede a energização de KM2/KM3. Se KM1 trava mecanicamente fechado (ou seus contatos soldam), o NF permanece aberto, bloqueando a velocidade alta para evitar curto entre enrolamentos.",
    checklist: [
      "Teste de continuidade do intertravamento NF de KM1",
      "Inspeção visual da armadura de KM1",
      "Teste de continuidade dos contatos principais de KM1 em repouso",
      "Substituição do contator defeituoso",
    ],
    lessons: [
      "Lógica de intertravamento em motores de duas velocidades",
      "Falhas mecânicas versus falhas elétricas em contatores",
      "Segurança na transição de enrolamentos Dahlander",
    ],
  },
  {
    id: "dh-02",
    title: "Motor liga direto em alta velocidade e dispara proteção",
    level: "avancado",
    minutes: 15,
    xp: 220,
    equipment: "Motor Dahlander 2 velocidades 15 cv",
    company: "Papel & Celulose Rio Verde",
    sector: "Linha de bobinamento",
    priority: "Alta",
    symptom: "Ao acionar S1 (baixa), o motor parte normalmente por 1 segundo, depois KM2 e KM3 atracam junto com KM1 ainda fechado, e o disjuntor geral desarma.",
    objective: "Investigar a falha de intertravamento que permitiu o fechamento simultâneo.",
    steps: [
      {
        situation: "Desarme violento do disjuntor após 1 segundo de operação em baixa.",
        correct: "Desenergizar o painel e testar a continuidade do contato NF de KM1 (intertravamento)",
        wrong: [
          ["Religar o disjuntor para ver o que acontece", "Conduta perigosa: novo curto-circuito pode destruir os contatores ou o motor."],
          ["Trocar o relé térmico FT1", "O desarme foi pelo disjuntor (curto), não por sobrecarga no térmico."],
        ],
      },
      {
        situation: "O intertravamento deveria ter impedido a entrada de KM2/KM3.",
        reading: "Contato NF de KM1: Continuidade zero (curto) mesmo com KM1 atracado manualmente.",
        correct: "Inspecionar o bloco de contatos auxiliares de KM1",
        wrong: [
          ["Inverter as fases na entrada do motor", "A inversão de fases não corrige uma falha de intertravamento elétrico."],
          ["Substituir a botoeira S1", "S1 iniciou a sequência corretamente; a falha é na proteção entre estágios."],
        ],
      },
    ],
    diagnosis: {
      correct: "Falha no intertravamento elétrico (contato NF de KM1 soldado fechado)",
      wrong: [
        ["Motor com enrolamento em curto", "O curto ocorreu apenas quando o segundo estágio tentou entrar."],
        ["Temporizador de transição defeituoso", "Motores Dahlander simples muitas vezes não usam temporizador, mas intertravamento direto."],
      ],
    },
    fault: "Contato auxiliar NF de KM1 soldado fechado",
    technical: "A soldagem do contato NF de intertravamento permite que KM2/KM3 sejam energizados enquanto KM1 ainda está fechado. Em motores Dahlander, isso resulta em um curto-circuito entre as derivações de baixa e alta velocidade.",
    checklist: [
      "Teste de continuidade dos auxiliares de intertravamento",
      "Inspeção de arcos elétricos nos blocos auxiliares",
      "Substituição do bloco de contatos de KM1",
      "Verificação do intertravamento mecânico",
    ],
    lessons: [
      "Consequência de falha em intertravamentos elétricos",
      "Diagnóstico de contatos auxiliares soldados",
      "Riscos de curto entre enrolamentos Dahlander",
    ],
  },
  {
    id: "dh-03",
    title: "Motor não parte em nenhuma das duas velocidades",
    level: "iniciante",
    minutes: 9,
    xp: 135,
    equipment: "Motor Dahlander 2 velocidades 7,5 cv",
    company: "Confecções Ipê Verde",
    sector: "Sala de corte automatizado",
    priority: "Baixa",
    symptom: "Nem S1 (baixa) nem S2 (alta) fazem qualquer efeito. Nenhum contator atraca, nenhum ruído no painel, sinaleira apagada.",
    objective: "Identificar a falha na alimentação comum do circuito de comando.",
    steps: [
      {
        situation: "Painel energizado, mas sem resposta às botoeiras S1 e S2.",
        correct: "Medir a tensão na entrada e saída dos fusíveis de comando F1/F2",
        wrong: [
          ["Trocar o motor Dahlander", "Ação precipitada: se os contatores não atracam, o problema é no comando."],
          ["Substituir as botoeiras S1 e S2", "Pouco provável que ambas as botoeiras falhem simultaneamente."],
        ],
      },
      {
        situation: "Verificação da integridade dos fusíveis de proteção do comando.",
        reading: "Tensão na entrada de F1: 220 V. Tensão na saída de F1: 0 V.",
        correct: "Substituir o fusível F1 e investigar a causa da abertura",
        wrong: [
          ["Jumpear o fusível F1", "Extremamente perigoso: elimina a proteção contra curtos no comando."],
          ["Trocar o contator KM1", "A falta de tensão na saída do fusível indica que o defeito é anterior aos contatores."],
        ],
      },
    ],
    diagnosis: {
      correct: "Fusível de comando F1 aberto",
      wrong: [
        ["Falta de fase na rede principal", "Se houvesse falta de fase, a sinaleira de painel ligado (se em outra fase) poderia estar acesa, mas aqui tudo está morto."],
        ["Botoeira S0 travada aberta", "S0 interromperia o circuito, mas a medição no fusível já confirmou a falha antes dela."],
      ],
    },
    fault: "Fusível de comando (F1 ou F2) aberto",
    technical: "O fusível de comando protege todo o circuito de manobra. Quando ele abre, toda a lógica (baixa e alta velocidade) perde alimentação. Em um motor Dahlander, como o comando compartilha a mesma proteção, a falha silencia o painel por completo.",
    checklist: [
      "Teste de continuidade dos fusíveis de comando",
      "Medição de tensão nos bornes de entrada/saída de proteção",
      "Inspeção por curtos-circuitos na fiação de comando",
      "Substituição por fusível de mesma capacidade",
    ],
    lessons: [
      "Importância da proteção do circuito de comando",
      "Diagnóstico de falhas em ramais comuns",
      "Procedimentos de segurança em medição de painéis",
    ],
  },
  {
    id: "dh-04",
    title: "Troca de velocidade com solavanco e ruído forte",
    level: "intermediario",
    minutes: 13,
    xp: 195,
    equipment: "Motor Dahlander 2 velocidades 12,5 cv",
    company: "Indústria de Plásticos Rio Bonito",
    sector: "Extrusora",
    priority: "Média",
    symptom: "A baixa velocidade funciona bem. Ao acionar S2 para trocar para alta, o motor dá um solavanco brusco, faz um estalo alto, e só depois estabiliza.",
    objective: "Diagnosticar a falha na transição entre os enrolamentos Dahlander.",
    steps: [
      {
        situation: "Transição abrupta observada entre KM1 e KM2/KM3.",
        correct: "Verificar a existência e o ajuste do temporizador de transição (se houver) ou o estado dos intertravamentos",
        wrong: [
          ["Trocar os rolamentos do motor", "O ruído e solavanco ocorrem apenas na troca de velocidade, sugerindo falha elétrica."],
          ["Reduzir a carga da extrusora", "A carga não justifica o solavanco elétrico na transição de polos."],
        ],
      },
      {
        situation: "Análise da lógica de tempo entre o desligamento de KM1 e o fechamento de KM2/KM3.",
        reading: "KM2 e KM3 atracam quase instantaneamente após a abertura de KM1, sem o intervalo de segurança recomendado.",
        correct: "Instalar ou ajustar o relé de tempo para garantir um 'tempo morto' de 50ms a 100ms",
        wrong: [
          ["Trocar o contator KM1", "KM1 está abrindo corretamente; o problema é a velocidade do fechamento dos próximos."],
          ["Inverter as fases da velocidade alta", "Inverter fases mudaria o sentido de giro, não suavizaria a transição."],
        ],
      },
    ],
    diagnosis: {
      correct: "Ausência de tempo morto na transição entre velocidades",
      wrong: [
        ["KM1 e KM2 fechando juntos (curto)", "Se fechassem juntos, o disjuntor desarmaria violentamente, não haveria estabilização."],
        ["Falta de fase na velocidade alta", "Causaria ronco contínuo e falta de torque, não apenas um solavanco na partida."],
      ],
    },
    fault: "Falta de intervalo de segurança (tempo morto) na transição Dahlander",
    technical: "Motores Dahlander requerem uma pequena pausa (centenas de milissegundos) na troca de polos para permitir o decaimento do campo magnético residual. Sem essa pausa, a reenergização em nova configuração gera picos de corrente e estresse mecânico (solavanco).",
    checklist: [
      "Verificação do temporizador de transição",
      "Ajuste da lógica de comando para incluir retardo",
      "Inspeção de contatos auxiliares",
      "Medição de corrente de pico na transição",
    ],
    lessons: [
      "Campo magnético residual em motores CA",
      "Necessidade de tempo morto em chaves de polos",
      "Diferença entre transição aberta e fechada",
    ],
  },
  {
    id: "dh-05",
    title: "Motor esquenta excessivamente em velocidade baixa, mas funciona normal em alta",
    level: "avancado",
    minutes: 14,
    xp: 210,
    equipment: "Motor Dahlander 2 velocidades 10 cv",
    company: "Frigorífico Serra Fria",
    sector: "Câmara de resfriamento — ventilador",
    priority: "Média",
    symptom: "Em velocidade alta opera normal. Em velocidade baixa, o relé térmico FT1 desarma por sobrecorrente em menos de 20 minutos.",
    objective: "Identificar o erro de parametrização da proteção térmica em baixa velocidade.",
    steps: [
      {
        situation: "Desarme do térmico FT1 apenas na condição de baixa velocidade.",
        correct: "Medir a corrente real de linha em baixa velocidade e comparar com o ajuste de FT1",
        wrong: [
          ["Substituir o motor por um maior", "O motor funciona bem em alta; a potência parece adequada."],
          ["Limpar as pás do ventilador", "Se fosse sujeira/carga, o problema persistiria ou pioraria na velocidade alta."],
        ],
      },
      {
        situation: "Conferência do ajuste de corrente no dial do relé térmico FT1.",
        reading: "Corrente medida em baixa: 12 A. Ajuste no dial de FT1: 9 A. Placa do motor indica In (baixa) = 12,5 A.",
        correct: "Corrigir o ajuste do relé térmico FT1 para o valor nominal de placa",
        wrong: [
          ["Trocar FT1 por um de mesma faixa", "O problema é o ajuste configurado, não o componente físico."],
          ["Colocar FT1 em modo manual", "O modo de reset não altera a curva de disparo térmico."],
        ],
      },
    ],
    diagnosis: {
      correct: "Relé térmico FT1 ajustado abaixo da corrente nominal nominal em baixa",
      wrong: [
        ["Motor com enrolamento de baixa queimado", "Se estivesse queimado, haveria desequilíbrio de fases e o motor nem rodaria 20 min."],
        ["Queda de tensão na rede", "A queda afetaria ambas as velocidades, não apenas a baixa."],
      ],
    },
    fault: "Erro de ajuste (setpoint) no relé térmico da velocidade baixa",
    technical: "Em motores Dahlander, a corrente nominal em baixa velocidade (ligação triângulo) é diferente da corrente em alta (estrela dupla). Se o eletricista ajustar ambos os térmicos com base no maior valor ou errar o cálculo para a ligação de baixa, ocorrerão disparos indevidos por sobrecarga inexistente.",
    checklist: [
      "Conferência de dados de placa do motor (In baixa vs In alta)",
      "Medição de corrente com alicate amperímetro",
      "Ajuste preciso dos relés térmicos FT1 e FT2",
      "Teste de elevação de temperatura do motor",
    ],
    lessons: [
      "Parametrização de proteções em motores multi-velocidade",
      "Diferença de correntes nominais em enrolamentos Dahlander",
      "Importância da leitura correta da placa do motor",
    ],
  },
];
