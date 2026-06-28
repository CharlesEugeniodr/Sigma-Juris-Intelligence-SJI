# 🚨 KRI de Litígio

> **Diretório**: `09_INDICADORES/kris/`
> **Tipo**: Indicador de Risco de Litígio
> **Referência**: [Capítulo 35 — Biblioteca de Indicadores](../cap35_kpis_kris.md)

## Definição

O KRI de Litígio monitora a **exposição da organização a processos judiciais e arbitrais**, rastreando o volume, valor, tendências e probabilidade de perdas em litígios ativos e potenciais. Este indicador é fundamental para a gestão proativa de contingências e para a alocação adequada de provisões.

## Sinais de Alerta

### Sinais de Alerta Precoce
- 📈 Aumento no volume de novas ações judiciais (>20% vs. período anterior)
- 📈 Crescimento do valor total de contingências passivas
- ⚠️ Surgimento de ações coletivas ou de classe
- ⚠️ Mudança jurisprudencial desfavorável em matéria relevante
- ⚠️ Decisões desfavoráveis em casos paradigmáticos

### Sinais de Alerta Crítico
- 🔴 Condenações de alto valor em série
- 🔴 Perda em caso com potencial de multiplicação (precedente negativo)
- 🔴 Bloqueio judicial de ativos significativos
- 🔴 Ação civil pública ou inquérito civil com exposição relevante
- 🔴 Temas repetitivos desfavoráveis em tribunais superiores

## Níveis de Risco

### 🟢 Baixo (Score 0-25)
- **Indicadores**: Volume de novas ações estável ou decrescente; contingências abaixo de 1% do faturamento; taxa de perda < 30%
- **Ações**: Monitoramento de rotina; revisão trimestral de contingências
- **Frequência de Revisão**: Trimestral

### 🟡 Médio (Score 26-50)
- **Indicadores**: Aumento moderado de novas ações (10-20%); contingências entre 1-3% do faturamento; surgimento de novas teses adversas
- **Ações**: Intensificação do monitoramento; revisão de estratégias de defesa; análise de viabilidade de acordos
- **Frequência de Revisão**: Mensal

### 🟠 Alto (Score 51-75)
- **Indicadores**: Aumento significativo de novas ações (>20%); contingências entre 3-5% do faturamento; decisões desfavoráveis em série
- **Ações**: Ativação do Plano B estratégico; priorização de acordos; revisão de provisionamento; alerta à alta direção
- **Frequência de Revisão**: Quinzenal

### 🔴 Crítico (Score 76-100)
- **Indicadores**: Explosão de volume processual; contingências > 5% do faturamento; risco de impacto no fluxo de caixa; bloqueios judiciais
- **Ações**: Ativação do Plano C (contingência); gestão de crise; comunicação com conselho/acionistas; contratação de reforço externo; revisão integral de estratégia
- **Frequência de Revisão**: Diária/Contínua

## Ações de Mitigação

| Nível | Ação de Mitigação |
|---|---|
| **Preventiva** | Consultoria jurídica preventiva; treinamentos para áreas de negócio; revisão de processos internos |
| **Corretiva** | Priorização de acordos estratégicos; revisão de teses de defesa; contratação de especialistas |
| **Contingencial** | Ativação de planos de crise; comunicação com stakeholders; provisionamento extraordinário |
| **Estrutural** | Revisão de políticas internas; mudança de processos operacionais; investimento em compliance |

### Fórmulas de Cálculo

```
Score de Risco = (Volume × Peso_V) + (Valor × Peso_Va) + (Tendência × Peso_T) + (Probabilidade × Peso_P)

Onde:
- Volume     = Nº novas ações / Nº ações encerradas (normalizado 0-100)
- Valor      = Contingência total / Faturamento × 100 (normalizado 0-100)
- Tendência  = Variação % do volume vs. período anterior (normalizado 0-100)
- Probabilidade = % de processos com classificação "provável" de perda
- Pesos sugeridos: Peso_V=0.25, Peso_Va=0.35, Peso_T=0.20, Peso_P=0.20
```

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
