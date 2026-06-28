# 📨 Notificações e Correspondências

> **Diretório**: `07_TEMPLATES/notificacoes/`
> **Categoria**: Templates de Notificações

## Propósito

Fornecer modelos padronizados para a elaboração de notificações extrajudiciais, ofícios, cartas de cobrança e comunicados formais. Os templates garantem a validade jurídica das comunicações, a clareza na exposição e o cumprimento dos requisitos formais para produção de efeitos legais.

## Tipos de Documento

| Tipo | Descrição |
|---|---|
| **Notificação Extrajudicial** | Comunicação formal para constituição em mora ou interpelação |
| **Ofício** | Comunicação oficial para órgãos públicos |
| **Carta de Cobrança** | Comunicação formal de cobrança de débitos |
| **Comunicado Interno** | Informação/orientação para colaboradores |
| **Comunicado Externo** | Comunicação formal para terceiros |
| **Interpelação** | Requerimento formal de esclarecimentos |
| **Contranotificação** | Resposta formal a notificação recebida |
| **Aviso de Rescisão** | Comunicação formal de rescisão contratual |

## Estrutura Padrão

```
1. Cabeçalho (Remetente)
2. Destinatário (Qualificação completa)
3. Referência / Assunto
4. Corpo da Notificação
   4.1. Fatos
   4.2. Fundamento jurídico
   4.3. Requerimento/Exigência
5. Prazo para Resposta/Atendimento
6. Consequências do Descumprimento
7. Fechamento e Assinatura
8. Informações de Entrega (AR, cartório)
```

## Campos Dinâmicos

```
{{remetente_nome}}         → Nome do remetente
{{remetente_qualificacao}} → Qualificação completa
{{destinatario_nome}}      → Nome do destinatário
{{destinatario_endereco}}  → Endereço para entrega
{{assunto}}                → Assunto da notificação
{{prazo_resposta}}         → Prazo concedido (dias)
{{consequencia_legal}}     → Consequências do não atendimento
{{forma_entrega}}          → AR, cartório, e-mail com confirmação
{{data_notificacao}}       → Data da notificação
```

## Integração com Motores

- **Motor Normativo** — Verifica requisitos legais da notificação
- **Motor de Compliance** — Assegura conformidade com normas internas
- **Motor de Riscos** — Avalia riscos associados à comunicação
- **Motor Processual** — Vincula notificação a eventual processo futuro
- **MJF (Cap. 25)** — Contexto do caso para personalização

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
