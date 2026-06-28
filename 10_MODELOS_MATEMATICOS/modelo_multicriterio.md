# Modelo Multicritério (Multi-criteria Model)

## Definição

O **Modelo Multicritério** é um método de análise de decisão que permite avaliar e classificar alternativas jurídicas considerando simultaneamente múltiplos critérios de natureza distinta — jurídicos, econômicos, estratégicos, temporais e de risco. Baseado em metodologias consagradas como AHP (Analytic Hierarchy Process) e TOPSIS, o modelo estrutura problemas decisórios complexos em hierarquias de critérios, permitindo comparações sistemáticas e a seleção da alternativa ótima.

No SJIF, o modelo multicritério é aplicado sempre que uma decisão jurídica envolve a avaliação de múltiplas dimensões que não podem ser reduzidas a um único indicador.

---

## Fórmula / Método

### Método AHP (Analytic Hierarchy Process)

**Etapa 1 — Matriz de Comparação Par a Par**:

Para $n$ critérios, construir uma matriz $A_{n \times n}$ onde $a_{ij}$ representa a importância relativa do critério $i$ em relação ao critério $j$.

**Etapa 2 — Cálculo dos Pesos Normalizados**:

$$
w_i = \frac{\bar{a}_i}{\sum_{j=1}^{n} \bar{a}_j}
$$

Onde $\bar{a}_i$ é a média geométrica da linha $i$ da matriz de comparação.

**Etapa 3 — Score Final de cada Alternativa**:

$$
S_k = \sum_{i=1}^{n} w_i \cdot r_{ki}
$$

Onde:
- $S_k$ = Score da alternativa $k$
- $w_i$ = Peso do critério $i$
- $r_{ki}$ = Avaliação da alternativa $k$ no critério $i$ (normalizada entre 0 e 1)

### Escala de Saaty para Comparação

| Valor | Significado |
|-------|------------|
| 1 | Igual importância |
| 3 | Importância moderada |
| 5 | Importância forte |
| 7 | Importância muito forte |
| 9 | Importância absoluta |

---

## Aplicação Jurídica

- **Seleção de Estratégia Processual**: Comparar Plano A, B e C considerando probabilidade, custo, tempo e risco
- **Avaliação de Propostas de Acordo**: Ponderar valor monetário, tempo de resolução, risco de perda e precedente
- **Priorização de Portfólio de Casos**: Classificar processos por urgência, valor, complexidade e probabilidade de sucesso
- **Due Diligence**: Avaliar riscos de aquisição considerando passivos trabalhistas, ambientais, tributários e cíveis
- **Compliance**: Priorizar ações de conformidade com base em impacto, probabilidade e custo de implementação

---

## Exemplo Prático

**Cenário**: Escolha entre três estratégias para um caso tributário.

**Critérios e Pesos**:

| Critério | Peso ($w_i$) |
|----------|-------------|
| Probabilidade de Sucesso | 0.35 |
| Custo | 0.20 |
| Tempo de Resolução | 0.15 |
| Risco de Precedente Negativo | 0.15 |
| Impacto Financeiro Positivo | 0.15 |

**Avaliação das Alternativas (0 a 1)**:

| Alternativa | Prob. Sucesso | Custo | Tempo | Risco Prec. | Impacto Fin. | **Score Final** |
|------------|:---:|:---:|:---:|:---:|:---:|:---:|
| A — Ação Anulatória | 0.7 | 0.4 | 0.3 | 0.6 | 0.8 | **0.575** |
| B — Mandado de Segurança | 0.8 | 0.6 | 0.8 | 0.5 | 0.6 | **0.685** |
| C — Acordo Administrativo | 0.5 | 0.9 | 0.9 | 0.9 | 0.4 | **0.685** |

**Interpretação**: Estratégias B e C empatam com o score mais alto, mas por razões diferentes — B favorece probabilidade e tempo, enquanto C favorece custo e baixo risco de precedente.

---

## Limitações

- A definição dos critérios e seus pesos envolve julgamento subjetivo
- Requer consistência na matriz de comparação par a par (razão de consistência < 0.1)
- Pode mascarar trade-offs importantes quando o score final é semelhante entre alternativas
- A normalização das avaliações pode distorcer diferenças absolutas significativas
- Critérios qualitativos precisam ser convertidos em escala numérica, o que pode perder nuances

---

## Integração com Motores

| Motor | Integração |
|-------|-----------|
| **Motor Estratégico** (Cap. 19) | Seleção de estratégias ótimas com múltiplos critérios |
| **Motor de Gestão de Riscos** (Cap. 26) | Priorização de riscos multidimensionais |
| **Motor de Coerência Jurídica** (Cap. 23) | Validação da consistência dos critérios aplicados |
| **Motor Decisório Jurídico** (Cap. 24) | Avaliação multicritério do perfil de julgadores |

### Referências Cruzadas

- [Capítulo 29: Modelos Matemáticos](cap29_modelos_matematicos.md)
- [Modelo de Ponderação](modelo_ponderacao.md)
- [Modelo de Priorização](modelo_priorizacao.md)

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
