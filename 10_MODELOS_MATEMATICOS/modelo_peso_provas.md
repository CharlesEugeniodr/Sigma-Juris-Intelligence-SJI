# Modelo de Peso das Provas (Proof Weight Model)

## Definição

O **Modelo de Peso das Provas** é um método de valoração quantitativa que atribui pesos diferenciados às provas apresentadas em um processo judicial, com base em critérios como tipicidade, confiabilidade, pertinência, suficiência e integridade. Ele permite ao profissional do Direito avaliar objetivamente a força probatória do conjunto de evidências e identificar lacunas que precisam ser preenchidas.

No SJIF, este modelo integra a [Engenharia da Prova](../03_FRAMEWORK/) (Capítulo 8) e o [Motor Probatório](../04_MOTORES/) (Capítulo 26), fornecendo uma métrica quantitativa para a análise documental integral exigida pela Diretiva Mestra.

---

## Fórmula / Método

### Índice de Peso Probatório (IPP)

$$
IPP_j = \sum_{i=1}^{m} w_i \cdot c_{ji}
$$

Onde:
- $IPP_j$ = Índice de Peso da prova $j$
- $w_i$ = Peso do critério de avaliação $i$
- $c_{ji}$ = Avaliação da prova $j$ no critério $i$ (escala 0 a 1)
- $m$ = Número de critérios de avaliação

### Índice de Força Probatória Total (IFPT)

$$
IFPT = \frac{\sum_{j=1}^{p} IPP_j}{p \cdot IPP_{max}} \times 100\%
$$

### Critérios de Avaliação

| Critério ($i$) | Peso ($w_i$) | Descrição |
|----------------|-------------|-----------|
| Pertinência | 0.25 | Relevância da prova para os fatos em questão |
| Confiabilidade | 0.25 | Credibilidade da fonte e autenticidade da prova |
| Suficiência | 0.20 | Capacidade da prova de, por si só, demonstrar o fato |
| Legalidade | 0.15 | Conformidade com requisitos legais de produção da prova |
| Tempestividade | 0.15 | Apresentação dentro dos prazos processuais |

### Classificação do Peso Probatório

| Faixa IPP | Classificação | Descrição |
|-----------|--------------|-----------|
| 0.80 – 1.00 | Forte | Prova de alta confiabilidade e pertinência |
| 0.60 – 0.79 | Moderada | Prova relevante, mas com limitações |
| 0.40 – 0.59 | Fraca | Prova com fragilidades significativas |
| 0.00 – 0.39 | Insuficiente | Prova que dificilmente será considerada |

---

## Aplicação Jurídica

- **Análise de Acervo Probatório**: Avaliar a força do conjunto de provas disponíveis antes de ajuizar uma ação
- **Estratégia de Produção de Provas**: Identificar quais provas adicionais são necessárias para fortalecer a tese
- **Contestação de Provas**: Identificar fragilidades nas provas da parte adversa
- **Preparação para Audiência**: Priorizar provas para produção em audiência
- **Avaliação Recursal**: Determinar se houve cerceamento de defesa na valoração das provas

---

## Exemplo Prático

**Cenário**: Ação de rescisão contratual por descumprimento de obrigação.

| Prova | Pertinência | Confiabilidade | Suficiência | Legalidade | Tempestividade | **IPP** |
|-------|:---:|:---:|:---:|:---:|:---:|:---:|
| Contrato assinado | 1.0 | 0.9 | 0.8 | 1.0 | 1.0 | **0.935** |
| E-mails de cobrança | 0.9 | 0.7 | 0.5 | 0.8 | 1.0 | **0.775** |
| Testemunha presencial | 0.8 | 0.6 | 0.4 | 1.0 | 0.8 | **0.700** |
| Prints de WhatsApp | 0.7 | 0.5 | 0.3 | 0.6 | 1.0 | **0.590** |

**Cálculo do IPP (Contrato assinado)**:

$$
IPP = 0.25 \times 1.0 + 0.25 \times 0.9 + 0.20 \times 0.8 + 0.15 \times 1.0 + 0.15 \times 1.0 = 0.935
$$

**IFPT do conjunto**:

$$
IFPT = \frac{0.935 + 0.775 + 0.700 + 0.590}{4 \times 1.0} \times 100\% = 75.0\%
$$

**Interpretação**: O acervo probatório tem força moderada-forte. O contrato assinado é a prova mais forte; os prints de WhatsApp precisam de corroboração.

---

## Limitações

- A avaliação de cada critério envolve julgamento subjetivo do profissional
- Juízes podem atribuir pesos diferentes aos mesmos tipos de prova
- Não captura o efeito combinado de provas (uma prova fraca pode corroborar outra)
- O modelo é estático — não captura a evolução dinâmica do processo
- Diferentes jurisdições e ramos do Direito podem ter padrões probatórios distintos

---

## Integração com Motores

| Motor | Integração |
|-------|-----------|
| **Motor Probatório** (Cap. 26) | Valoração quantitativa do acervo probatório |
| **Motor de Coerência Jurídica** (Cap. 23) | Valida a aderência fatos-provas-fundamentos |
| **Motor Estratégico** (Cap. 19) | Alimenta estratégias de produção de provas |
| **Motor Decisório Jurídico** (Cap. 24) | Cruza peso das provas com padrões de valoração do julgador |

### Referências Cruzadas

- [Capítulo 8: Engenharia da Prova](../03_FRAMEWORK/)
- [Capítulo 29: Modelos Matemáticos](cap29_modelos_matematicos.md)
- [Modelo Bayesiano](modelo_bayesiano.md)
- [Modelo de Robustez da Fundamentação](modelo_robustez_fundamentacao.md)

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
