# Extração de Informação de Textos Jurídicos

## Visão Geral

A **Extração de Informação (EI)** é uma técnica de Processamento de Linguagem Natural (PLN) que identifica e estrutura automaticamente entidades, relações e atributos relevantes contidos em textos jurídicos não estruturados. No Sigma—Juris Intelligence Framework (SJIF), a EI é o primeiro passo para transformar documentos jurídicos brutos — petições, sentenças, contratos, leis — em dados estruturados que alimentam o [Grafo de Conhecimento Jurídico](../../14_ONTOLOGIA_GRAFO/cap28_grafo_conhecimento.md) e os motores especializados.

---

## Técnicas Principais

### Reconhecimento de Entidades Nomeadas (NER — Named Entity Recognition)

Identificação automática de entidades em textos jurídicos:

| Tipo de Entidade | Exemplos | Tag |
|-----------------|----------|-----|
| **Pessoa** | "João da Silva", "Maria dos Santos" | `PER` |
| **Organização** | "Banco do Brasil S.A.", "TJMG" | `ORG` |
| **Legislação** | "Art. 5º, CF/88", "Lei nº 8.078/90" | `LEG` |
| **Data** | "15/03/2024", "exercício de 2023" | `DATE` |
| **Valor Monetário** | "R$ 50.000,00", "200 salários mínimos" | `MON` |
| **Localização** | "Belo Horizonte/MG", "Comarca de São Paulo" | `LOC` |
| **Processo** | "Processo nº 0001234-56.2024.8.13.0024" | `PROC` |
| **Jurisprudência** | "Súmula 331/TST", "RE 574.706/PR" | `JUR` |

### Extração de Relações (RE — Relation Extraction)

Identificação das conexões semânticas entre entidades:

- `[PARTE] é representada por [ADVOGADO]`
- `[SENTENÇA] aplica [LEI]`
- `[PROCESSO] tramita em [TRIBUNAL]`
- `[CONTRATO] foi firmado entre [PARTE_A] e [PARTE_B]`
- `[DECISÃO] cita [JURISPRUDÊNCIA]`

### Extração de Eventos

Identificação de acontecimentos jurídicos com seus participantes e circunstâncias:

- **Ajuizamento**: quem ajuizou, contra quem, em qual foro, em que data
- **Decisão**: quem decidiu, o que decidiu, com base em que fundamentos
- **Recurso**: quem recorreu, de qual decisão, para qual tribunal

---

## Pipeline de Extração no SJIF

```mermaid
flowchart LR
    A["Documento<br/>Jurídico Bruto"] --> B["Pré-processamento<br/>Tokenização, Segmentação"]
    B --> C["NER<br/>Entidades Nomeadas"]
    C --> D["RE<br/>Extração de Relações"]
    D --> E["Normalização<br/>Resolução de Correferência"]
    E --> F["Grafo de Conhecimento<br/>Dados Estruturados"]

    style A fill:#c0392b,color:#fff
    style F fill:#117a65,color:#fff
```

---

## Tecnologias e Ferramentas

| Tecnologia | Uso no SJIF |
|-----------|------------|
| **SpaCy** | NER, tokenização, segmentação de sentenças |
| **Transformers (BERT/GPT)** | NER contextual, extração de relações |
| **Stanza** | Análise sintática e morfológica em português |
| **Regular Expressions** | Padrões estruturados (números de processo, artigos de lei) |
| **Modelos Fine-tuned** | NER e RE treinados em corpus jurídico brasileiro |

---

## Desafios Específicos do Domínio Jurídico

> [!WARNING]
> A linguagem jurídica apresenta desafios únicos para a extração de informação.

- **Linguagem arcaica e formal**: Termos como "outrossim", "data venia", "ad argumentandum"
- **Ambiguidade**: "Ação" pode ser processo judicial ou participação societária
- **Referências cruzadas**: "Nos termos do artigo supracitado..." exige resolução de contexto
- **Documentos longos**: Sentenças e acórdãos podem ter centenas de páginas
- **Formatação variável**: Diferentes tribunais usam formatos distintos

---

## Integração com Motores do SJIF

| Motor | Uso da Extração de Informação |
|-------|------------------------------|
| **Grafo de Conhecimento** (Cap. 28) | População de nós e arestas com entidades e relações extraídas |
| **Motor Normativo** (Cap. 26) | Identificação de normas citadas em textos |
| **Motor Jurisprudencial** (Cap. 26) | Extração de precedentes e citações jurisprudenciais |
| **Motor Probatório** (Cap. 26) | Identificação e catalogação de provas referenciadas |
| **MJF** (Cap. 25) | Análise documental integral automatizada |

### Referências Cruzadas

- [Capítulo 30: Inteligência Artificial Aplicada ao Direito](../cap30_ia_direito.md)
- [Capítulo 27: Ontologia Jurídica](../../14_ONTOLOGIA_GRAFO/cap27_ontologia_juridica.md)
- [Capítulo 28: Grafo de Conhecimento Jurídico](../../14_ONTOLOGIA_GRAFO/cap28_grafo_conhecimento.md)
- [Análise de Sentimento](analise_sentimento.md)
- [Geração de Linguagem Natural](geracao_linguagem.md)

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
