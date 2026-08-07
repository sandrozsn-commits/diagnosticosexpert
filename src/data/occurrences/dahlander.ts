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
];
