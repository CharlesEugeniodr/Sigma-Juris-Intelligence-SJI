# Schema de Propriedades do SJIF

## Visão Geral

Este documento define as **propriedades** (atributos) utilizadas para descrever [entidades](entidades.md) e [relações](relacoes.md) no [Grafo de Conhecimento Jurídico](../cap28_grafo_conhecimento.md) do SJIF. As propriedades enriquecem os nós e arestas com informações adicionais que permitem filtragem, busca, análise e raciocínio sobre os dados.

---

## Tipos de Propriedades

### Classificação por Natureza

| Tipo | Descrição | Exemplos |
|------|-----------|----------|
| **Identificadora** | Identifica unicamente a entidade | `numero_processo`, `cpf`, `cnpj` |
| **Descritiva** | Descreve características | `ementa`, `descricao`, `nome` |
| **Temporal** | Relacionada a tempo | `data_ajuizamento`, `prazo`, `vigencia_inicio` |
| **Numérica** | Valores quantitativos | `valor_causa`, `score_risco`, `peso_probatorio` |
| **Categórica** | Classificação em categorias | `tipo_acao`, `fase`, `ramo_direito` |
| **Booleana** | Verdadeiro ou falso | `segredo_justica`, `transitado_julgado` |
| **Computada** | Calculada pelo SJIF | `irj_score`, `irf_score`, `probabilidade_sucesso` |
| **Metadado** | Sobre o próprio dado | `fonte_extracao`, `data_atualizacao`, `confianca` |

---

## 1. Propriedades Comuns (Todas as Entidades)

| Propriedade | Tipo | Descrição |
|------------|------|-----------|
| `id` | UUID | Identificador único no SJIF |
| `tipo` | String | Tipo da entidade conforme [Ontologia](../cap27_ontologia_juridica.md) |
| `data_criacao` | DateTime | Quando o nó foi criado no grafo |
| `data_atualizacao` | DateTime | Última atualização |
| `fonte` | String | Origem dos dados (tribunal, documento, manual) |
| `confianca` | Float (0-1) | Grau de confiança na extração/inserção |
| `verificado` | Boolean | Se foi verificado por humano |
| `versao` | Integer | Versão do registro |
| `tags` | String[] | Tags de classificação livre |

---

## 2. Propriedades Temporais

| Propriedade | Tipo | Aplica-se a | Descrição |
|------------|------|------------|-----------|
| `data_inicio` | Date | Processo, Contrato, Vigência | Data de início |
| `data_fim` | Date | Processo, Contrato, Vigência | Data de término |
| `data_publicacao` | Date | Norma, Decisão, Doutrina | Data de publicação |
| `data_vigencia` | Date | Norma | Início da vigência |
| `data_revogacao` | Date | Norma | Data de revogação |
| `data_transito` | Date | Decisão | Data do trânsito em julgado |
| `prazo_dias` | Integer | Ato Processual | Prazo em dias |
| `prazo_tipo` | Enum | Ato Processual | `úteis`, `corridos`, `horas` |
| `data_limite` | Date | Ato Processual | Data final do prazo |

---

## 3. Propriedades Numéricas / Financeiras

| Propriedade | Tipo | Aplica-se a | Descrição |
|------------|------|------------|-----------|
| `valor_causa` | Decimal | Processo | Valor da causa |
| `valor_condenacao` | Decimal | Decisão | Valor da condenação |
| `valor_acordo` | Decimal | Processo | Valor do acordo |
| `valor_honorarios` | Decimal | Decisão | Valor de honorários |
| `custas` | Decimal | Processo | Custas processuais |
| `multa` | Decimal | Decisão, Contrato | Valor de multa |
| `taxa_juros` | Float | Decisão | Taxa de juros aplicada |
| `indice_correcao` | String | Decisão | Índice de correção monetária |

---

## 4. Propriedades Categóricas

| Propriedade | Tipo | Valores Possíveis | Aplica-se a |
|------------|------|-------------------|------------|
| `ramo_direito` | Enum | Civil, Trabalhista, Tributário, Penal, Administrativo, Ambiental, Minerário, Agrário, Empresarial, Constitucional | Processo, Norma |
| `fase_processual` | Enum | Conhecimento, Instrução, Julgamento, Recursal, Execução, Cumprimento | Processo |
| `status` | Enum | Ativo, Suspenso, Arquivado, Baixado, Transitado | Processo |
| `status_norma` | Enum | Vigente, Revogada, Parcialmente Revogada, Não Vigente | Norma |
| `resultado` | Enum | Procedente, Improcedente, Parcialmente Procedente, Extinto sem mérito | Decisão |
| `grau_jurisdicao` | Enum | 1º Grau, 2º Grau, Superior, Supremo | Decisão, Órgão |
| `tipo_recurso` | Enum | Apelação, Agravo, Embargos, REsp, RE, RO | Recurso |
| `tipo_prova` | Enum | Documental, Testemunhal, Pericial, Oral, Digital | Prova |
| `classificacao_risco` | Enum | Provável, Possível, Remoto | Processo, Contingência |

