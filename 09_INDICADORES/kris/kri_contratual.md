# 🚨 KRI Contratual

> **Diretório**: `09_INDICADORES/kris/`
> **Tipo**: Indicador de Risco Contratual
> **Referência**: [Capítulo 35 — Biblioteca de Indicadores](../cap35_kpis_kris.md)

## Definição

O KRI Contratual monitora a **exposição da organização a riscos originados em contratos e relações contratuais**, rastreando inadimplência, cláusulas vulneráveis, vencimentos críticos, disputas contratuais e concentração de risco em fornecedores ou clientes. Este indicador é essencial para a proteção de receitas, gestão de supply chain e prevenção de litígios contratuais.

## Sinais de Alerta

### Sinais de Alerta Precoce
- 📋 Aumento no volume de contratos próximos do vencimento sem renovação
- 📋 Crescimento de inadimplência contratual por contraparte
- ⚠️ Identificação de cláusulas vulneráveis ou omissas em contratos vigentes
- ⚠️ Disputas sobre interpretação de cláusulas contratuais
- ⚠️ Concentração de receita/dependência em poucos contratos

### Sinais de Alerta Crítico
- 🔴 Rescisão unilateral de contrato relevante por contraparte
- 🔴 Notificação extrajudicial de descumprimento contratual
- 🔴 Litígio contratual com valor significativo
- 🔴 Inadimplência sistêmica de contraparte estratégica
- 🔴 Falência ou recuperação judicial de contraparte

## Níveis de Risco

### 🟢 Baixo (Score 0-25)
- **Indicadores**: Inadimplência < 2%; contratos bem estruturados; diversificação de contrapartes; vencimentos controlados
- **Ações**: Revisão contratual periódica; monitoramento de vencimentos
- **Frequência de Revisão**: Trimestral

### 🟡 Médio (Score 26-50)
- **Indicadores**: Inadimplência entre 2-5%; cláusulas vulneráveis identificadas; concentração moderada de risco; vencimentos acumulados
- **Ações**: Renegociação preventiva; revisão de cláusulas críticas; diversificação de contrapartes
- **Frequência de Revisão**: Mensal

### 🟠 Alto (Score 51-75)
- **Indicadores**: Inadimplência entre 5-10%; disputas contratuais em andamento; contraparte em dificuldade financeira; contratos sem cláusulas de proteção
- **Ações**: Ativação de garantias contratuais; notificação formal; preparação de contencioso; busca de contrapartes alternativas
- **Frequência de Revisão**: Quinzenal

### 🔴 Crítico (Score 76-100)
- **Indicadores**: Inadimplência > 10%; litígio contratual relevante; rescisão de contrato estratégico; exposição financeira significativa
- **Ações**: Execução de garantias; ação judicial; gestão de crise; plano de contingência operacional; comunicação com stakeholders
- **Frequência de Revisão**: Diária/Contínua

## Ações de Mitigação

| Nível | Ação de Mitigação |
|---|---|
| **Preventiva** | Cláusulas de proteção robustas; due diligence de contrapartes; diversificação; seguro contratual |
| **Corretiva** | Renegociação de termos; reforço de garantias; notificações formais; mediação |
| **Contingencial** | Execução de garantias; ação judicial; substituição de contraparte; ativação de plano B |
| **Estrutural** | Revisão de políticas de contratação; padronização de contratos; implementação de CLM; KYC contratual |

### Fórmulas de Cálculo

```
Score de Risco = (Inadimplência × Peso_I) + (Vulnerabilidade × Peso_V) + (Concentração × Peso_C) + (Vencimento × Peso_Ve)

Onde:
- Inadimplência  = % de contratos com inadimplência (normalizado 0-100)
- Vulnerabilidade = % de contratos com cláusulas vulneráveis identificadas
- Concentração    = HHI de concentração de receita contratual (normalizado 0-100)
- Vencimento     = % de contratos vencendo nos próximos 90 dias sem renovação
- Pesos sugeridos: Peso_I=0.30, Peso_V=0.25, Peso_C=0.25, Peso_Ve=0.20
```

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
