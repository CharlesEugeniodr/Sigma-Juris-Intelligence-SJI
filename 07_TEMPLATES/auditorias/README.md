# 🔍 Auditorias Jurídicas

> **Diretório**: `07_TEMPLATES/auditorias/`
> **Categoria**: Templates de Auditoria

## Propósito

Fornecer modelos padronizados para a realização e documentação de auditorias jurídicas internas e externas. Os templates garantem a abrangência da análise, a documentação adequada dos achados, a classificação de riscos e a formulação de recomendações corretivas, integrando-se ao Motor de Auditoria do JIF.

## Tipos de Documento

| Tipo | Descrição |
|---|---|
| **Relatório de Auditoria Jurídica** | Documento consolidado de achados e recomendações |
| **Plano de Auditoria** | Planejamento de escopo, cronograma e metodologia |
| **Papéis de Trabalho** | Documentação de evidências e análises durante a auditoria |
| **Matriz de Achados** | Classificação e priorização de achados |
| **Relatório de Follow-up** | Acompanhamento de implementação de recomendações |
| **Parecer de Auditoria** | Opinião formal sobre a situação auditada |

## Estrutura Padrão

```
1. Identificação da Auditoria
2. Escopo e Objetivos
3. Metodologia Aplicada
4. Achados e Evidências
   4.1. Achado (descrição)
   4.2. Critério (norma/padrão esperado)
   4.3. Causa (por que ocorreu)
   4.4. Consequência (impacto)
   4.5. Recomendação (ação corretiva)
5. Classificação de Riscos
6. Plano de Ação Recomendado
7. Conclusão e Parecer
```

## Campos Dinâmicos

```
{{numero_auditoria}}       → Número sequencial da auditoria
{{tipo_auditoria}}         → Interna/Externa
{{area_auditada}}          → Área/departamento auditado
{{periodo_auditado}}       → Período coberto pela auditoria
{{equipe_auditora}}        → Membros da equipe de auditoria
{{total_achados}}          → Quantidade de achados
{{classificacao_geral}}    → Classificação geral de risco
{{prazo_acoes}}            → Prazo para implementação de ações
```

## Integração com Motores

- **Motor de Auditoria (Cap. 22)** — Direcionamento metodológico e padrões de auditoria
- **Motor de Compliance** — Verificação de conformidade normativa
- **MCJ (Cap. 23)** — Análise de coerência das decisões e peças auditadas
- **Motor de Riscos** — Classificação e priorização de achados por risco
- **Biblioteca de Checklists (Cap. 34)** — Checklists especializados para cada tipo de auditoria

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
