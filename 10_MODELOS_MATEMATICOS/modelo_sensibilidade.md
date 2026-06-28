# Modelo de Sensibilidade (Sensitivity Model)

## Definição

O **Modelo de Sensibilidade** é um método analítico que avalia como as variações em um ou mais parâmetros de entrada afetam o resultado final de uma análise jurídica. Ele identifica quais variáveis têm maior impacto nos resultados, permitindo ao profissional do Direito concentrar esforços nos fatores mais críticos e compreender os riscos de incerteza em suas estimativas.

No SJIF, a análise de sensibilidade é aplicada para testar a robustez de conclusões jurídicas, avaliar cenários de risco e identificar os fatores que mais influenciam o resultado de um litígio ou de uma estratégia.

---

## Fórmula / Método

### Sensibilidade Univariada (One-at-a-Time)

$$
S_i = \frac{\Delta Y}{\Delta X_i} = \frac{Y(X_i + \delta) - Y(X_i - \delta)}{2\delta}
$$

Onde:
- $S_i$ = Sensibilidade do resultado $Y$ ao parâmetro $X_i$
- $\Delta Y$ = Variação no resultado
- $\Delta X_i$ = Variação no parâmetro $i$
- $\delta$ = Perturbação aplicada ao parâmetro

### Índice de Sensibilidade Normalizado

$$
IS_i = \frac{S_i \cdot X_i}{Y} \times 100\%
$$

Onde:
- $IS_i$ = Índice de sensibilidade percentual
- Indica a variação percentual no resultado para uma variação de 1% no parâmetro

### Classificação de Sensibilidade

| Índice | Classificação | Ação Recomendada |
|--------|--------------|------------------|
| > 50% | Alta sensibilidade | Atenção máxima, priorizar gestão |
| 20% – 50% | Sensibilidade moderada | Monitorar regularmente |
| < 20% | Baixa sensibilidade | Acompanhamento padrão |

---

## Aplicação Jurídica

- **Teste de Robustez de Teses**: Avaliar se uma conclusão muda quando premissas-chave são variadas
- **Análise de Valor de Causa**: Identificar quais variáveis mais impactam o valor estimado de uma condenação
- **Gestão de Portfólio**: Determinar quais processos são mais sensíveis a mudanças no cenário jurídico
- **Negociação**: Entender quais concessões têm maior impacto no resultado da negociação
- **Planejamento Tributário**: Avaliar o impacto de variações em alíquotas, bases de cálculo ou interpretações

---

## Exemplo Prático

**Cenário**: Análise de sensibilidade do valor esperado de uma ação indenizatória.

**Valor base estimado**: R$ 500.000,00

| Parâmetro | Variação | Impacto no Resultado | Índice de Sensibilidade |
|-----------|----------|---------------------|------------------------|
| Probabilidade de sucesso | ±10% | ±R$ 75.000 (15%) | **75%** (Alta) |
| Valor do dano moral | ±10% | ±R$ 40.000 (8%) | **40%** (Moderada) |
| Taxa de juros | ±10% | ±R$ 15.000 (3%) | **15%** (Baixa) |
| Correção monetária | ±10% | ±R$ 10.000 (2%) | **10%** (Baixa) |

**Interpretação**: A probabilidade de sucesso é o fator mais sensível — variações nesse parâmetro têm o maior impacto no resultado. Esforços devem ser concentrados em fortalecer a tese e as provas.

---

## Limitações

- A análise univariada não captura interações entre parâmetros
- Assume linearidade da relação entre parâmetros e resultado, o que nem sempre é verdade
- A definição da faixa de variação é subjetiva
- Não indica a probabilidade de cada cenário ocorrer (diferente da simulação de cenários)
- Requer um modelo de resultado bem definido para ser aplicada

---

## Integração com Motores

| Motor | Integração |
|-------|-----------|
| **Motor Estratégico** (Cap. 19) | Testa a robustez de estratégias jurídicas |
| **Motor de Gestão de Riscos** (Cap. 26) | Identifica fatores de risco mais sensíveis |
| **Motor Matemático** (Cap. 29) | Complementa modelos preditivos com análise de incerteza |
| **Motor de Coerência Jurídica** (Cap. 23) | Valida a consistência de premissas |

### Referências Cruzadas

- [Capítulo 29: Modelos Matemáticos](cap29_modelos_matematicos.md)
- [Modelo de Simulação de Cenários](modelo_simulacao_cenarios.md)
- [Modelo de Risco Jurídico](modelo_risco_juridico.md)
- [Modelo Probabilístico](modelo_probabilistico.md)

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
