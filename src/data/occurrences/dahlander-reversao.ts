import type { OccurrenceSpec } from "@/data/case-builder";

export const DAHLANDER_REVERSAO: OccurrenceSpec[] = [
  {
    id: "dhr-01",
    title: "Motor reverte mas perde a velocidade alta",
    level: "avancado",
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
];
