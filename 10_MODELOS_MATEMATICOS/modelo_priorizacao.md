# Modelo de Priorização (Prioritization Model)

## Definição

O **Modelo de Priorização** é um método quantitativo que permite ordenar ações, demandas, processos ou tarefas jurídicas segundo critérios de urgência, importância, impacto e viabilidade. Ele combina múltiplas dimensões em um índice único de prioridade, possibilitando a alocação eficiente de recursos limitados.

No SJIF, o modelo de priorização é essencial para a gestão de portfólios de processos, a definição de agendas de trabalho e a seleção de quais demandas devem receber atenção prioritária.

---

## Fórmula / Método

### Índice de Prioridade Composto (IPC)

$$
IPC = \alpha \cdot U + \beta \cdot I + \gamma \cdot V + \delta \cdot R
$$

Onde:
- $IPC$ = Índice de Prioridade Composto (0 a 10)
- $U$ = Score de Urgência (0 a 10)
- $I$ = Score de Importância / Impacto (0 a 10)
- $V$ = Score de Viabilidade (0 a 10)
- $R$ = Score de Risco de inação (0 a 10)
- $\alpha, \beta, \gamma, \delta$ = Pesos dos critérios ($\alpha + \beta + \gamma + \delta = 1$)

### Matriz de Eisenhower Adaptada (Urgência × Importância)

| | **Alta Importância** | **Baixa Importância** |
|:---:|:---:|:---:|
| **Alta Urgência** | 🔴 Fazer Imediatamente | 🟡 Delegar ou Automatizar |
| **Baixa Urgência** | 🟢 Planejar e Agendar | ⚪ Eliminar ou Postergar |

### Classificação de Prioridade

| Faixa IPC | Classificação | Ação |
|-----------|--------------|------|
| 8.0 – 10.0 | Crítica | Ação imediata, máxima alocação de recursos |
| 6.0 – 7.9 | Alta | Ação prioritária no curto prazo |
| 4.0 – 5.9 | Média | Agendar e monitorar |
| 2.0 – 3.9 | Baixa | Acompanhar, agir quando possível |
| 0.0 – 1.9 | Mínima | Postergar ou eliminar |

---

## Aplicação Jurídica

- **Gestão de Portfólio de Processos**: Ordenar processos por prioridade para alocação de equipe
- **Triage de Demandas**: Classificar novas demandas que chegam ao escritório ou departamento
- **Priorização de Pesquisa**: Determinar quais temas de pesquisa jurídica devem ser investigados primeiro
- **Gestão de Prazos**: Priorizar tarefas quando múltiplos prazos se sobrepõem
- **Compliance**: Definir a ordem de implementação de ações corretivas

---

## Exemplo Prático

**Cenário**: Escritório com 4 processos urgentes e equipe limitada.

**Pesos definidos**: $\alpha = 0.30$, $\beta = 0.30$, $\gamma = 0.15$, $\delta = 0.25$

| Processo | Urgência (U) | Importância (I) | Viabilidade (V) | Risco (R) | **IPC** |
|----------|:---:|:---:|:---:|:---:|:---:|
| Ação Trabalhista (prazo 3 dias) | 9 | 6 | 8 | 8 | **7.70** |
| Recurso Extraordinário | 5 | 9 | 4 | 6 | **6.30** |
| Due Diligence M&A | 7 | 8 | 7 | 9 | **7.80** |
| Consultoria Tributária | 3 | 5 | 9 | 3 | **4.50** |

**Cálculo do IPC (Due Diligence M&A)**:

$$
IPC = 0.30 \times 7 + 0.30 \times 8 + 0.15 \times 7 + 0.25 \times 9 = 2.1 + 2.4 + 1.05 + 2.25 = 7.80
$$

**Ordem de Prioridade**: Due Diligence M&A (7.80) → Ação Trabalhista (7.70) → Recurso Extraordinário (6.30) → Consultoria Tributária (4.50)

---

## Limitações

- A definição dos pesos dos critérios é subjetiva e pode variar entre profissionais
- Não captura interdependências entre processos (um pode depender do outro)
- Scores de urgência e importância podem ser avaliados de forma inconsistente
- O modelo é estático — em ambientes dinâmicos, a priorização deve ser revista frequentemente
- Pode não considerar restrições de capacidade da equipe

---

## Integração com Motores

| Motor | Integração |
|-------|-----------|
| **Motor Estratégico** (Cap. 19) | Define prioridades de ação em planos estratégicos |
| **Motor de Gestão de Riscos** (Cap. 26) | Prioriza riscos por impacto e probabilidade |
| **Motor de Compliance** (Cap. 26) | Ordena ações corretivas por criticidade |
| **Motor Processual** (Cap. 26) | Prioriza movimentações processuais |

### Referências Cruzadas

- [Capítulo 29: Modelos Matemáticos](cap29_modelos_matematicos.md)
- [Modelo Multicritério](modelo_multicriterio.md)
- [Modelo de Risco Jurídico](modelo_risco_juridico.md)
- [Modelo de Ponderação](modelo_ponderacao.md)

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
