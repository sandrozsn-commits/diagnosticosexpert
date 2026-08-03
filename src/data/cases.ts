export type Level = "iniciante" | "intermediario" | "avancado";

export type Option = {
  label: string;
  next: string;
  /** ação relevante para o diagnóstico (não penaliza) */
  useful?: boolean;
};

export type CaseNode = {
  id: string;
  /** o que o sistema responde/mostra ao aluno */
  situation: string;
  /** leitura de instrumento ou nova informação */
  reading?: string;
  question?: string;
  options?: Option[];
  /** nó final */
  outcome?: "solved" | "wrong";
  explanation?: string;
};

export type DiagCase = {
  id: string;
  number: number;
  title: string;
  symptom: string;
  level: Level;
  category: string;
  minutes: number;
  xp: number;
  objective?: string;
  circuitId?: string;
  equipment?: string;
  company?: string;
  sector?: string;
  system?: string;
  priority?: "Baixa" | "Média" | "Alta";
  components: string[];
  diagram?: string[];
  root: string;
  nodes: Record<string, CaseNode>;
  fault: string;
  technical: string;
  checklist: string[];
  lessons: string[];
};

export const CATEGORIES = [
  "Motores",
  "Contatores",
  "Reversão",
  "Estrela-Triângulo",
  "Temporizadores",
  "Sensores",
  "Proteções",
  "Inversores",
];

