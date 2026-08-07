import type { OccurrenceSpec } from "@/data/case-builder";

export const ESTRELA_TRIANGULO_FREIO: OccurrenceSpec[] = [
  {
    id: "efm-01",
    title: "Motor desliga mas continua girando por inércia",
    level: "intermediario",
    minutes: 12,
    xp: 200,
    equipment: "Motor 15 cv estrela-triângulo c/ freio magnético",
    company: "Serralheria Industrial Matos",
    sector: "Serra de fita",
    priority: "Alta",
    symptom: "Ao pressionar S0, o motor desenergiza corretamente, mas continua girando por vários segundos antes de parar — o freio parece não atuar.",
    objective: "Localizar a falha no acionamento do freio eletromagnético.",
    steps: [
      {
        situation: "Motor livre para girar após desligamento; comando de freio inoperante.",
        correct: "Medir a tensão nos bornes da bobina do freio após pressionar S0",
        wrong: [
          ["Ajustar a pressão da mola do freio", "Se a falha for elétrica (bobina energizada quando não devia), o ajuste mecânico não ajudará."],
          ["Trocar a lona de freio", "A lona não se desgasta de uma vez a ponto de não frear nada sem aviso prévio."],
        ],
      },
      {
        situation: "Verificação da alimentação da bobina do freio (tipo fail-safe: freia sem tensão).",
        reading: "Bobina do freio: 220 V constantes, mesmo após S0 ser pressionado e o motor parar de receber potência.",
        correct: "Testar o contato do contator de freio KM4",
        wrong: [
          ["Trocar o retificador do freio", "O retificador está entregando tensão (220 V medidos); ele não é o culpado."],
          ["Verificar o relé térmico", "O relé térmico atua no motor, não mantém o freio desenergizado."],
        ],
      },
    ],
    diagnosis: {
      correct: "Contato de KM4 soldado/colado, mantendo a bobina do freio energizada",
      wrong: [
        ["Mola do freio rompida", "Se a mola rompesse, não haveria tensão de 220 V mantendo o freio aberto."],
        ["Bobina do freio queimada", "Se a bobina estivesse queimada (aberta), o freio atuaria permanentemente por falta de campo."],
      ],
    },
    fault: "Contator de freio KM4 com contatos soldados",
    technical: "Em freios fail-safe, a frenagem ocorre por ação de molas quando a bobina perde tensão. Se o contator KM4 solda seus contatos, a bobina permanece energizada mesmo após o comando de parada, mantendo o freio aberto e a carga livre para girar por inércia.",
    checklist: [
      "Medição de tensão na bobina do freio em repouso",
      "Teste de continuidade dos contatos de KM4",
      "Substituição do contator de freio",
      "Teste de tempo de parada",
    ],
    lessons: [
      "Conceito de freio de segurança (Fail-safe)",
      "Importância do contator de frenagem",
      "Riscos de inércia em máquinas de corte",
    ],
  },
  {
    id: "efm-02",
    title: "Freio atua abruptamente com o motor ainda em plena rotação",
    level: "avancado",
    minutes: 15,
    xp: 230,
    equipment: "Motor 25 cv estrela-triângulo c/ freio magnético",
    company: "Metalúrgica Aço Forte",
    sector: "Prensa excêntrica",
    priority: "Alta",
    symptom: "Durante a operação normal, o freio atua repentinamente e trava o eixo com o motor ainda energizado, gerando um solavanco forte.",
    objective: "Identificar a causa da queda de tensão no circuito do freio.",
    steps: [
      {
        situation: "Máquina travada com motor roncando (tentando girar contra o freio).",
        correct: "Desligar imediatamente o disjuntor geral e medir a continuidade do circuito de alimentação do freio",
        wrong: [
          ["Tentar partir o motor novamente", "Risco de quebra do eixo ou queima do motor por rotor travado contra o freio."],
          ["Aumentar o tempo de transição estrela-triângulo", "O freio atuou em regime, o tempo de partida não tem relação."],
        ],
      },
      {
        situation: "Inspeção da proteção e conexões do circuito de frenagem.",
        reading: "Fusível de proteção do circuito do freio com oxidação severa e resistência de contato instável.",
        correct: "Verificar o estado das conexões e do porta-fusível do freio",
        wrong: [
          ["Trocar o disco de freio", "O disco está funcionando bem até demais (travou o motor)."],
          ["Substituir o temporizador KT1", "O temporizador não controla a frenagem de emergência por falha de alimentação."],
        ],
      },
    ],
    diagnosis: {
      correct: "Interrupção momentânea na alimentação do freio por fusível oxidado",
      wrong: [
        ["Bobina do freio em curto", "Um curto queimaria o fusível definitivamente, não causaria atuação intermitente."],
        ["Falha de intertravamento de KM4", "O intertravamento impediria o freio de abrir, não o faria fechar em regime."],
      ],
    },
    fault: "Mau contato (oxidação) no fusível de proteção do circuito do freio",
    technical: "Como o freio magnético é fail-safe, qualquer interrupção na sua alimentação (como um fusível oxidado que perde contato com a vibração) fará com que as molas atuem instantaneamente. Isso causa uma frenagem brusca com o motor ainda energizado, gerando estresse mecânico severo.",
    checklist: [
      "Inspeção de oxidação em porta-fusíveis",
      "Medição de queda de tensão em bornes de comando",
      "Limpeza e reaperto de todo o circuito do freio",
      "Teste de vibração sob carga",
    ],
    lessons: [
      "Efeitos da vibração em contatos elétricos",
      "Segurança intrínseca de freios magnéticos",
      "Análise de solavancos mecânicos por falha elétrica",
    ],
  },
];
