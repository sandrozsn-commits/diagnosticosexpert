import type { OccurrenceSpec } from "@/data/case-builder";

export const ROTOR_BOBINADO_REVERSAO: OccurrenceSpec[] = [
  {
    id: "rbr-01",
    title: "Motor reverte com vibração forte e corrente elevada",
    level: "intermediario",
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
];