export const CASES: DiagCase[] = [
  {
    id: "c01",
    number: 1,
    title: "Motor não parte no acionamento direto",
    symptom:
      "Operador aperta S1 (liga) e nada acontece. Sem ruído no painel, sem trip visível, sinaleira de defeito apagada.",
    level: "iniciante",
    category: "Contatores",
    minutes: 8,
    xp: 120,
    components: ["Disjuntor motor", "Botoeira S0/S1", "Contator K1", "Relé térmico FT1"],
    diagram: [
      "L1 ──[ F1 ]── 95/96 FT1 ── S0 (NF) ── S1 (NA) ┬── A1 K1 ── N",
      "                                    K1 13/14 ─┘  (selo)",
    ],
    root: "n1",
    nodes: {
      n1: {
        id: "n1",
        situation: "Painel energizado, disjuntor geral ligado, comando aparentemente morto.",
        question: "Qual é o seu primeiro passo?",
        options: [
          { label: "Medir tensão de comando entre L1 e N na entrada do circuito", next: "n2", useful: true },
          { label: "Trocar o contator K1 direto", next: "x1" },
          { label: "Abrir o motor para medir enrolamentos", next: "x2" },
        ],
      },
      n2: {
        id: "n2",
        situation: "Você mede a alimentação do circuito de comando.",
        reading: "220 V presentes na entrada do comando. Alimentação OK.",
        question: "Onde mede em seguida?",
        options: [
          { label: "Sequencial: medir ponto a ponto do comando (95/96 → S0 → S1 → A1)", next: "n3", useful: true },
          { label: "Medir tensão nos terminais do motor", next: "x3" },
        ],
      },
      n3: {
        id: "n3",
        situation: "Medição sequencial com o comando energizado, referência no neutro.",
        reading:
          "Após F1: 220 V • Após 95/96 do FT1: 220 V • Antes de S0: 220 V • Depois de S0: 0 V.",
        question: "O que essa leitura indica?",
        options: [
          { label: "Perda de continuidade no botão S0 (NF) ou em sua fiação", next: "n4", useful: true },
          { label: "Bobina de K1 queimada", next: "x4" },
          { label: "Relé térmico atuado", next: "x5" },
        ],
      },
      n4: {
        id: "n4",
        situation: "Você isola o circuito (bloqueio/etiquetagem) e testa S0 com ohmímetro.",
        reading: "S0 em repouso: circuito aberto (∞ Ω). Um contato NF deveria indicar ~0 Ω.",
        question: "Conclusão e ação?",
        options: [
          { label: "Botão S0 (NF) com contato interrompido — substituir o bloco de contato", next: "fim", useful: true },
          { label: "Jumpear S0 e devolver a máquina para produção", next: "x6" },
        ],
      },
      fim: {
        id: "fim",
        situation: "Bloco de contato NF de S0 substituído. Comando testado, K1 atraca e sela.",
        outcome: "solved",
      },
      x1: {
        id: "x1",
        situation: "Contator novo instalado. O motor continua sem partir e você perdeu 40 minutos.",
        outcome: "wrong",
        explanation: "Trocar componente antes de medir é o erro mais caro da manutenção.",
      },
      x2: {
        id: "x2",
        situation: "Enrolamentos íntegros. O defeito nem estava na potência — estava no comando.",
        outcome: "wrong",
        explanation: "O sintoma (contator não atraca) aponta para o circuito de comando.",
      },
      x3: {
        id: "x3",
        situation: "0 V no motor, como esperado: K1 não atracou. Nenhuma informação nova.",
        outcome: "wrong",
        explanation: "Medir a saída de um contator aberto não agrega diagnóstico.",
      },
      x4: {
        id: "x4",
        situation: "Bobina medida: 1,2 kΩ, dentro do normal. Diagnóstico incorreto.",
        outcome: "wrong",
        explanation: "A tensão já sumia antes da bobina — o defeito está a montante.",
      },
      x5: {
        id: "x5",
        situation: "Você já mediu 220 V depois de 95/96. O térmico está fechado.",
        outcome: "wrong",
        explanation: "Ignorar uma medição já feita leva a caminho falso.",
      },
      x6: {
        id: "x6",
        situation: "Jumpear um botão de parada elimina a função de desligamento seguro.",
        outcome: "wrong",
        explanation: "Nunca ponteie dispositivos de comando/parada. Risco grave (NR-10/NR-12).",
      },
    },
    fault: "Contato NF do botão de parada S0 interrompido internamente.",
    technical:
      "No comando com selo, a bobina de K1 só energiza se toda a série estiver fechada: proteção (95/96), parada (NF), partida (NA) ou contato de selo. Um NF aberto derruba a série inteira e o contator nem chega a atracar. A medição sequencial ponto-a-ponto localiza exatamente onde a tensão desaparece.",
    checklist: [
      "Confirmar tensão de comando na entrada",
      "Medir com referência fixa (neutro) e avançar ponto a ponto",
      "Testar contatos NF com ohmímetro, desenergizado",
      "Nunca ponteiar botão de parada",
    ],
    lessons: [
      "A tensão some no ponto do defeito: ache o degrau 220 V → 0 V.",
      "Contatos NF são a causa mais comum de comando 'morto'.",
    ],
  },
  {
    id: "c02",
    number: 2,
    title: "Contator atraca e desarma ao soltar a botoeira",
    symptom: "Segurando S1 o motor gira. Ao soltar, tudo desliga imediatamente.",
    level: "iniciante",
    category: "Contatores",
    minutes: 6,
    xp: 110,
    components: ["Contator K1", "Contato auxiliar 13/14", "Botoeira S1"],
    diagram: ["S1 (NA) ┬── A1 K1", "K1 13/14 ┘ (selo em paralelo com S1)"],
    root: "n1",
    nodes: {
      n1: {
        id: "n1",
        situation: "Comando funciona apenas em modo 'impulso'.",
        question: "O que esse comportamento indica?",
        options: [
          { label: "Falha no circuito de selo (auto-retenção)", next: "n2", useful: true },
          { label: "Motor com rotor travado", next: "x1" },
          { label: "Falta de fase na potência", next: "x2" },
        ],
      },
      n2: {
        id: "n2",
        situation: "Você foca no selo em paralelo com S1.",
        question: "Como confirma?",
        options: [
          { label: "Com K1 atracado, medir tensão nos bornes 13 e 14 do auxiliar", next: "n3", useful: true },
          { label: "Substituir a botoeira S1", next: "x3" },
        ],
      },
      n3: {
        id: "n3",
        situation: "Medição com K1 atracado (segurando S1).",
        reading: "Entre 13 e 14 há queda de 220 V — o contato está aberto mesmo com K1 atracado.",
        question: "Próxima decisão?",
        options: [
          { label: "Verificar se o fio do selo está no borne certo e se o bloco NA está bom", next: "n4", useful: true },
          { label: "Trocar a bobina de K1", next: "x4" },
        ],
      },
      n4: {
        id: "n4",
        situation: "Inspeção do bloco auxiliar.",
        reading:
          "O fio de selo está ligado em 21/22 (contato NF) em vez de 13/14 (NA) — erro de montagem da última manutenção.",
        question: "Ação?",
        options: [
          { label: "Religar o selo no contato NA 13/14 e testar", next: "fim", useful: true },
          { label: "Manter e ponteiar S1", next: "x5" },
        ],
      },
      fim: {
        id: "fim",
        situation: "Selo religado em 13/14. K1 atraca, sela e o motor permanece ligado.",
        outcome: "solved",
      },
      x1: { id: "x1", situation: "Rotor livre. O motor até gira enquanto S1 é pressionado.", outcome: "wrong", explanation: "O motor funciona — o problema é a retenção do comando." },
      x2: { id: "x2", situation: "Três fases presentes.", outcome: "wrong", explanation: "Falta de fase daria outro sintoma (zumbido, sobrecarga)." },
      x3: { id: "x3", situation: "Botoeira nova, mesmo comportamento.", outcome: "wrong", explanation: "S1 funciona: ele atraca o contator. O que falha é o paralelo de selo." },
      x4: { id: "x4", situation: "Bobina boa — ela energiza normalmente enquanto S1 é pressionado.", outcome: "wrong", explanation: "Bobina defeituosa não atracaria em nenhum momento." },
      x5: { id: "x5", situation: "Ponteando S1, o motor liga sozinho ao energizar o painel.", outcome: "wrong", explanation: "Partida involuntária: risco grave de acidente." },
    },
    fault: "Fio de selo conectado em contato NF (21/22) em vez do NA (13/14).",
    technical:
      "O selo é um contato NA do próprio contator em paralelo com o botão de partida. Ao atracar, ele assume a alimentação da bobina. Ligado em um NF, ele abre justamente quando K1 atraca — resultado: funcionamento apenas por impulso.",
    checklist: ["Identificar numeração dos blocos (13/14 NA, 21/22 NF)", "Medir o auxiliar com o contator atracado", "Conferir esquema antes de religar"],
    lessons: ["Funcionamento 'só segurando o botão' = selo defeituoso, mal ligado ou ausente."],
  },
  {
    id: "c03",
    number: 3,
    title: "Motor gira no sentido invertido após manutenção",
    symptom: "Após troca do contator de potência, a esteira anda para trás no comando 'avanço'.",
    level: "iniciante",
    category: "Reversão",
    minutes: 7,
    xp: 130,
    components: ["Contatores K1/K2", "Intertravamento", "Cabos de potência"],
    diagram: ["K1: L1→U, L2→V, L3→W", "K2: L1→W, L2→V, L3→U (duas fases cruzadas)"],
    root: "n1",
    nodes: {
      n1: {
        id: "n1",
        situation: "Comando de avanço aciona K1, mas a carga desloca no sentido de retorno.",
        question: "Primeiro passo?",
        options: [
          { label: "Desenergizar e conferir a sequência de fases na saída de K1", next: "n2", useful: true },
          { label: "Inverter o comando na IHM para 'corrigir' os botões", next: "x1" },
        ],
      },
      n2: {
        id: "n2",
        situation: "Inspeção da fiação de potência com painel bloqueado.",
        reading: "Na saída de K1: T1→U, T2→W, T3→V. Duas fases foram trocadas na remontagem.",
        question: "E o K2, de reversão?",
        options: [
          { label: "Conferir também K2 antes de corrigir", next: "n3", useful: true },
          { label: "Corrigir K1 e liberar a máquina", next: "x2" },
        ],
      },
      n3: {
        id: "n3",
        situation: "Verificação do contator de reversão.",
        reading: "K2 mantém o cruzamento correto em relação ao esquema original.",
        question: "Ação final?",
        options: [
          { label: "Restaurar T2→V e T3→W em K1 e testar ambos os sentidos com carga leve", next: "fim", useful: true },
          { label: "Trocar duas fases na entrada do painel", next: "x3" },
        ],
      },
      fim: { id: "fim", situation: "Sequência corrigida. Avanço e retorno operam conforme o esquema.", outcome: "solved" },
      x1: { id: "x1", situation: "Sentidos 'certos' na tela, mas o intertravamento e a sinalização ficam incoerentes com o esquema.", outcome: "wrong", explanation: "Mascarar erro de fiação no software gera falha futura no próximo reparo." },
      x2: { id: "x2", situation: "Ao testar o retorno, a esteira anda para frente novamente.", outcome: "wrong", explanation: "Em reversão, sempre valide os dois sentidos antes de liberar." },
      x3: { id: "x3", situation: "Inverter na entrada muda o sentido de todos os motores do painel.", outcome: "wrong", explanation: "A correção deve ser local, no ponto onde o erro foi introduzido." },
    },
    fault: "Duas fases invertidas na saída do contator K1 durante a remontagem.",
    technical:
      "O sentido de rotação de um motor trifásico depende da sequência de fases. Trocar duas fases quaisquer inverte o campo girante. Em circuitos de reversão, K2 já cruza duas fases; um erro em K1 inverte os dois sentidos em relação ao projeto.",
    checklist: ["Fotografar a ligação antes de desmontar", "Conferir marcação T1/T2/T3 → U/V/W", "Testar os dois sentidos após intervenção"],
    lessons: ["Documente antes de desmontar: a foto vale mais que a memória."],
  },
  {
    id: "c04",
    number: 4,
    title: "Relé térmico dispara após alguns minutos",
    symptom: "Bomba parte normal, opera 4–6 minutos e o relé térmico atua. Rearmando, repete.",
    level: "intermediario",
    category: "Proteções",
    minutes: 12,
    xp: 190,
    components: ["Relé térmico FT1", "Motor 7,5 cv", "Bomba centrífuga"],
    diagram: ["L1/L2/L3 → K1 → FT1 → M 3~", "FT1 95/96 no comando"],
    root: "n1",
    nodes: {
      n1: {
        id: "n1",
        situation: "Disparo térmico repetitivo, sempre após alguns minutos de operação.",
        question: "Primeira ação?",
        options: [
          { label: "Medir a corrente nas três fases com alicate durante a operação", next: "n2", useful: true },
          { label: "Aumentar o ajuste do relé térmico para parar o disparo", next: "x1" },
          { label: "Trocar o relé térmico", next: "x2" },
        ],
      },
      n2: {
        id: "n2",
        situation: "Medição em operação, alicate amperímetro nas três fases.",
        reading:
          "Placa do motor: 10,5 A. Medido: L1 = 13,8 A • L2 = 13,6 A • L3 = 13,9 A. Ajuste do relé: 11 A.",
        question: "Como interpretar?",
        options: [
          { label: "Sobrecarga real e equilibrada nas três fases — investigar a carga mecânica", next: "n3", useful: true },
          { label: "Desequilíbrio de fases", next: "x3" },
          { label: "Relé com ajuste baixo demais", next: "x4" },
        ],
      },
      n3: {
        id: "n3",
        situation: "Você vai à parte mecânica/hidráulica da bomba.",
        question: "O que verifica?",
        options: [
          { label: "Condição da bomba: rotor, recalque, válvula e densidade do fluido", next: "n4", useful: true },
          { label: "Isolação do motor com megôhmetro", next: "x5" },
        ],
      },
      n4: {
        id: "n4",
        situation: "Inspeção do conjunto.",
        reading:
          "A válvula de recalque foi totalmente aberta em manutenção anterior, deslocando o ponto de operação: a bomba trabalha com vazão acima do projeto e exige mais potência do motor.",
        question: "Ação corretiva?",
        options: [
          { label: "Restaurar o ponto de operação (ajuste da válvula) e confirmar corrente ≤ nominal", next: "fim", useful: true },
          { label: "Trocar o motor por um de 10 cv", next: "x6" },
        ],
      },
      fim: {
        id: "fim",
        situation: "Ponto de operação restaurado. Corrente estabiliza em 10,1 A; sem novos disparos em 2 h de teste.",
        outcome: "solved",
      },
      x1: { id: "x1", situation: "O motor passa a operar em sobrecarga permanente até queimar o enrolamento.", outcome: "wrong", explanation: "Aumentar o ajuste do térmico remove a proteção, não o defeito." },
      x2: { id: "x2", situation: "Relé novo dispara igual: ele está fazendo o trabalho dele.", outcome: "wrong", explanation: "Disparo repetitivo com tempo constante é sinal de sobrecarga real." },
      x3: { id: "x3", situation: "As três correntes estão a menos de 3% entre si — sistema equilibrado.", outcome: "wrong", explanation: "Desequilíbrio exigiria diferença significativa entre fases." },
      x4: { id: "x4", situation: "O ajuste de 11 A está correto para um motor de 10,5 A.", outcome: "wrong", explanation: "O relé deve ser ajustado próximo à corrente nominal do motor." },
      x5: { id: "x5", situation: "Isolação em 120 MΩ — excelente.", outcome: "wrong", explanation: "Falha de isolação daria curto/fuga, não sobrecarga estável." },
      x6: { id: "x6", situation: "Motor maior mascara o problema hidráulico e aumenta o consumo permanente.", outcome: "wrong", explanation: "Corrigir o processo é mais barato que superdimensionar." },
    },
    fault: "Sobrecarga mecânica: bomba operando fora do ponto de projeto após abertura total da válvula de recalque.",
    technical:
      "Em bombas centrífugas, abrir demais o recalque aumenta a vazão e, na maioria das curvas, a potência absorvida. A corrente sobe proporcionalmente. O relé térmico é bimetálico e integra corrente no tempo: por isso o disparo ocorre alguns minutos depois, não na partida.",
    checklist: ["Comparar corrente medida com a placa", "Avaliar equilíbrio entre fases", "Investigar a carga antes de culpar a proteção", "Nunca elevar o ajuste para 'resolver'"],
    lessons: ["Proteção que atua repetidamente está avisando, não falhando.", "Tempo até o disparo é uma pista: térmico atua por integração I²t."],
  },
  {
    id: "c05",
    number: 5,
    title: "Estrela-triângulo não transfere para triângulo",
    symptom:
      "Partida em estrela ocorre normal, mas a máquina permanece em estrela, com baixo torque, e o térmico acaba atuando.",
    level: "intermediario",
    category: "Estrela-Triângulo",
    minutes: 14,
    xp: 220,
    components: ["KM1 (linha)", "KMY (estrela)", "KMΔ (triângulo)", "Temporizador KT1"],
    diagram: [
      "KT1 (15/18 temporizado) → abre KMY e fecha KMΔ",
      "Intertravamento: KMY 21/22 na bobina de KMΔ e vice-versa",
    ],
    root: "n1",
    nodes: {
      n1: {
        id: "n1",
        situation: "Partida em estrela normal; transferência não ocorre após o tempo ajustado.",
        question: "Por onde começa?",
        options: [
          { label: "Observar o KT1 no momento do tempo: LED/contato comutou?", next: "n2", useful: true },
          { label: "Trocar KMΔ", next: "x1" },
          { label: "Reduzir o tempo do temporizador", next: "x2" },
        ],
      },
      n2: {
        id: "n2",
        situation: "Você acompanha o KT1 durante uma partida controlada.",
        reading: "Ao fim de 6 s, o LED do KT1 comuta e KMY desatraca. KMΔ, porém, não atraca.",
        question: "O que isso descarta e qual o próximo passo?",
        options: [
          { label: "KT1 está OK — medir tensão na bobina A1/A2 de KMΔ no instante da comutação", next: "n3", useful: true },
          { label: "Trocar o temporizador", next: "x3" },
        ],
      },
      n3: {
        id: "n3",
        situation: "Medição na bobina de KMΔ.",
        reading: "0 V em A1 de KMΔ após a comutação, mesmo com KMY desatracado.",
        question: "Qual elemento está na série da bobina de KMΔ?",
        options: [
          { label: "O intertravamento NF de KMY (21/22) — verificar continuidade", next: "n4", useful: true },
          { label: "O contato de selo de KM1", next: "x4" },
        ],
      },
      n4: {
        id: "n4",
        situation: "Teste do bloco 21/22 de KMY com o contator em repouso.",
        reading: "Contato NF de KMY medindo ∞ Ω em repouso: contato colado/oxidado internamente.",
        question: "Ação?",
        options: [
          { label: "Substituir o bloco auxiliar de KMY e reensaiar a transferência", next: "fim", useful: true },
          { label: "Ponteiar o intertravamento para transferir", next: "x5" },
        ],
      },
      fim: {
        id: "fim",
        situation:
          "Bloco auxiliar substituído. Transferência Y→Δ ocorre em 6 s, corrente cai ao nominal, sem trip.",
        outcome: "solved",
      },
      x1: { id: "x1", situation: "KMΔ novo continua sem atracar: falta tensão na bobina.", outcome: "wrong", explanation: "Sem medir a bobina, a troca é aposta." },
      x2: { id: "x2", situation: "Tempo menor não muda nada — a transferência simplesmente não acontece.", outcome: "wrong", explanation: "O problema é de comando, não de ajuste." },
      x3: { id: "x3", situation: "O KT1 comutou na sua frente. Trocar é desperdício.", outcome: "wrong", explanation: "Não substitua um componente já validado por observação direta." },
      x4: { id: "x4", situation: "KM1 permanece atracado o tempo todo — sua série está fechada.", outcome: "wrong", explanation: "Se KM1 abrisse, o motor pararia por completo." },
      x5: { id: "x5", situation: "Sem intertravamento, uma falha de KMY fecha Y e Δ juntos: curto franco entre fases.", outcome: "wrong", explanation: "Intertravamento em estrela-triângulo é proteção obrigatória." },
    },
    fault: "Contato NF de intertravamento do contator de estrela (KMY 21/22) interrompido.",
    technical:
      "Na transferência, KMY desatraca e seu NF deve fechar para liberar a bobina de KMΔ. Com esse NF aberto, o comando trava em estrela: o motor fica com 1/3 do torque e a corrente do processo leva o térmico a atuar. O tempo morto entre KMY e KMΔ evita curto entre fases.",
    checklist: [
      "Observar a comutação do temporizador antes de trocar peças",
      "Medir a bobina do contator que não atraca",
      "Testar contatos de intertravamento desenergizado",
      "Jamais ponteiar intertravamento Y/Δ",
    ],
    lessons: ["Contator que não atraca: primeiro pergunte se falta tensão na bobina ou se a bobina falhou."],
  },
  {
    id: "c06",
    number: 6,
    title: "Sensor indutivo não aciona o comando",
    symptom:
      "A peça chega à posição, o LED do sensor acende, mas o contator K3 não é acionado e a máquina para o ciclo.",
    level: "avancado",
    category: "Sensores",
    minutes: 15,
    xp: 260,
    components: ["Sensor indutivo PNP 3 fios", "Relé de interface K3A", "Contator K3", "Fonte 24 Vcc"],
    diagram: ["24V ── sensor PNP ── bobina K3A (0V)", "K3A 13/14 ── A1 K3 (220 Vca)"],
    root: "n1",
    nodes: {
      n1: {
        id: "n1",
        situation: "LED do sensor acende com a peça presente, mas o comando não avança.",
        question: "Primeira medição?",
        options: [
          { label: "Medir tensão na saída do sensor (fio preto) contra 0 V com a peça presente", next: "n2", useful: true },
          { label: "Trocar o sensor, já que o LED pode enganar", next: "x1" },
        ],
      },
      n2: {
        id: "n2",
        situation: "Multímetro em Vcc, ponta no fio de sinal e no 0 V da fonte.",
        reading: "Peça presente: 23,6 Vcc na saída. Peça ausente: 0,4 V. O sensor comuta corretamente.",
        question: "Próximo passo?",
        options: [
          { label: "Medir a mesma tensão diretamente nos bornes da bobina do relé K3A", next: "n3", useful: true },
          { label: "Reposicionar o sensor mais perto da peça", next: "x2" },
        ],
      },
      n3: {
        id: "n3",
        situation: "Medição direta na bobina de interface.",
        reading: "Na bobina de K3A: 2,1 Vcc apenas, com o sensor acionado. O relé não atrai.",
        question: "O que uma queda dessas indica?",
        options: [
          { label: "Alta resistência no percurso: borne frouxo, emenda oxidada ou fio rompido parcialmente", next: "n4", useful: true },
          { label: "Bobina de K3A em curto", next: "x3" },
          { label: "Sensor NPN ligado como PNP", next: "x4" },
        ],
      },
      n4: {
        id: "n4",
        situation: "Inspeção do percurso do sinal no bornes e canaleta.",
        reading:
          "No borne de passagem X2:14 o parafuso está frouxo e o fio apresenta oxidação: resistência de contato medida em ~4,7 kΩ.",
        question: "Ação corretiva?",
        options: [
          { label: "Refazer o terminal, limpar/reapertar o borne e reverificar a tensão na bobina", next: "fim", useful: true },
          { label: "Ligar o sensor direto na bobina, sem passar pelo borne", next: "x5" },
        ],
      },
      fim: {
        id: "fim",
        situation:
          "Terminal refeito e borne reapertado. Bobina recebe 23,8 Vcc, K3A atua e K3 acompanha o ciclo.",
        outcome: "solved",
      },
      x1: { id: "x1", situation: "Sensor novo, mesmo comportamento — e o defeito segue na fiação.", outcome: "wrong", explanation: "O sensor estava entregando sinal correto." },
      x2: { id: "x2", situation: "A distância já estava dentro do sensing: o LED confirma detecção.", outcome: "wrong", explanation: "Ajustar o que já funciona não resolve o defeito." },
      x3: { id: "x3", situation: "Bobina em curto puxaria corrente alta e provavelmente derrubaria a fonte.", outcome: "wrong", explanation: "A leitura indica queda em série, não curto." },
      x4: { id: "x4", situation: "Um NPN ligado como PNP não apresentaria 23,6 V na saída medida contra 0 V.", outcome: "wrong", explanation: "A medição do nó anterior já descarta a inversão de tecnologia." },
      x5: { id: "x5", situation: "Gambiarra fora do borne quebra a documentação e falha de novo em semanas.", outcome: "wrong", explanation: "Reparo definitivo respeita o projeto elétrico." },
    },
    fault: "Resistência de contato elevada em borne oxidado/frouxo no percurso do sinal 24 Vcc.",
    technical:
      "Em circuitos de 24 Vcc com correntes pequenas, uma resistência em série de alguns kΩ forma um divisor com a bobina do relé: sobra tensão insuficiente para atrair a armadura. Por isso medir a tensão na origem do sinal não basta — é preciso medir sob carga, no destino.",
    checklist: [
      "Medir sinal na origem e no destino, sempre sob carga",
      "Suspeitar de bornes e emendas em circuitos de baixa corrente",
      "Reapertar conexões como rotina preventiva",
    ],
    lessons: [
      "Tensão presente na origem não garante tensão no destino.",
      "Mau contato se revela quando o circuito está sob carga.",
    ],
  },
];

export const getCase = (id: string) => CASES.find((c) => c.id === id);
