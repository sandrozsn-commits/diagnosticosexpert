# Padrão de Árvore de Diagnóstico v2

Este documento define o padrão oficial para as ocorrências do Diagnósticos Expert.

## Objetivo

Transformar cada ocorrência em uma simulação de troubleshooting industrial, e não apenas em uma sequência de perguntas de múltipla escolha.

## Estrutura por dificuldade

### Iniciante
- 3 etapas técnicas obrigatórias antes do diagnóstico.
- 3 a 5 alternativas por etapa.
- Poucas hipóteses concorrentes.
- Medições básicas: tensão, continuidade, estado visual/mecânico.
- Pelo menos 1 caminho alternativo plausível que gere evidência e retorne à investigação.

### Intermediário
- 3 a 4 etapas técnicas obrigatórias.
- Pelo menos 2 hipóteses concorrentes plausíveis.
- Exige interpretação de uma ou mais medições.
- Pelo menos 1 desvio não terminal.
- Diagnóstico somente após um teste discriminatório.

### Avançado
- 4 a 6 etapas técnicas obrigatórias.
- Múltiplas hipóteses concorrentes.
- Bifurcações reais de investigação.
- Medições encadeadas e interpretação de comportamento dinâmico quando aplicável.
- Caminhos improdutivos que geram consequência/evidência sem encerrar imediatamente o caso.
- Confirmação final antes do diagnóstico.

## Sequência de projeto

Sintoma -> Segurança -> Observação inicial -> Medição -> Interpretação -> Teste discriminatório -> Confirmação -> Diagnóstico -> Ação corretiva.

Nem toda ocorrência precisa exibir todos os rótulos ao usuário, mas a lógica deve respeitar essa progressão.

## Tipos de nó

- `investigation`: etapa normal de investigação.
- `detour`: decisão plausível, porém pouco eficiente. Conta como erro, produz evidência e permite continuar.
- `unsafe`: ação insegura. Conta como erro, explica o risco e redireciona o usuário para um procedimento seguro.
- `wrong`: conclusão incorreta no fechamento do diagnóstico. Pode exigir retorno à etapa anterior.
- `solved`: diagnóstico confirmado.

## Regras obrigatórias

1. Nenhuma leitura pode revelar o resultado de um teste antes de o usuário escolher executar esse teste.
2. Nenhum diagnóstico pode depender de componente ausente do circuito, lista de componentes ou contexto da ocorrência.
3. A causa deve explicar integralmente o sintoma observado.
4. Toda conclusão deve ser sustentada pelas evidências produzidas na árvore.
5. Continuidade e resistência só devem ser medidas com o circuito em condição segura e desenergizada quando aplicável.
6. Não usar troca de componente como primeira ação quando uma medição simples pode isolar a falha.
7. Ações que eliminam proteções, como jumpers em contatos de segurança/proteção, devem ser tratadas como inseguras.
8. Alternativas erradas devem ser tecnicamente plausíveis; evitar respostas absurdas apenas para completar cinco opções.
9. O nível de dificuldade deve refletir a profundidade do diagnóstico, não apenas a complexidade do equipamento.
10. Evitar duplicar a mesma falha e o mesmo caminho de investigação em ocorrências diferentes.
11. Valores, bornes e nomenclaturas devem corresponder ao componente específico representado no diagrama.
12. Quando uma falha for intermitente, a árvore deve usar medições ou inspeções capazes de reproduzir ou capturar a intermitência.

## Critério de qualidade

Uma ocorrência só é aprovada quando:
- o sintoma é coerente com a falha;
- o circuito contém todos os componentes citados;
- todas as leituras são fisicamente plausíveis;
- a sequência de testes é segura;
- existe pelo menos uma hipótese concorrente plausível;
- o diagnóstico não é entregue prematuramente;
- a solução final explica por que as outras hipóteses foram descartadas.
