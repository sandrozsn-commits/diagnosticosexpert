import type { OccurrenceSpec } from "@/data/case-builder";

export const ROTOR_BOBINADO_REVERSAO: OccurrenceSpec[] = [
  {
    id: "rbr-01",
    title: "Motor reverte com vibração forte e corrente elevada",
    level: "iniciante",
    minutes: 13,
    xp: 195,
    equipment: "Motor rotor bobinado c/ reversão 40 cv",
    company: "Estaleiro Baía Sul",
    sector: "Guincho de içamento",
    priority: "Alta",
    symptom: 'Ao inverter o sentido de giro, o motor vibra fortemente nos primeiros segundos e a corrente no amperímetro passa muito acima do normal.',
    objective: "Detectar por que a resistência rotórica não está sendo reinserida na reversão.",
    steps: [
      {
        situation: "Partida inicial OK. Ao comandar a reversão, o tranco é excessivo e o amperímetro 'escala'.",
        correct: "Verificar se o contator de curto-circuitamento KM3 desatracou durante a manobra de reversão",
        wrong: [
          ["Inverter as fases de entrada", "As fases já são invertidas por KM1/KM2; inverter na entrada apenas mudaria o sentido padrão."],
          ["Substituir o banco de resistores", "Se o motor parte bem na primeira vez, os resistores estão íntegros."],
        ],
      },
      {
        situation: "O contator KM3 deve abrir (inserir resistência) sempre que houver troca de sentido.",
        reading: "KM3 permanece atracado (soldado ou travado) mesmo quando KM1/KM2 trocam de estado.",
        correct: "Desenergizar e testar a continuidade dos contatos de potência de KM3",
        wrong: [
          ["Trocar o temporizador de aceleração", "O temporizador comanda o fechamento, mas a falha aqui é o não-abertura mecânica."],
          ["Aumentar o ajuste do relé térmico", "Medida perigosa que esconde o sintoma e pode queimar o motor."],
        ],
      },
    ],
    diagnosis: {
      correct: "Contator KM3 (curto-circuito rotórico) não retorna, mantendo o rotor em curto na reversão",
      wrong: [
        ["Curto-circuito entre anéis coletores", "Causaria falha em ambos os sentidos e provavelmente um estouro imediato."],
        ["Escovas presas nos porta-escovas", "Causaria falta de fase no rotor (falta de torque), não excesso de corrente."],
      ],
    },
    fault: "Contator KM3 travado fechado (contatos soldados ou trava mecânica)",
    technical: "Motores de rotor bobinado devem sempre ter as resistências inseridas durante partidas e reversões para limitar a corrente e garantir torque suave. Se KM3 solda e mantém o rotor em curto, a reversão ocorre sob tensão plena e sem resistência, resultando em altíssima corrente e estresse mecânico.",
    checklist: [
      "Teste de continuidade de KM3 desenergizado",
      "Inspeção visual de soldagem de contatos",
      "Verificação da lógica de intertravamento de KM3",
      "Teste de operação do guincho sem carga",
    ],
    lessons: [
      "Função limitadora da resistência rotórica",
      "Riscos de reversão com rotor em curto",
      "Manutenção de contatores de alta corrente",
    ],
  },
  {
    id: "rbr-02",
    title: "Motor não reverte em nenhum sentido",
    level: "intermediario",
    minutes: 10,
    xp: 150,
    equipment: "Motor rotor bobinado c/ reversão 35 cv",
    company: "Porto Industrial Baía Norte",
    sector: "Guincho reversível de carga",
    priority: "Baixa",
    symptom: 'O sentido original funciona normalmente. O botão de reversão não tem nenhum efeito — o motor simplesmente continua no mesmo sentido ou não faz nada.',
    objective: "Identificar a falha no ramal de comando de reversão.",
    steps: [
      {
        situation: "Sentido direto operando; comando de inversão inoperante.",
        correct: "Verificar a tensão no fusível do ramal de comando de reversão",
        wrong: [
          ["Inspecionar as escovas do motor", "Se o comando nem atracou os contatores de sentido, as escovas não são o problema inicial."],
          ["Medir a resistência do rotor", "Falha de comando deve ser investigada no painel primeiro."],
        ],
      },
      {
        situation: "Análise da proteção do ramal de comando de reversão.",
        reading: "Tensão na saída do fusível de reversão: 0 V. Botoeira de reversão sem sinalização.",
        correct: "Substituir o fusível aberto e verificar possível curto no ramal",
        wrong: [
          ["Trocar a botoeira de sentido original", "O sentido original funciona; a botoeira dele está boa."],
          ["Trocar o banco de resistores", "Resistores não impedem o atracamento dos contatores de comando."],
        ],
      },
    ],
    diagnosis: {
      correct: "Fusível do ramal de comando de reversão aberto",
      wrong: [
        ["Bobina de KM2 queimada", "Um fusível aberto explica o comando morto sem precisar queimar a bobina."],
        ["Falta de fase no motor", "O comando funcionaria (atracaria contatores) mesmo com falta de fase."],
      ],
    },
    fault: "Fusível de proteção do ramal de comando de reversão aberto",
    technical: "A separação de ramais de comando permite que falhas em um sentido não afetem o outro. O diagnóstico deve sempre começar pela fonte de alimentação do trecho inoperante.",
    checklist: [
      "Teste de fusíveis de comando",
      "Medição de tensão no ramal de reversão",
      "Verificação de bornes de botoeira",
      "Teste funcional completo",
    ],
    lessons: [
      "Isolamento de falhas por ramais de comando",
      "Importância da proteção seletiva",
      "Sequência lógica de diagnóstico em painéis",
    ],
  },
  {
    id: "rbr-03",
    title: "Motor demora para acelerar após reverter, com ruído constante",
    level: "intermediario",
    minutes: 13,
    xp: 200,
    equipment: "Motor rotor bobinado c/ reversão 55 cv",
    company: "Estaleiro Costa Azul",
    sector: "Pórtico rolante",
    priority: "Alta",
    symptom: 'Depois de reverter o sentido, o motor demora bem mais que o normal para atingir a rotação final, e faz um ruído constante e incômodo.',
    objective: "Detectar a resistência residual no circuito rotórico.",
    steps: [
      {
        situation: "Motor rodando com aceleração lenta e ruído vibratório.",
        correct: "Medir a queda de tensão sobre os contatos de potência de KM3 (curto-circuito)",
        wrong: [
          ["Lubrificar o pórtico", "O ruído e a lentidão surgiram após a reversão, indicando causa elétrica."],
          ["Trocar o banco de resistores", "Os resistores estão sendo retirados, mas algo mantém a resistência no circuito."],
        ],
      },
      {
        situation: "Análise da qualidade do contato de curto-circuitamento.",
        reading: "Queda de tensão medida em KM3: 15 V (fase L2) e 0,2 V nas outras. Contatos visivelmente escurecidos.",
        correct: "Substituir o contator KM3 ou limpar/substituir os contatos de potência",
        wrong: [
          ["Trocar as escovas", "Se o motor acelerou parcialmente, as escovas estão conduzindo."],
          ["Aumentar o ajuste do térmico", "Isso esconde o problema de sub-rotação e sobreaquecimento."],
        ],
      },
    ],
    diagnosis: {
      correct: "Contato de força de KM3 parcialmente carbonizado/oxidado",
      wrong: [
        ["Falta de fase no rotor", "Causaria uma perda de torque muito mais severa e vibração forte."],
        ["Banco de resistores em aberto", "O motor nem partiria se o banco estivesse aberto."],
      ],
    },
    fault: "Resistência de contato elevada no contator de curto-circuitamento KM3",
    technical: "A carbonização dos contatos cria uma resistência parasita. Mesmo com o contator fechado, o rotor não fica em curto total, operando com uma resistência residual que limita o torque, reduz a velocidade final e provoca ruído magnético por desequilíbrio.",
    checklist: [
      "Medição de queda de tensão em contatos fechados",
      "Inspeção visual de queima/oxidação",
      "Teste de continuidade ôhmica de baixa resistência",
      "Substituição do contator de aceleração",
    ],
    lessons: [
      "Impacto da resistência de contato em circuitos de alta corrente",
      "Efeitos de rotor não curto-circuitado totalmente",
      "Diagnóstico por medição de queda de tensão",
    ],
  },
  {
    id: "rbr-04",
    title: "Contator de reversão atraca, mas o motor não inverte o sentido",
    level: "avancado",
    minutes: 15,
    xp: 235,
    equipment: "Motor rotor bobinado c/ reversão 45 cv",
    company: "Indústria Naval Sul",
    sector: "Talha de manutenção",
    priority: "Alta",
    symptom: 'Ao pressionar o botão de reversão, o contator do sentido oposto atraca normalmente, mas o motor continua girando no mesmo sentido.',
    objective: "Identificar o erro de fiação na inversão de fases.",
    steps: [
      {
        situation: "Contator KM2 atracado, mas rotação mecânica permanece inalterada.",
        correct: "Conferir a fiação das fases entre KM1 e KM2 na entrada e saída",
        wrong: [
          ["Trocar o motor", "O motor responde ao campo girante que recebe; ele não decide o sentido sozinho."],
          ["Substituir as botoeiras", "As botoeiras estão ativando os contatores corretos."],
        ],
      },
      {
        situation: "Rastreio físico das conexões de potência.",
        reading: "KM1: L1-L2-L3. KM2: L1-L2-L3 (fases ligadas na mesma sequência em ambos os contatores).",
        correct: "Corrigir a fiação de KM2 cruzando duas fases (ex: inverter L1 com L3)",
        wrong: [
          ["Inverter as fases no rotor", "Inversão rotórica não muda o sentido determinado pelo estator."],
          ["Reapertar os bornes", "O problema é a lógica de conexão, não a firmeza do aperto."],
        ],
      },
    ],
    diagnosis: {
      correct: "Erro de fiação: fases não foram invertidas entre os contatores de sentido",
      wrong: [
        ["Contator KM2 com defeito", "O contator fecha eletricamente, mas a ligação de força está errada."],
        ["Falta de fase na reversão", "Falta de fase impediria a partida ou causaria ronco, não manteria o mesmo sentido."],
      ],
    },
    fault: "Erro de montagem na ponte de reversão (fases não cruzadas)",
    technical: "Para reverter um motor trifásico, é obrigatório trocar a posição de duas fases entre si. Se a fiação for replicada exatamente igual em ambos os contatores, o motor receberá a mesma sequência de fases e girará no mesmo sentido, independentemente de qual contator atracar.",
    checklist: [
      "Rastreio de cabos de potência",
      "Teste de sequência de fases (fasímetro)",
      "Conferência com esquema elétrico de reversão",
      "Validação de rotação mecânica",
    ],
    lessons: [
      "Conceito de campo girante e sequência de fases",
      "Verificação pós-montagem em circuitos de força",
      "Importância do cruzamento de fases na reversão",
    ],
  },
  {
    id: "rbr-05",
    title: "Motor para completamente ao tentar reverter sob carga plena",
    level: "avancado",
    minutes: 14,
    xp: 210,
    equipment: "Motor rotor bobinado c/ reversão 70 cv",
    company: "Terminal Graneleiro Santos",
    sector: "Pá carregadeira sobre trilhos",
    priority: "Alta",
    symptom: 'Reverter em vazio funciona bem. Com carga plena, ao reverter, o relé térmico desarma e o motor para por completo.',
    objective: "Avaliar o ajuste da proteção térmica para o regime de reversão.",
    steps: [
      {
        situation: "Desarme do térmico FT1 apenas em manobras de carga máxima.",
        correct: "Medir a corrente de pico durante a reversão sob carga plena",
        wrong: [
          ["Substituir o relé térmico por um novo igual", "Se for erro de ajuste, o novo relé apresentará a mesma falha."],
          ["Trocar o banco de resistores", "Resistores não causam desarme térmico se estiverem limitando a corrente."],
        ],
      },
      {
        situation: "Análise da curva de disparo do relé térmico.",
        reading: "Corrente de reversão: 220 A por 2 segundos. Ajuste do térmico: 110 A (In). Classe de disparo: 10 (muito rápida para esta carga).",
        correct: "Ajustar o relé térmico ou a classe de disparo para o regime de reversão pesada",
        wrong: [
          ["Desativar o relé térmico", "Prática perigosa que deixa o motor sem proteção contra sobrecarga."],
          ["Reduzir a carga da máquina", "A máquina deve operar em carga plena; a proteção é que deve ser adequada."],
        ],
      },
    ],
    diagnosis: {
      correct: "Relé térmico ajustado com tempo de atuação incompatível com o regime de reversão",
      wrong: [
        ["Motor com enrolamento em curto", "Funcionaria em vazio; o curto afetaria qualquer carga."],
        ["Falta de fase na rede", "Causaria desarme imediato e ruído, não apenas na reversão pesada."],
      ],
    },
    fault: "Parametrização incorreta da proteção térmica (ajuste de tempo/classe)",
    technical: "A reversão sob carga é uma das manobras mais severas. A corrente atinge picos elevados. Se o relé térmico estiver ajustado de forma muito sensível (classe 10 em vez de 20 ou 30), ele atuará prematuramente antes da aceleração no novo sentido se completar.",
    checklist: [
      "Cálculo de corrente de pico na reversão",
      "Verificação de classe de disparo do térmico",
      "Ajuste conforme manual do fabricante para cargas pesadas",
      "Teste de validação sob carga real",
    ],
    lessons: [
      "Classes de disparo de relés térmicos",
      "Sensibilidade de proteção versus regime de carga",
      "Dimensionamento para manobras severas",
    ],
  },
];