---

## 5. Propriedades Booleanas

| Propriedade | Aplica-se a | Descrição |
|------------|------------|-----------|
| `segredo_justica` | Processo | Se tramita em segredo |
| `tutela_urgencia` | Processo | Se há tutela de urgência |
| `transitado_julgado` | Decisão | Se transitou em julgado |
| `prequestionado` | Recurso | Se houve prequestionamento |
| `efeito_suspensivo` | Recurso | Se tem efeito suspensivo |
| `liminar_concedida` | Decisão | Se liminar foi concedida |
| `acordo_realizado` | Processo | Se houve acordo |
| `vinculante` | Decisão | Se tem efeito vinculante |
| `anonimizado` | Entidade | Se dados foram anonimizados |

---

## 6. Propriedades Computadas (pelo SJIF)

| Propriedade | Tipo | Modelo de Origem | Descrição |
|------------|------|-----------------|-----------|
| `probabilidade_sucesso` | Float (0-1) | [Modelo Probabilístico](../../10_MODELOS_MATEMATICOS/modelo_probabilistico.md) | Probabilidade estimada de resultado favorável |
| `irj_score` | Float (0-1000) | [Modelo de Risco Jurídico](../../10_MODELOS_MATEMATICOS/modelo_risco_juridico.md) | Índice de Risco Jurídico |
| `irf_score` | Float (0-1) | [Modelo de Robustez](../../10_MODELOS_MATEMATICOS/modelo_robustez_fundamentacao.md) | Índice de Robustez da Fundamentação |
| `ipp_score` | Float (0-1) | [Modelo Peso Provas](../../10_MODELOS_MATEMATICOS/modelo_peso_provas.md) | Índice de Peso Probatório |
| `ipc_score` | Float (0-10) | [Modelo Priorização](../../10_MODELOS_MATEMATICOS/modelo_priorizacao.md) | Índice de Prioridade Composto |
| `similaridade` | Float (0-1) | Motor Jurisprudencial | Grau de similaridade com caso de referência |
| `sentimento` | Float (-2 a +2) | [Análise de Sentimento](../../11_INTELIGENCIA_ARTIFICIAL/pln/analise_sentimento.md) | Score de sentimento da decisão |
| `cluster` | Integer | [Aprendizado Não Supervisionado](../../11_INTELIGENCIA_ARTIFICIAL/machine_learning/aprendizado_nao_supervisionado.md) | Cluster ao qual o caso pertence |

---

## 7. Propriedades de Relações (Arestas)

| Propriedade | Tipo | Descrição |
|------------|------|-----------|
| `data_relacao` | Date | Quando a relação foi estabelecida |
| `confianca` | Float (0-1) | Confiança na extração da relação |
| `fonte` | String | De onde a relação foi extraída |
| `metodo_extracao` | Enum | Manual, NER, RE, Regra, ML |
| `peso` | Float | Importância/força da relação |
| `bidirecional` | Boolean | Se a relação é bidirecional |
| `contexto` | String | Contexto em que a relação existe |

---

## Regras de Validação

> [!IMPORTANT]
> Propriedades devem seguir as seguintes regras de validação.

1. **Obrigatoriedade**: Propriedades marcadas como obrigatórias no [schema de entidades](entidades.md) devem estar presentes
2. **Formato**: Datas em ISO 8601, valores monetários em BRL com 2 casas decimais
3. **Faixas**: Scores computados devem respeitar as faixas definidas em cada modelo
4. **Consistência**: Propriedades temporais devem ser consistentes (data_inicio < data_fim)
5. **Atualização**: Propriedades computadas devem ser recalculadas quando os dados de entrada mudam
6. **Privacidade**: Dados pessoais devem ser anonimizáveis conforme [políticas de privacidade](../../11_INTELIGENCIA_ARTIFICIAL/etica_ia/privacidade.md)

---

## Referências Cruzadas

- [Capítulo 27: Ontologia Jurídica](../cap27_ontologia_juridica.md)
- [Capítulo 28: Grafo de Conhecimento Jurídico](../cap28_grafo_conhecimento.md)
- [Schema de Entidades](entidades.md)
- [Schema de Relações](relacoes.md)
- [Vocabulário Controlado](../vocabulario_controlado.md)
- [Modelos Matemáticos](../../10_MODELOS_MATEMATICOS/cap29_modelos_matematicos.md)

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
