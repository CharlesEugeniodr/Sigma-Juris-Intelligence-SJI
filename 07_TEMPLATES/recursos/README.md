# ⚖️ Recursos e Peças Recursais

> **Diretório**: `07_TEMPLATES/recursos/`
> **Categoria**: Templates de Recursos

## Propósito

Fornecer modelos padronizados para a elaboração de todas as peças recursais previstas na legislação processual brasileira. Os templates de recursos são projetados para assegurar o cumprimento dos requisitos de admissibilidade, a precisão na delimitação das matérias de insurgência e a qualidade técnica da fundamentação recursal.

## Tipos de Documento

| Tipo | Descrição |
|---|---|
| **Apelação** | Recurso contra sentença de primeiro grau |
| **Agravo de Instrumento** | Recurso contra decisões interlocutórias |
| **Agravo Interno** | Recurso contra decisões monocráticas |
| **Embargos de Declaração** | Recurso para sanar omissão, contradição ou obscuridade |
| **Recurso Especial (REsp)** | Recurso ao STJ por violação de lei federal |
| **Recurso Extraordinário (RE)** | Recurso ao STF por violação constitucional |
| **Recurso Ordinário** | Recurso em mandado de segurança e habeas corpus |
| **Embargos de Divergência** | Recurso para uniformização de jurisprudência |
| **Contrarrazões** | Resposta ao recurso da parte contrária |

## Estrutura Padrão

```
1. Endereçamento
2. Identificação do Recorrente e Recorrido
3. Tempestividade e Preparo
4. Cabimento e Requisitos de Admissibilidade
5. Breve Resumo da Demanda
6. Das Razões de Insurgência
   6.1. Erro de fato / Erro de direito
   6.2. Violação legal específica
   6.3. Divergência jurisprudencial
7. Fundamentação Jurídica
8. Prequestionamento (quando aplicável)
9. Dos Pedidos
10. Fechamento e Assinatura
```

## Campos Dinâmicos

```
{{tribunal_destino}}       → Tribunal destinatário do recurso
{{numero_processo}}        → Número do processo originário
{{decisao_recorrida}}      → Síntese da decisão recorrida
{{data_intimacao}}         → Data da intimação da decisão
{{prazo_recursal}}         → Prazo do recurso (dias)
{{valor_preparo}}          → Valor do preparo recursal
{{pontos_insurgencia}}     → Pontos específicos de insurgência
{{dispositivo_violado}}    → Dispositivos legais violados
{{jurisprudencia_divergente}} → Acórdãos paradigmas
```

## Integração com Motores

- **Motor Recursal (Cap. 12)** — Analisa cabimento, prazos e probabilidade de sucesso
- **Motor Jurisprudencial** — Identifica precedentes e divergências para fundamentação
- **MCJ (Cap. 23)** — Audita coerência entre pontos de insurgência e fundamentação
- **Motor Estratégico** — Avalia relação custo-benefício do recurso
- **Motor Normativo** — Verifica requisitos de admissibilidade atualizados

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
