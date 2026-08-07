import type { OccurrenceSpec } from "@/data/case-builder";

export const PARTIDA_DIRETA: OccurrenceSpec[] = [
  {
    id: "pd-01",
    title: "Motor não parte ao pressionar a botoeira Liga",
    level: "iniciante",
    minutes: 8,
    xp: 120,
    equipment: "Motor trifásico 5 cv",
    company: "Metalúrgica Alfa",
    sector: "Linha de produção",
    symptom:
      "Operador pressiona S1 e nada acontece. Não há ruído no painel e a sinaleira de defeito está apagada.",
    objective: "Identificar em que ponto o circuito de comando é interrompido antes da bobina de KM1.",
    steps: [
      {
        situation: "Painel energizado, disjuntor Q1 ligado, comando aparentemente morto.",
        correct: "Medir tensão de comando entre a saída de F1 e o neutro",
        wrong: [
          ["Substituir o contator KM1 imediatamente", "Contator trocado sem evidência: falha permanece idêntica e uma hora de produção é perdida."],
          ["Abrir a caixa de ligação do motor", "O motor sequer é energizado; a inspeção não gera nenhuma informação nova."],
          ["Trocar a botoeira S1", "A botoeira apresenta continuidade normal e o comando não responde."],
          ["Rearmar relé térmico sem teste", "O térmico não está atuado; rearmar não altera o estado do circuito."],
        ],
      },
      {
        situation: "Há tensão na entrada do comando, então o problema está no percurso da série.",
        reading: "F1 → N = 220 V. Bobina A1/A2 de KM1 = 0 V.",
        correct: "Medir a continuidade ponto a ponto na série FT1 (95/96) → S0 → S1",
        wrong: [
          ["Trocar os fusíveis F1 e F2", "Os fusíveis estão íntegros — havia tensão medida logo após eles."],
          ["Aumentar o ajuste de corrente do relé térmico", "Alterar o ajuste não restabelece o contato auxiliar e mascara a proteção do motor."],
          ["Substituir a bobina de KM1", "A bobina não recebe tensão; a troca não corrige o problema de alimentação."],
          ["Testar isolamento do motor", "O motor ainda não foi energizado; testar isolamento é inútil neste momento."],
        ],
      },
      {
        situation: "A continuidade revela onde a série está aberta.",
        reading: "95/96 do FT1: circuito aberto. S0 e S1 com continuidade normal ao serem acionados.",
        correct: "Verificar o estado do relé térmico e seu botão de rearme",
        wrong: [
          ["Fazer um jumper sobre o contato 95/96", "Prática proibida: elimina a proteção térmica do motor e cria risco de incêndio."],
          ["Substituir a botoeira S1", "A botoeira apresentou continuidade normal no teste."],
          ["Trocar disjuntor de força Q1", "Q1 está ligado e conduzindo corrente para o circuito de potência."],
          ["Substituir contator KM1", "O intertravamento é elétrico, não mecânico na armadura do contator."],
        ],
      },
    ],
    diagnosis: {
      correct: "Relé térmico FT1 atuado, com contato 95/96 aberto e sem rearme",
      wrong: [
        ["Bobina de KM1 queimada", "A bobina nunca recebeu tensão: não é possível afirmar que esteja danificada."],
        ["Fusível de comando aberto", "Havia 220 V medidos após F1."],
        ["Defeito no motor", "O motor não foi testado; o comando não enviou sinal."],
        ["Falha na botoeira Liga S1", "A botoeira S1 apresentou continuidade normal no teste."],
      ],
    },
    fault: "Relé térmico FT1 atuado e não rearmado",
    technical:
      "O contato auxiliar 95/96 do relé térmico abre a série de comando quando ocorre sobrecarga. Enquanto o rearme não for feito, a bobina de KM1 não recebe tensão. Antes de rearmar, deve-se investigar a causa da sobrecarga (corrente do motor, carga mecânica e ajuste do relé).",
    checklist: [
      "Confirmação de tensão de comando após F1",
      "Teste de continuidade da série FT1 → S0 → S1",
      "Identificação do contato 95/96 aberto",
      "Rearme após verificação da corrente do motor",
    ],
    lessons: [
      "Função do contato auxiliar 95/96 do relé térmico",
      "Sequência de medição em série no circuito de comando",
      "Ajuste de corrente de relés térmicos",
    ],
  },
  {
    id: "pd-02",
    title: "O contator atraca, mas o motor não gira",
    level: "intermediario",
    minutes: 10,
    xp: 150,
    equipment: "Motor trifásico 7,5 cv",
    company: "Metalúrgica Alfa",
    sector: "Usinagem",
    symptom:
      "Ao acionar S1, KM1 atraca normalmente, porém o motor apenas emite um zumbido forte e não desenvolve rotação.",
    objective: "Determinar por que o motor recebe comando mas não desenvolve conjugado.",
    steps: [
      {
        situation: "KM1 fechado, motor zumbindo, corrente elevada e vibração audível.",
        correct: "Desligar imediatamente e medir tensão entre fases na saída do contator",
        wrong: [
          ["Manter o motor ligado para observar o comportamento", "Motor mantido em falta de fase: aquecimento severo e risco de queima do enrolamento."],
          ["Trocar a botoeira S1", "O comando funcionou corretamente: KM1 atracou."],
          ["Inverter as fases de entrada", "Isso não resolve a falta de uma fase; apenas inverte o sentido."],
          ["Reapertar disjuntor de comando", "A falha está na potência, não no comando."],
        ],
      },
      {
        situation: "As medições de tensão entre fases mostram um desequilíbrio evidente.",
        reading: "Saída KM1: L1-L2 = 380 V | L2-L3 = 380 V | L1-L3 = 0 V.",
        correct: "Medir a continuidade dos fusíveis de potência do circuito principal",
        wrong: [
          ["Medir a resistência de isolamento do motor", "Medida válida em outro contexto, mas o desequilíbrio já aponta falta de fase na alimentação."],
          ["Reapertar apenas os bornes do motor", "O aperto não explica a ausência total de tensão em uma das fases."],
          ["Trocar o motor", "O problema é na alimentação; o novo motor também zumbiria."],
          ["Testar contatos auxiliares", "A falha é no circuito de potência."],
        ],
      },
    ],
    diagnosis: {
      correct: "Falta de fase por fusível de potência aberto na linha L3",
      wrong: [
        ["Rotor travado mecanicamente", "Com rotor travado haveria tensão equilibrada nas três fases."],
        ["Contator subdimensionado", "O contator fechou corretamente e conduz nas fases íntegras."],
        ["Curto-circuito no motor", "Haveria desarme imediato por sobrecorrente/disjuntor."],
        ["Falta de fase na rede geral", "As fases L1-L2 e L2-L3 estão normais; apenas a saída L3 falhou."],
      ],
    },
    fault: "Fusível de potência aberto (falta de fase em L3)",
    technical:
      "Com uma fase ausente, o motor trifásico não forma campo girante e permanece com conjugado praticamente nulo, consumindo corrente muito acima da nominal nas duas fases restantes. A falta de fase deve ser corrigida e a causa da abertura do fusível investigada antes de religar.",
    checklist: [
      "Desligamento imediato para evitar queima",
      "Medição de tensão entre as três fases na saída do contator",
      "Teste de continuidade dos fusíveis de potência",
      "Investigação da causa da abertura",
    ],
    lessons: [
      "Efeitos da falta de fase em motores trifásicos",
      "Medição de tensão entre fases sob carga",
      "Relés de falta de fase como proteção complementar",
    ],
  },
  {
    id: "pd-03",
    title: "Motor parte e desarma após alguns segundos",
    level: "intermediario",
    minutes: 12,
    xp: 160,
    equipment: "Motor trifásico 10 cv",
    company: "Serraria Ipê",
    sector: "Beneficiamento",
    symptom:
      "O motor parte normalmente, funciona por cerca de dez segundos e o relé térmico desarma. O quadro repete-se a cada tentativa.",
    objective: "Verificar se o desarme é falha de proteção, de ajuste ou consumo real excessivo.",
    steps: [
      {
        situation: "Motor parte sem dificuldade, mas a proteção térmica atua sempre no mesmo intervalo.",
        correct: "Medir a corrente nas três fases com alicate amperímetro durante a partida",
        wrong: [
          ["Rearmar repetidamente até o motor permanecer ligado", "Rearmes sucessivos degradam o relé e não revelam nada sobre a corrente real."],
          ["Substituir o relé térmico por outro igual", "Sem conhecer a corrente do motor, a troca é um chute."],
          ["Aumentar o ajuste para o máximo", "Perda total de proteção; o motor pode queimar sem aviso."],
          ["Trocar os fusíveis de potência", "O motor parte; os fusíveis estão conduzindo."],
        ],
      },
      {
        situation: "As correntes medidas são comparadas com os dados de placa do motor.",
        reading: "Corrente medida: 14,2 A / 14,0 A / 14,3 A. Placa do motor: In = 14,5 A. Ajuste do FT1: 9 A.",
        correct: "Comparar o ajuste do relé térmico com a corrente nominal de placa",
        wrong: [
          ["Verificar o alinhamento mecânico da carga", "As correntes estão equilibradas e dentro da nominal — não há sobrecarga mecânica."],
          ["Medir isolamento do enrolamento", "O motor opera com corrente normal; o isolamento não é o ponto em questão."],
          ["Substituir o contator", "O contator está mantendo o motor rodando por 10s."],
          ["Limpar terminais do motor", "Não há indícios de mau contato; corrente está estável."],
        ],
      },
    ],
    diagnosis: {
      correct: "Relé térmico ajustado abaixo da corrente nominal do motor",
      wrong: [
        ["Sobrecarga mecânica na carga acionada", "As três correntes estão dentro da corrente nominal de placa."],
        ["Desequilíbrio de tensão da rede", "As correntes estão equilibradas entre as fases."],
        ["Curto entre espiras", "A corrente seria muito mais alta e desequilibrada."],
        ["Falha no temporizador", "Partida direta simples não usa temporizador de partida."],
      ],
    },
    fault: "Ajuste incorreto do relé térmico FT1 (9 A para um motor de 14,5 A)",
    technical:
      "O relé térmico deve ser ajustado conforme a corrente nominal de placa, considerando o fator de serviço e o regime da carga. Ajustes abaixo da nominal provocam desarmes indevidos durante a aceleração, quando a corrente ainda é superior à de regime.",
    checklist: [
      "Medição de corrente nas três fases durante a partida",
      "Leitura dos dados de placa do motor",
      "Comparação com o ajuste do relé térmico",
      "Correção do ajuste e novo teste de partida",
    ],
    lessons: [
      "Critérios de ajuste de relés térmicos",
      "Curva de corrente de partida de motores de indução",
      "Interpretação de dados de placa",
    ],
  },
  {
    id: "pd-04",
    title: "Motor permanece ligado mesmo após pressionar Desliga",
    level: "avancado",
    minutes: 12,
    xp: 190,
    equipment: "Motor trifásico 15 cv",
    company: "Cerâmica Monte Verde",
    sector: "Moagem",
    symptom:
      "Pressionando S0 o comando desenergiza, mas o motor continua girando. Somente o disjuntor geral interrompe o funcionamento.",
    objective: "Descobrir por que a interrupção do comando não interrompe o circuito de potência.",
    steps: [
      {
        situation: "Situação de risco: a máquina não responde ao comando de parada.",
        correct: "Isolar a máquina pelo disjuntor Q1 e sinalizar bloqueio antes de qualquer teste",
        wrong: [
          ["Pressionar S0 várias vezes com o motor girando", "A insistência mantém a máquina em condição insegura e não gera informação técnica."],
          ["Trocar a botoeira S0 com o painel energizado", "Intervenção com circuito energizado em condição de falha — risco grave de acidente."],
          ["Medir corrente do motor", "Medição irrelevante; o motor não deveria estar rodando."],
          ["Bater no contator com martelo", "Prática perigosa; pode soltar temporariamente mas danifica o componente."],
        ],
      },
      {
        situation: "Com o painel bloqueado, o contator pode ser inspecionado.",
        reading: "Bobina A1/A2 de KM1: 0 V. Continuidade entre os contatos principais 1/2, 3/4 e 5/6: fechada com a bobina desenergizada.",
        correct: "Verificar mecanicamente se a armadura do contator retorna ao repouso",
        wrong: [
          ["Substituir o relé térmico", "O relé térmico não mantém a potência fechada."],
          ["Refazer a fiação da botoeira S0", "O comando já está comprovadamente desenergizado."],
          ["Trocar o motor", "O motor funciona até demais; a falha é na manobra."],
          ["Limpar contatos com lixa", "Contatos soldados não devem ser lixados; o contator deve ser trocado."],
        ],
      },
    ],
    diagnosis: {
      correct: "Contatos principais de KM1 soldados (colados), mantendo a potência fechada",
      wrong: [
        ["Botoeira S0 com contato NF em curto", "A bobina está com 0 V: o comando abriu corretamente."],
        ["Selo de KM1 permanentemente fechado", "O selo alimentaria a bobina, que estaria energizada."],
        ["Falha no disjuntor principal", "O disjuntor interrompeu a carga; ele está operando."],
        ["Erro na lógica de intertravamento", "Partida direta simples não possui intertravamento elétrico complexo."],
      ],
    },
    fault: "Contatos principais de KM1 soldados por sobrecorrente repetida",
    technical:
      "A soldagem dos contatos principais ocorre por arco elétrico intenso em partidas frequentes, curto-circuito ou contator subdimensionado. O contator deve ser substituído — nunca desatolado mecanicamente — e o dimensionamento (categoria AC-3) revisto junto ao regime de manobras.",
    checklist: [
      "Bloqueio e sinalização do painel",
      "Medição de tensão na bobina do contator",
      "Teste de continuidade dos contatos principais em repouso",
      "Substituição do contator e revisão do dimensionamento",
    ],
    lessons: [
      "Categorias de emprego de contatores (AC-1 / AC-3)",
      "Procedimento de bloqueio e etiquetagem",
      "Falhas por soldagem de contatos",
    ],
  },
  {
    id: "pd-05",
    title: "O contator vibra e não permanece energizado",
    level: "avancado",
    minutes: 14,
    xp: 200,
    equipment: "Motor trifásico 7,5 cv",
    company: "Frigorífico Sul",
    sector: "Câmaras frias",
    symptom:
      "Ao pressionar S1 o contator faz um chiado contínuo, atraca e desatraca rapidamente e o motor não estabiliza.",
    objective: "Identificar a origem da instabilidade na alimentação da bobina de KM1.",
    steps: [
      {
        situation: "Contator em regime de trepidação (chattering) enquanto S1 é mantido pressionado.",
        correct: "Medir a tensão na bobina A1/A2 com S1 pressionado e depois solto",
        wrong: [
          ["Apertar o contator com a mão para estabilizar", "Intervenção insegura em equipamento energizado e sem valor diagnóstico."],
          ["Trocar o motor de posição no barramento", "A instabilidade está no comando, não na potência."],
          ["Substituir disjuntor Q1", "Q1 está conduzindo; o chiado é no contator."],
          ["Medir isolamento do motor", "O problema é claramente de acionamento magnético."],
        ],
      },
      {
        situation: "As medições mostram comportamento distinto conforme a origem da alimentação da bobina.",
        reading: "Com S1 pressionado: 218 V estáveis na bobina. Com S1 solto (via selo): tensão oscilando entre 90 V e 210 V.",
        correct: "Inspecionar o contato de selo KM1 13/14 e seus terminais",
        wrong: [
          ["Substituir a bobina do contator", "A bobina responde corretamente quando alimentada de forma estável por S1."],
          ["Verificar o ajuste do relé térmico", "O relé térmico não interfere na estabilidade do selo."],
          ["Limpar o núcleo magnético", "O chiado/vibração via selo indica falha de continuidade elétrica."],
          ["Trocar botoeira S0", "S0 é NF e está em série; mau contato nela afetaria também S1."],
        ],
      },
      {
        situation: "A inspeção do contato auxiliar revela o estado real da conexão.",
        reading: "Terminal 14 com parafuso frouxo e oxidação visível; resistência de contato instável ao movimentar o cabo.",
        correct: "Confirmar a queda de tensão sobre o contato de selo com o circuito energizado",
        wrong: [
          ["Jumpear o selo para manter o motor ligado", "Improviso que elimina a função de retenção e cria acionamento sem segurança."],
          ["Substituir a botoeira S1", "S1 alimenta a bobina de forma estável."],
          ["Trocar o relé térmico FT1", "FT1 é o elemento de proteção, não de retenção."],
          ["Aumentar a bitola dos cabos de comando", "Tensão com S1 pressionado é estável; queda é localizada no selo."],
        ],
      },
    ],
    diagnosis: {
      correct: "Mau contato no auxiliar de selo KM1 13/14 provocando realimentação intermitente",
      wrong: [
        ["Bobina de KM1 com espiras em curto", "A bobina mantém o contator firme quando alimentada por S1."],
        ["Subtensão geral da rede", "A tensão medida com S1 pressionado é estável em 218 V."],
        ["Núcleo magnético sujo", "A instabilidade é dependente da fonte de alimentação (S1 vs Selo)."],
        ["Vibração mecânica do painel", "Causa remota; o problema elétrico no selo é evidente."],
      ],
    },
    fault: "Contato de selo KM1 13/14 com mau contato",
    technical:
      "O chattering ocorre quando a bobina recebe tensão insuficiente ou intermitente: o contator atraca, o selo falha, a bobina desenergiza e o ciclo se repete. Além de não manter a carga, o fenômeno destrói contatos por arco repetitivo. A correção envolve limpeza/substituição do bloco auxiliar e reaperto com torque adequado.",
    checklist: [
      "Comparação de tensão na bobina com S1 pressionado e via selo",
      "Inspeção do bloco de contatos auxiliares",
      "Medição de queda de tensão no contato de selo",
      "Substituição do bloco auxiliar e reaperto dos bornes",
    ],
    lessons: [
      "Funcionamento do circuito de selo",
      "Chattering de contatores e suas causas",
      "Queda de tensão em contatos oxidados",
    ],
  },
  {
    id: "pd-06",
    title: "Motor parte, mas protege por sobrecarga logo após",
    level: "intermediario",
    minutes: 10,
    xp: 150,
    equipment: "Motor 10 cv",
    company: "Metalúrgica Alfa",
    sector: "Moagem",
    symptom: "Motor parte normalmente, mas após 5 segundos, FT1 desarma.",
    objective: "Verificar se é falha real de sobrecarga ou problema no ajuste.",
    steps: [
      {
        situation: "Partida completa com desarme térmico imediato.",
        correct: "Medir corrente de regime após a partida",
        wrong: [
          ["Substituir relé térmico", "Antes de trocar, medir corrente é obrigatório."],
          ["Trocar motor", "Sem evidência de falha no motor, a troca é prematura."],
          ["Aumentar a bitola dos cabos", "A queda de tensão não foi medida nem é suspeita."],
          ["Limpar contatos do contator", "O problema é o ajuste do térmico, não mau contato."],
        ],
      },
      {
        situation: "Medição de corrente de regime.",
        reading: "Corrente = 13 A. In nominal = 14 A. FT1 ajustado para 10 A.",
        correct: "Ajustar FT1 para a corrente nominal",
        wrong: [
          ["Trocar motor", "Corrente dentro da nominal."],
          ["Substituir disjuntor de comando", "O disjuntor não interfere no ajuste do térmico."],
          ["Inverter fases", "O motor gira normalmente; não há falta de fase."],
          ["Trocar botoeira S0", "S0 é NF e funciona; o problema é o térmico."],
        ],
      },
    ],
    diagnosis: {
      correct: "FT1 ajustado abaixo da nominal",
      wrong: [
        ["Motor com defeito", "Corrente na nominal."],
        ["Falta de fase", "Corrente equilibrada nas três fases."],
        ["Curto-circuito", "O desarme seria instantâneo e via disjuntor."],
        ["Falha no selo", "O motor parte e roda por 5 segundos; o selo está OK."],
      ],
    },
    fault: "Ajuste incorreto do FT1",
    technical: "Relé térmico desarmando por ajuste baixo.",
    checklist: ["Medir corrente", "Ajustar FT1"],
    lessons: ["Ajuste correto de FT1"],
  },
];
