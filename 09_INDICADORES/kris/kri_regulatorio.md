# 🚨 KRI Regulatório

> **Diretório**: `09_INDICADORES/kris/`
> **Tipo**: Indicador de Risco Regulatório
> **Referência**: [Capítulo 35 — Biblioteca de Indicadores](../cap35_kpis_kris.md)

## Definição

O KRI Regulatório monitora a **exposição da organização a riscos de não conformidade com leis, regulamentos e normas setoriais**, rastreando mudanças legislativas, sanções regulatórias, resultados de auditorias e eficácia dos programas de compliance. Este indicador é essencial para prevenir sanções, multas e restrições operacionais.

## Sinais de Alerta

### Sinais de Alerta Precoce
- 📋 Mudanças legislativas significativas em áreas relevantes para o negócio
- 📋 Novas normas regulatórias publicadas por agências reguladoras
- ⚠️ Não conformidades identificadas em auditorias internas
- ⚠️ Atraso no cumprimento de obrigações regulatórias
- ⚠️ Aumento no volume de consultas regulatórias internas

### Sinais de Alerta Crítico
- 🔴 Sanções ou multas aplicadas por órgãos reguladores
- 🔴 Processos administrativos sancionadores instaurados
- 🔴 Suspensão ou revogação de licenças/autorizações
- 🔴 Investigações por órgãos de controle (TCU, CGU, MP)
- 🔴 Inclusão em lista de restrições regulatórias

## Níveis de Risco

### 🟢 Baixo (Score 0-25)
- **Indicadores**: Programa de compliance maduro; zero sanções no período; auditorias com achados menores; obrigações em dia
- **Ações**: Monitoramento regulatório de rotina; atualização periódica de políticas
- **Frequência de Revisão**: Trimestral

### 🟡 Médio (Score 26-50)
- **Indicadores**: Não conformidades moderadas identificadas; mudanças legislativas em andamento que impactam o negócio; atrasos pontuais em obrigações
- **Ações**: Plano de adequação às novas normas; reforço de treinamentos; monitoramento legislativo intensificado
- **Frequência de Revisão**: Mensal

### 🟠 Alto (Score 51-75)
- **Indicadores**: Múltiplas não conformidades; processo administrativo instaurado; risco de sanção regulatória; mudança legislativa disruptiva
- **Ações**: Plano de contingência regulatória; assessoria especializada; comunicação preventiva com reguladores; adequação emergencial
- **Frequência de Revisão**: Quinzenal

### 🔴 Crítico (Score 76-100)
- **Indicadores**: Sanção aplicada; licença/autorização suspensa; investigação em curso; risco de interrupção operacional
- **Ações**: Gestão de crise regulatória; negociação com reguladores; TAC/acordo de leniência; comunicação com conselho; revisão integral de compliance
- **Frequência de Revisão**: Diária/Contínua

## Ações de Mitigação

| Nível | Ação de Mitigação |
|---|---|
| **Preventiva** | Monitoramento legislativo contínuo; treinamentos regulatórios; auditorias internas periódicas |
| **Corretiva** | Planos de adequação; remediação de não conformidades; reporte proativo a reguladores |
| **Contingencial** | Defesa administrativa; negociação de TACs; gestão de crise regulatória |
| **Estrutural** | Reestruturação do programa de compliance; investimento em tecnologia regulatória (RegTech); contratação de especialistas |

### Fórmulas de Cálculo

```
Score de Risco = (NC × Peso_NC) + (Sanções × Peso_S) + (Mudanças × Peso_M) + (Gap × Peso_G)

Onde:
- NC        = Nº de não conformidades abertas (normalizado 0-100)
- Sanções   = Valor de multas/sanções no período (normalizado 0-100)
- Mudanças  = Nº de mudanças legislativas impactantes pendentes de adequação
- Gap       = % de obrigações regulatórias com atraso
- Pesos sugeridos: Peso_NC=0.25, Peso_S=0.30, Peso_M=0.25, Peso_G=0.20
```

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
