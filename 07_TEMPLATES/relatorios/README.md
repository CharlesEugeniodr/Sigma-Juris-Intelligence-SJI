# 📊 Relatórios Jurídicos

> **Diretório**: `07_TEMPLATES/relatorios/`
> **Categoria**: Templates de Relatórios

## Propósito

Fornecer modelos padronizados para a produção de relatórios jurídicos analíticos, gerenciais e de risco. Os templates garantem a apresentação estruturada de dados, análises e recomendações, facilitando a tomada de decisão informada por gestores e stakeholders.

## Tipos de Documento

| Tipo | Descrição |
|---|---|
| **Relatório Analítico** | Análise detalhada de caso ou conjunto de processos |
| **Relatório Gerencial** | Visão executiva da performance da área jurídica |
| **Relatório de Risco** | Avaliação de exposição a riscos jurídicos |
| **Relatório de Contingências** | Mapeamento de passivos e provisões |
| **Relatório de Performance** | Métricas e KPIs da atuação jurídica |
| **Relatório de Portfólio** | Visão consolidada do acervo processual |
| **Relatório Periódico** | Acompanhamento mensal/trimestral/anual |

## Estrutura Padrão

```
1. Sumário Executivo
2. Escopo e Metodologia
3. Dados e Métricas
   3.1. Indicadores quantitativos
   3.2. Análise qualitativa
4. Análise e Interpretação
5. Comparativo (período anterior / benchmark)
6. Riscos Identificados
7. Recomendações
8. Anexos e Apêndices
```

## Campos Dinâmicos

```
{{periodo_analise}}        → Período coberto pelo relatório
{{destinatario_relatorio}} → Destinatário do relatório
{{total_processos}}        → Volume total de processos
{{valor_contingencias}}    → Valor total de contingências
{{taxa_sucesso}}           → Taxa de sucesso no período
{{custo_total}}            → Custo total da área jurídica
{{comparativo_anterior}}   → Dados do período anterior
{{grafico_tendencia}}      → Referência a gráficos de tendência
```

## Integração com Motores

- **Biblioteca de Indicadores (Cap. 35)** — Fornece KPIs e KRIs para preenchimento automático
- **Motor de Riscos** — Alimenta seções de análise de risco
- **Motor Estratégico** — Contextualiza performance vs. objetivos estratégicos
- **Plataforma de BI** — Gera gráficos e dashboards integrados
- **MJF (Cap. 25)** — Fornece dados detalhados de casos individuais

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
