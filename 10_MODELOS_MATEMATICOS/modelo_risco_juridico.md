# Modelo de Risco Jurídico (Legal Risk Model)

## Definição

O **Modelo de Risco Jurídico** é um método de quantificação e classificação de riscos legais que combina a probabilidade de ocorrência de um evento adverso com o impacto financeiro, operacional ou reputacional que esse evento pode causar. Inspirado em metodologias de gestão de riscos corporativos (COSO, ISO 31000), o modelo é adaptado ao contexto jurídico para avaliar contingências, passivos, exposições regulatórias e riscos contratuais.

No SJIF, o modelo é central para o [Motor de Gestão de Riscos](../04_MOTORES/) (Capítulo 20/26), alimentando dashboards de contingência, relatórios de due diligence e a classificação de passivos jurídicos.

---

## Fórmula / Método

### Índice de Risco Jurídico (IRJ)

$$
IRJ = P \times I \times D
$$

Onde:
- $IRJ$ = Índice de Risco Jurídico (0 a 1000)
- $P$ = Probabilidade de ocorrência (1 a 10)
- $I$ = Impacto potencial (1 a 10)
- $D$ = Detectabilidade inversa — quão difícil é detectar o risco antes que se materialize (1 a 10; 10 = muito difícil)

### Matriz de Risco Jurídico (Probabilidade × Impacto)

| | **Impacto Baixo (1-3)** | **Impacto Médio (4-6)** | **Impacto Alto (7-10)** |
|:---:|:---:|:---:|:---:|
| **Prob. Alta (7-10)** | 🟡 Médio | 🟠 Alto | 🔴 Crítico |
| **Prob. Média (4-6)** | 🟢 Baixo | 🟡 Médio | 🟠 Alto |
| **Prob. Baixa (1-3)** | ⚪ Mínimo | 🟢 Baixo | 🟡 Médio |

### Classificação do Risco

| Faixa IRJ | Classificação | Ação Recomendada |
|-----------|--------------|------------------|
| 500 – 1000 | 🔴 Crítico | Ação imediata, provisão obrigatória |
| 200 – 499 | 🟠 Alto | Plano de mitigação prioritário |
| 80 – 199 | 🟡 Médio | Monitoramento e contingência |
| 20 – 79 | 🟢 Baixo | Acompanhamento padrão |
| 1 – 19 | ⚪ Mínimo | Registro e observação |

---

## Aplicação Jurídica

- **Gestão de Contingências**: Classificar passivos trabalhistas, cíveis, tributários e ambientais
- **Due Diligence**: Avaliar e quantificar riscos em operações de M&A
- **Compliance**: Mapear e priorizar riscos de não conformidade regulatória
- **Planejamento Estratégico**: Avaliar riscos de diferentes estratégias processuais
- **Governança Corporativa**: Alimentar relatórios de risco para conselho de administração
- **Provisão Contábil**: Subsidiar a classificação de contingências conforme CPC 25 / IAS 37

---

## Exemplo Prático

**Cenário**: Avaliação de riscos em portfólio de processos trabalhistas de uma empresa.

| Risco | Probabilidade (P) | Impacto (I) | Detectabilidade (D) | **IRJ** | Classificação |
|-------|:---:|:---:|:---:|:---:|:---:|
| Reconhecimento de vínculo (terceirização ilícita) | 8 | 9 | 6 | **432** | 🟠 Alto |
| Horas extras não pagas | 7 | 5 | 4 | **140** | 🟡 Médio |
| Assédio moral coletivo | 4 | 8 | 8 | **256** | 🟠 Alto |
| Acidente de trabalho (EPI fornecido) | 3 | 7 | 3 | **63** | 🟢 Baixo |
| FGTS sobre verbas indenizatórias | 6 | 3 | 2 | **36** | 🟢 Baixo |

**Interpretação**: A terceirização ilícita e o assédio moral coletivo são riscos de classificação **Alta**, exigindo planos de mitigação prioritários. O risco de reconhecimento de vínculo, por ter alta probabilidade e alto impacto, requer ação imediata (revisão de contratos de terceirização).

---

## Limitações

- A atribuição de valores de probabilidade, impacto e detectabilidade é subjetiva
- A multiplicação simples pode superestimar riscos com componentes medianos
- Não captura interdependências entre riscos (efeito dominó)
- A detectabilidade é um conceito menos intuitivo no contexto jurídico
- Requer revisão periódica à medida que o cenário jurídico evolui
- Risco reputacional é particularmente difícil de quantificar

---

## Integração com Motores

| Motor | Integração |
|-------|-----------|
| **Motor de Gestão de Riscos** (Cap. 26) | Instrumento central de classificação de riscos |
| **Motor de Compliance** (Cap. 26) | Mapeia riscos de não conformidade |
| **Motor Estratégico** (Cap. 19) | Avalia riscos de diferentes estratégias |
| **Biblioteca de Indicadores** (Cap. 35) | Alimenta KRIs (Key Risk Indicators) |
| **Motor de Auditoria** (Cap. 26) | Direciona foco de auditorias por risco |

### Referências Cruzadas

- [Capítulo 20: Gestão de Riscos Jurídicos](../04_MOTORES/)
- [Capítulo 29: Modelos Matemáticos](cap29_modelos_matematicos.md)
- [Modelo Probabilístico](modelo_probabilistico.md)
- [Modelo de Simulação de Cenários](modelo_simulacao_cenarios.md)
- [Modelo de Sensibilidade](modelo_sensibilidade.md)

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
