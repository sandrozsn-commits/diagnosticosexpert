import type { OccurrenceSpec } from "@/data/case-builder";

export const DAHLANDER_REVERSAO: OccurrenceSpec[] = [
  {
    id: "dhr-01",
    title: "Motor reverte mas perde a velocidade alta",
    level: "iniciante",
    minutes: 15,
    xp: 225,
    equipment: "Motor Dahlander 2 velocidades c/ reversão 7,5 cv",
    company: "Frigorífico Bom Pastor",
    sector: "Câmara fria — esteira reversível",
    priority: "Média",
    symptom: 'No sentido horário, as duas velocidades funcionam normalmente. No sentido anti-horário, só a velocidade baixa responde — a alta não atraca.',
    objective: "Identificar a falha isolada na lógica combinada de reversão e velocidade alta.",
    steps: [
      {
        situation: "Teste em sentido horário: S1 (baixa) e S2 (alta) operam OK. Teste anti-horário: S3 (baixa) OK, mas S4 (alta) não aciona KM4/KM5.",
        correct: "Verificar a continuidade do contato auxiliar de KM2 (sentido anti-horário) na linha de comando de alta velocidade",
        wrong: [
          ["Trocar os contatores KM4 e KM5", "Os contatores funcionam no sentido horário, então suas bobinas e contatos de potência estão bons."],
          ["Substituir o motor", "O motor opera em alta no sentido horário; a falha é no comando do sentido inverso."],
        ],
      },
      {
        situation: "A lógica exige que o contator de sentido (KM1 ou KM2) dê permissão para a velocidade.",
        reading: "Contato auxiliar NA de KM2 (sentido anti-horário) não apresenta continuidade nos bornes que alimentam a lógica de alta velocidade.",
        correct: "Inspecionar mecanicamente o bloco auxiliar lateral de KM2",
        wrong: [
          ["Trocar a botoeira S4", "A botoeira envia sinal, mas o circuito é interrompido no selo/permissão de KM2."],
          ["Verificar o relé térmico", "Se o térmico estivesse aberto, a velocidade baixa também não funcionaria."],
        ],
      },
    ],
    diagnosis: {
      correct: "Mau contato em contato auxiliar de KM2 específico para a lógica de alta velocidade",
      wrong: [
        ["Falta de fase no sentido anti-horário", "Isso impediria o motor de girar em qualquer velocidade nesse sentido."],
        ["Bobina de KM2 queimada", "KM2 atraca na velocidade baixa, logo a bobina está íntegra."],
      ],
    },
    fault: "Mau contato em contato auxiliar específico da lógica combinada (sentido anti-horário + velocidade alta)",
    technical: "Em comandos complexos como Dahlander com reversão, o contator de sentido (KM2) possui múltiplos contatos auxiliares. Se apenas o contato que libera a velocidade alta falha (oxidação ou desalinhamento), o sistema apresenta defeito apenas nessa condição específica, mantendo as outras funcionais.",
    checklist: [
      "Teste de continuidade de todos os auxiliares de KM2",
      "Limpeza de contatos auxiliares",
      "Verificação da fiação lógica entre sentido e velocidade",
      "Teste funcional em todos os 4 estados (Hor/B, Hor/A, Anti/B, Anti/A)",
    ],
    lessons: [
      "Complexidade de lógicas combinadas",
      "Diagnóstico por exclusão de condições funcionais",
      "Importância da integridade de contatos auxiliares múltiplos",
    ],
  },
  {
    id: "dhr-02",
    title: "Motor não reverte em nenhuma velocidade",
    level: "intermediario",
    minutes: 10,
    xp: 150,
    equipment: "Motor Dahlander 2 velocidades c/ reversão 5 cv",
    company: "Curtume Rio das Pedras",
    sector: "Tambor de curtimento reversível",
    priority: "Baixa",
    symptom: 'O sentido original funciona bem nas duas velocidades. Ao pressionar o botão de reversão, nada acontece — nenhum contator de sentido oposto atraca.',
    objective: "Localizar a interrupção no ramal de comando específico da reversão.",
    steps: [
      {
        situation: "Sentido original (horário) funcionando; comando anti-horário inerte.",
        correct: "Medir a tensão na entrada e saída do fusível do ramal de comando de reversão",
        wrong: [
          ["Substituir o motor Dahlander", "Se o motor funciona em um sentido, ele não é o culpado pelo comando inerte do outro."],
          ["Trocar todos os contatores", "Ação sem diagnóstico: apenas um sentido falha, focando na causa comum a esse sentido."],
        ],
      },
      {
        situation: "Verificação da alimentação do ramal de comando anti-horário.",
        reading: "Fusível de comando da reversão: Entrada = 220 V | Saída = 0 V.",
        correct: "Substituir o fusível aberto e testar a botoeira de reversão",
        wrong: [
          ["Jumpear o fusível", "Elimina a proteção e cria risco de queima de outros componentes em caso de curto."],
          ["Trocar a botoeira de sentido original", "O sentido original está operando corretamente."],
        ],
      },
    ],
    diagnosis: {
      correct: "Fusível do ramal de comando de reversão aberto",
      wrong: [
        ["Botoeira de reversão travada fechada", "Isso impediria o desligamento ou causaria curto no intertravamento, não silêncio total."],
        ["Bobinas de KM2, KM4 e KM5 queimadas simultaneamente", "Hipótese improvável frente a uma falha de alimentação comum."],
      ],
    },
    fault: "Fusível do ramal de comando de reversão aberto",
    technical: "Em chaves de reversão, é comum haver proteções separadas ou ramais distintos. Se o fusível do comando de reversão abre, as velocidades alta e baixa deixam de funcionar apenas naquele sentido, mantendo o sentido direto operacional.",
    checklist: [
      "Medição de tensão no fusível de reversão",
      "Teste de continuidade da botoeira de reversão",
      "Substituição do fusível",
      "Teste funcional de reversão",
    ],
    lessons: [
      "Ramais de comando independentes",
      "Diagnóstico por separação de funções",
      "Proteção de circuitos de manobra",
    ],
  },
  {
    id: "dhr-03",
    title: "Ao trocar de sentido rapidamente, ocorre um estalo e desarme",
    level: "intermediario",
    minutes: 13,
    xp: 205,
    equipment: "Motor Dahlander 2 velocidades c/ reversão 15 cv",
    company: "Estamparia Metal Cromo",
    sector: "Prensa reversível de estampos",
    priority: "Alta",
    symptom: 'Se o operador espera um pouco entre inverter o sentido, funciona bem. Mas se troca rápido demais, acontece um estalo forte e o disjuntor geral desarma.',
    objective: "Identificar a falha na coordenação de tempo entre as reversões.",
    steps: [
      {
        situation: "Desarme do disjuntor observado apenas em reversões bruscas.",
        correct: "Verificar a existência e o estado do temporizador de segurança entre reversões",
        wrong: [
          ["Aumentar a curva do disjuntor", "Aumentar a proteção sem tratar a causa (sobreposição de arcos) é inseguro."],
          ["Substituir os contatores de potência", "Os contatores funcionam em regime estático; o problema é dinâmico."],
        ],
      },
      {
        situation: "Análise da lógica de tempo entre o desligamento de um sentido e a entrada do outro.",
        reading: "Intertravamento elétrico NF funcionando, mas sem nenhum relé de tempo para atrasar a reversão.",
        correct: "Instalar ou reparar o temporizador de segurança (tempo morto) entre sentidos",
        wrong: [
          ["Trocar o motor", "O motor não causa curto-circuito apenas em transições rápidas se as bobinas estão boas."],
          ["Inverter as fases da rede", "Isso apenas mudaria o sentido padrão de rotação."],
        ],
      },
    ],
    diagnosis: {
      correct: "Ausência ou falha de temporizador de segurança (tempo morto) entre reversões",
      wrong: [
        ["Curto-circuito permanente no motor", "O curto ocorreria em qualquer partida, não só na reversão rápida."],
        ["Falta de intertravamento mecânico", "O intertravamento elétrico NF deveria segurar, mas o arco elétrico precisa de tempo para extinguir."],
      ],
    },
    fault: "Falta de intervalo de segurança (tempo morto) na reversão",
    technical: "O intertravamento elétrico NF impede que duas bobinas liguem juntas, mas em motores grandes o arco elétrico nos contatos de potência pode não se extinguir instantaneamente. Sem um tempo morto (50-100ms), o novo contator fecha antes do arco do anterior sumir, causando curto entre fases.",
    checklist: [
      "Verificação do temporizador de reversão",
      "Ajuste do tempo morto para extinção de arco",
      "Inspeção de câmaras de extinção dos contatores",
      "Teste de reversão rápida controlada",
    ],
    lessons: [
      "Extinção de arco elétrico em contatores",
      "Importância do tempo morto em reversões",
      "Coordenação de manobras de potência",
    ],
  },
  {
    id: "dhr-04",
    title: "Reversão desarma o disjuntor apenas em velocidade alta",
    level: "avancado",
    minutes: 15,
    xp: 230,
    equipment: "Motor Dahlander 2 velocidades c/ reversão 20 cv",
    company: "Fábrica de Papelão Vale Verde",
    sector: "Guilhotina reversível",
    priority: "Alta",
    symptom: 'Inverter o sentido em velocidade baixa funciona perfeitamente. Inverter em velocidade alta, o disjuntor geral desarma no exato instante da troca.',
    objective: "Detectar a falha de intertravamento específica da configuração de alta velocidade.",
    steps: [
      {
        situation: "Curto-circuito observado exclusivamente na manobra de reversão em alta velocidade.",
        correct: "Comparar o diagrama de intertravamento de baixa com o de alta velocidade",
        wrong: [
          ["Trocar o relé térmico da alta", "O desarme é pelo disjuntor (curto), não por sobrecarga no térmico."],
          ["Lubrificar a guilhotina", "Problema elétrico de curto-circuito evidente no instante da manobra."],
        ],
      },
      {
        situation: "Análise dos contatos auxiliares de bloqueio cruzado.",
        reading: "Intertravamento entre KM1/KM2 (sentidos em baixa) presente. Intertravamento entre KM3/KM4 (sentidos em alta) não foi executado na fiação.",
        correct: "Executar a fiação de intertravamento elétrico cruzado entre os contatores de alta",
        wrong: [
          ["Trocar o motor por um maior", "O motor atual funciona em baixa e em alta direta."],
          ["Reduzir o tempo de partida", "O tempo não substitui a proteção de intertravamento elétrico."],
        ],
      },
    ],
    diagnosis: {
      correct: "Falta de intertravamento elétrico específico para a reversão em alta velocidade",
      wrong: [
        ["Motor com enrolamento de alta em curto", "Ele funciona bem em alta se partir direto; o curto é só na reversão."],
        ["Botoeira de alta com defeito", "A botoeira liga o motor; o erro é a falta de bloqueio do sentido oposto."],
      ],
    },
    fault: "Ausência de intertravamento cruzado na lógica de alta velocidade",
    technical: "Em motores Dahlander com reversão, a lógica de intertravamento deve cobrir todas as combinações. Se os contatores de alta não forem intertravados entre si, a manobra de reversão em alta pode causar o fechamento simultâneo e curto-circuito.",
    checklist: [
      "Verificação de diagrama de comando completo",
      "Rastreio de fios de intertravamento em todos os contatores",
      "Teste de continuidade cruzada",
      "Simulação de comando com potência desligada",
    ],
    lessons: [
      "Lógicas complexas e pontos de falha",
      "Importância do intertravamento em todas as escalas",
      "Diagnóstico por comparação de estados funcionais",
    ],
  },
  {
    id: "dhr-05",
    title: "Troca de sentido demora excessivamente para ocorrer",
    level: "avancado",
    minutes: 12,
    xp: 190,
    equipment: "Motor Dahlander 2 velocidades c/ reversão 10 cv",
    company: "Serraria Pinheiral",
    sector: "Mesa de corte reversível",
    priority: "Média",
    symptom: 'A reversão funciona corretamente, mas o motor leva uns 4-5 segundos parado antes de partir no novo sentido.',
    objective: "Identificar o erro de parametrização no tempo de segurança da reversão.",
    steps: [
      {
        situation: "Atraso perceptível entre o comando e a resposta mecânica na reversão.",
        correct: "Medir o tempo de retardo no relé de tempo de reversão",
        wrong: [
          ["Substituir os contatores", "Os contatores funcionam bem; o atraso é comandado."],
          ["Verificar a tensão da rede", "A tensão não causaria um atraso lógico de 5 segundos."],
        ],
      },
      {
        situation: "Análise do ajuste do temporizador de segurança.",
        reading: "Temporizador ajustado em 5,0 segundos. Necessário para a inércia da carga: 0,5 segundos.",
        correct: "Ajustar o temporizador para o valor técnico adequado à aplicação",
        wrong: [
          ["Remover o temporizador", "A remoção elimina a segurança necessária contra arcos elétricos."],
          ["Trocar a botoeira", "A botoeira envia o sinal; o temporizador é quem segura a execução."],
        ],
      },
    ],
    diagnosis: {
      correct: "Temporizador de segurança entre reversões com ajuste de tempo excessivo",
      wrong: [
        ["Bobina do contator com fadiga", "Bobinas não 'atrasam' 5 segundos para atracar."],
        ["Mau contato no selo", "Mau contato causaria intermitência ou falha, não um atraso constante."],
      ],
    },
    fault: "Ajuste incorreto (excesso de tempo) no temporizador de reversão",
    technical: "O tempo morto em reversões serve para proteger contra arcos e reduzir estresse mecânico. No entanto, um ajuste exagerado prejudica a produtividade. O diagnóstico correto identifica que não há defeito físico, apenas um erro de configuração.",
    checklist: [
      "Cronometragem do ciclo de reversão",
      "Leitura do dial de ajuste do temporizador",
      "Cálculo do tempo morto ideal para a carga",
      "Reajuste e validação operacional",
    ],
    lessons: [
      "Parametrização de proteções temporizadas",
      "Equilíbrio entre segurança e produtividade",
      "Identificação de falhas de configuração",
    ],
  },
];
