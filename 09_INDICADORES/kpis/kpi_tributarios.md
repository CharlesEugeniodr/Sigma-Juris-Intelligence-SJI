# 🏦 KPIs Tributários

> **Diretório**: `09_INDICADORES/kpis/`
> **Tipo**: Indicadores de Performance Tributária
> **Referência**: [Capítulo 35 — Biblioteca de Indicadores](../cap35_kpis_kris.md)

## Definição

Os KPIs Tributários medem a **performance da gestão tributária**, avaliando a eficiência no contencioso fiscal, a recuperação de créditos tributários, a conformidade com obrigações fiscais e a eficácia do planejamento tributário. São fundamentais para a otimização da carga tributária e a gestão de contingências fiscais.

## Métricas Específicas

### KPI-T01: Taxa de Sucesso no Contencioso Tributário
- **Fórmula**: `(Processos tributários com resultado favorável / Total de processos tributários julgados) × 100`
- **Unidade**: Percentual (%)
- **Frequência**: Trimestral
- **Meta Sugerida**: ≥ 55%

### KPI-T02: Volume de Créditos Tributários Recuperados
- **Fórmula**: `Σ Valores de créditos efetivamente recuperados (restituição, compensação, precatório)`
- **Unidade**: R$ (reais)
- **Frequência**: Trimestral
- **Meta Sugerida**: Crescimento ≥ 15% a.a.

### KPI-T03: Taxa de Redução de Contingências Fiscais
- **Fórmula**: `((Contingência início do período - Contingência fim do período) / Contingência início do período) × 100`
- **Unidade**: Percentual (%)
- **Frequência**: Semestral
- **Meta Sugerida**: ≥ 10% de redução por período

### KPI-T04: Índice de Conformidade de Obrigações Acessórias
- **Fórmula**: `(Obrigações acessórias entregues no prazo / Total de obrigações acessórias devidas) × 100`
- **Unidade**: Percentual (%)
- **Frequência**: Mensal
- **Meta Sugerida**: 100%

### KPI-T05: Economia com Planejamento Tributário
- **Fórmula**: `(Carga tributária sem planejamento - Carga tributária com planejamento) / Carga tributária sem planejamento × 100`
- **Unidade**: Percentual (%)
- **Frequência**: Anual
- **Meta Sugerida**: ≥ 8% de economia

### KPI-T06: Eficácia na Defesa de Autos de Infração
- **Fórmula**: `(Autos anulados + reduzidos / Total de autos contestados) × 100`
- **Unidade**: Percentual (%)
- **Frequência**: Semestral
- **Meta Sugerida**: ≥ 60%

## Metas Sugeridas

| KPI | Meta Mínima | Meta Ideal | Meta Excelência |
|---|---|---|---|
| Sucesso Contencioso | ≥ 45% | ≥ 55% | ≥ 70% |
| Obrigações Acessórias | ≥ 98% | 100% | 100% com antecipação |
| Economia Planejamento | ≥ 5% | ≥ 8% | ≥ 12% |
| Defesa Autos | ≥ 50% | ≥ 60% | ≥ 75% |

## Fonte de Dados

- Receita Federal, Estadual e Municipal
- e-CAC / SPED / e-Social
- CARF (processos administrativos)
- Sistema de gestão tributária
- Kernel Tributário do JIF

## Dashboard Integration

Os KPIs Tributários alimentam o **Dashboard Tributário** com:
- Evolução de contingências fiscais (gráfico temporal por tributo)
- Pipeline de créditos tributários (pendentes → em análise → recuperados)
- Calendário de obrigações acessórias (cumpridas vs. pendentes)
- Mapa de autos de infração por esfera (federal/estadual/municipal)

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
