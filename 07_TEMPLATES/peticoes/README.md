# 📋 Petições Processuais

> **Diretório**: `07_TEMPLATES/peticoes/`
> **Categoria**: Templates de Petições

## Propósito

Fornecer modelos padronizados e inteligentes para a elaboração de todas as petições processuais no âmbito do Juris Intelligence Framework (JIF). Os templates de petições são projetados para garantir a conformidade processual, a completude argumentativa e a padronização de formato, otimizando o tempo de produção sem comprometer a qualidade técnica.

## Tipos de Documento

| Tipo | Descrição |
|---|---|
| **Petição Inicial** | Modelo completo para início de ação judicial com qualificação, fatos, direito, pedidos |
| **Contestação** | Modelo para resposta do réu com preliminares, mérito e pedidos |
| **Réplica** | Modelo para manifestação do autor sobre a contestação |
| **Impugnação** | Modelo para impugnação de documentos, valores, cálculos |
| **Manifestação** | Modelo genérico para manifestações nos autos |
| **Petição Intermediária** | Modelos para requerimentos diversos durante o processo |
| **Petição de Tutela de Urgência** | Modelo para pedidos de tutela antecipada e cautelar |
| **Embargos à Execução** | Modelo para oposição em processos executivos |
| **Cumprimento de Sentença** | Modelo para início de fase de cumprimento |

## Estrutura Padrão

```
1. Cabeçalho e Endereçamento
2. Qualificação das Partes
3. Dos Fatos
4. Do Direito (Fundamentação Jurídica)
   4.1. Legislação aplicável
   4.2. Jurisprudência relevante
   4.3. Doutrina de suporte
5. Das Provas
6. Dos Pedidos
7. Do Valor da Causa
8. Fechamento e Assinatura
```

## Campos Dinâmicos

```
{{vara_competente}}        → Vara/Juízo competente
{{nome_autor}}             → Nome completo do autor
{{cpf_cnpj_autor}}         → CPF/CNPJ do autor
{{endereco_autor}}         → Endereço completo
{{nome_reu}}               → Nome completo do réu
{{cpf_cnpj_reu}}           → CPF/CNPJ do réu
{{endereco_reu}}           → Endereço do réu
{{fatos_resumo}}           → Resumo dos fatos principais
{{fundamento_legal}}       → Dispositivos legais aplicáveis
{{valor_causa}}            → Valor da causa
{{pedidos_lista}}          → Lista de pedidos
{{advogado_nome}}          → Nome do advogado
{{oab_numero}}             → Número da OAB
{{data_peticao}}           → Data da petição
```

## Integração com Motores

- **MJF (Cap. 25)** — Sugere tipo de petição e pré-preenche com dados do caso
- **Motor Normativo** — Atualiza fundamentos legais conforme legislação vigente
- **Motor Jurisprudencial** — Sugere jurisprudência relevante para fundamentação
- **MCJ (Cap. 23)** — Audita coerência entre fatos, fundamentos e pedidos
- **Motor de Coerência** — Verifica consistência da argumentação

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
