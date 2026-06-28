# 📝 Pareceres e Opiniões Legais

> **Diretório**: `07_TEMPLATES/pareceres/`
> **Categoria**: Templates de Pareceres

## Propósito

Fornecer modelos padronizados para a elaboração de pareceres jurídicos e opiniões legais, com seções estruturadas que garantem a análise completa da questão jurídica consultada. Os templates asseguram clareza na exposição, profundidade na análise e objetividade nas conclusões e recomendações.

## Tipos de Documento

| Tipo | Descrição |
|---|---|
| **Parecer Jurídico** | Análise técnica sobre questão jurídica específica |
| **Opinião Legal (Legal Opinion)** | Manifestação formal sobre viabilidade jurídica |
| **Parecer Consultivo** | Resposta a consulta jurídica interna ou externa |
| **Parecer de Risco** | Avaliação de riscos jurídicos de operação ou decisão |
| **Parecer Regulatório** | Análise de conformidade com normas regulatórias |
| **Parecer Tributário** | Análise de questões fiscais e tributárias |
| **Parecer Contratual** | Análise de contratos e instrumentos jurídicos |
| **Nota Técnica** | Posicionamento técnico sobre tema jurídico |

## Estrutura Padrão

```
1. Identificação (Número, Data, Destinatário)
2. Objeto da Consulta
3. Resumo dos Fatos
4. Questões Jurídicas Formuladas
5. Análise Jurídica
   5.1. Legislação aplicável
   5.2. Jurisprudência relevante
   5.3. Doutrina de referência
   5.4. Análise de cenários
6. Conclusão
7. Recomendações
8. Ressalvas e Limitações
9. Assinatura e Identificação do Parecerista
```

## Campos Dinâmicos

```
{{numero_parecer}}         → Número sequencial do parecer
{{data_parecer}}           → Data de emissão
{{destinatario}}           → Nome/cargo do destinatário
{{objeto_consulta}}        → Descrição do objeto consultado
{{questoes_formuladas}}    → Perguntas a serem respondidas
{{parecerista_nome}}       → Nome do parecerista
{{oab_parecerista}}        → OAB do parecerista
{{area_direito}}           → Área do Direito aplicável
{{nivel_risco}}            → Classificação de risco (se aplicável)
```

## Integração com Motores

- **MJF (Cap. 25)** — Fornece análise completa do caso para embasamento
- **Motor Normativo** — Garante atualidade da legislação citada
- **Motor Jurisprudencial** — Identifica jurisprudência dominante sobre o tema
- **Motor Doutrinário** — Sugere referências doutrinárias relevantes
- **Motor de Riscos** — Quantifica riscos mencionados no parecer

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
