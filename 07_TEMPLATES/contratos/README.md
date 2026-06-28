# 📃 Contratos e Instrumentos Jurídicos

> **Diretório**: `07_TEMPLATES/contratos/`
> **Categoria**: Templates de Contratos

## Propósito

Fornecer modelos padronizados para a elaboração e revisão de contratos e instrumentos jurídicos, assegurando a inclusão de cláusulas essenciais, a conformidade com a legislação vigente e a mitigação de riscos contratuais. Os templates utilizam cláusulas condicionais e campos dinâmicos para adaptação a diferentes tipos de negócio e partes envolvidas.

## Tipos de Documento

| Tipo | Descrição |
|---|---|
| **Contrato de Compra e Venda** | Bens móveis, imóveis, participações societárias |
| **Contrato de Locação** | Imóveis residenciais, comerciais, equipamentos |
| **Contrato de Prestação de Serviços** | Serviços profissionais, consultoria, TI |
| **Contrato de Parceria** | Joint ventures, consórcios, parcerias comerciais |
| **Contrato de Trabalho** | CLT, temporário, experiência |
| **NDA (Confidencialidade)** | Acordos de não divulgação de informações |
| **Termos de Uso** | Plataformas digitais, aplicativos, serviços online |
| **Políticas de Privacidade** | Conformidade com LGPD |
| **Contrato de Distribuição** | Distribuição de produtos e mercadorias |
| **Contrato de Franquia** | Modelos de franquia empresarial |
| **Contrato de Licenciamento** | Propriedade intelectual, marcas, patentes |

## Estrutura Padrão

```
1. Qualificação das Partes
2. Cláusula de Objeto
3. Cláusula de Preço e Forma de Pagamento
4. Cláusula de Prazo e Vigência
5. Obrigações das Partes
6. Garantias
7. Cláusula de Confidencialidade
8. Cláusula de Propriedade Intelectual
9. Cláusula de Rescisão e Penalidades
10. Cláusula de Força Maior
11. Cláusula de Resolução de Conflitos (Foro/Arbitragem)
12. Disposições Gerais
13. Assinaturas e Testemunhas
```

## Campos Dinâmicos

```
{{parte_contratante}}      → Qualificação completa do contratante
{{parte_contratada}}       → Qualificação completa do contratado
{{objeto_contrato}}        → Descrição detalhada do objeto
{{valor_contrato}}         → Valor total do contrato
{{forma_pagamento}}        → Condições de pagamento
{{prazo_vigencia}}         → Duração do contrato
{{garantia_tipo}}          → Tipo de garantia (fiança, hipoteca, penhor)
{{foro_eleito}}            → Foro para resolução de disputas
{{clausula_arbitral}}      → Cláusula compromissória (se aplicável)
{{multa_rescisoria}}       → Valor/percentual da multa rescisória
{{indice_reajuste}}        → Índice de reajuste (IGPM, IPCA)
```

## Integração com Motores

- **Motor de Riscos** — Identifica e alerta sobre cláusulas de risco
- **Motor Normativo** — Verifica conformidade com CC, CDC, CLT, LGPD
- **Motor de Compliance** — Assegura conformidade com políticas internas
- **MCJ (Cap. 23)** — Audita coerência entre cláusulas
- **Motor Empresarial** — Contextualiza no ambiente de negócios

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
