# 🤝 Acordos e Transações

> **Diretório**: `07_TEMPLATES/acordos/`
> **Categoria**: Templates de Acordos

## Propósito

Fornecer modelos padronizados para a elaboração de acordos judiciais e extrajudiciais, termos de transação e instrumentos de mediação/conciliação. Os templates garantem a segurança jurídica das composições, a clareza das obrigações assumidas e a executabilidade dos termos pactuados.

## Tipos de Documento

| Tipo | Descrição |
|---|---|
| **Termo de Acordo Judicial** | Acordo homologado em juízo |
| **Termo de Acordo Extrajudicial** | Composição fora do processo judicial |
| **Termo de Transação** | Concessões mútuas para encerrar litígio |
| **Termo de Mediação** | Acordo resultante de sessão de mediação |
| **Termo de Conciliação** | Acordo em audiência de conciliação |
| **Acordo de Leniência** | Colaboração em processos administrativos |
| **Termo de Ajustamento de Conduta (TAC)** | Compromisso perante o MP ou órgão regulador |
| **Acordo Coletivo** | Negociações coletivas trabalhistas |

## Estrutura Padrão

```
1. Qualificação das Partes
2. Objeto do Acordo
3. Declarações das Partes
4. Cláusulas e Condições
   4.1. Obrigações de cada parte
   4.2. Valores e formas de pagamento
   4.3. Prazos e cronograma
5. Consequências do Descumprimento
6. Cláusula de Quitação
7. Cláusula de Confidencialidade (se aplicável)
8. Foro / Arbitragem
9. Assinaturas e Testemunhas
```

## Campos Dinâmicos

```
{{partes_acordo}}          → Qualificação de todas as partes
{{processo_referencia}}    → Número do processo (se judicial)
{{objeto_acordo}}          → Descrição do objeto do acordo
{{valor_acordo}}           → Valor total do acordo
{{parcelas_pagamento}}     → Detalhamento das parcelas
{{prazo_cumprimento}}      → Prazo para cumprimento
{{multa_descumprimento}}   → Penalidade por descumprimento
{{tipo_quitacao}}          → Ampla, geral e irrestrita / parcial
{{mediador_conciliador}}   → Nome do mediador/conciliador
```

## Integração com Motores

- **Motor de Negociação** — Auxilia na formulação de propostas e contrapropostas
- **Motor Estratégico** — Avalia cenários e viabilidade do acordo
- **Motor Matemático** — Calcula valores presentes e futuros das obrigações
- **MCJ (Cap. 23)** — Verifica coerência e completude do instrumento
- **Motor de Riscos** — Avalia riscos de descumprimento

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
