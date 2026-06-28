# 🕸️ 14_ONTOLOGIA_GRAFO — Ontologia Jurídica e Grafo de Conhecimento

## Visão Geral

Este diretório contém a documentação da **Ontologia Jurídica** e do **Grafo de Conhecimento Jurídico** do Sigma—Juris Intelligence Framework (SJIF). Juntos, estes componentes formam a camada semântica do framework — a estrutura que permite aos sistemas computacionais compreender, interpretar e raciocinar sobre o Direito com precisão e consistência.

> [!NOTE]
> A Ontologia Jurídica define **o que o Direito é** (conceitos, relações, regras), enquanto o Grafo de Conhecimento registra **como o Direito se manifesta** (instâncias concretas de normas, decisões, partes e suas interconexões).

## Arquitetura Semântica do SJIF

```mermaid
graph TD
    A["Camada Semântica do SJIF"] --> B["Ontologia Jurídica - Cap. 27"]
    A --> C["Grafo de Conhecimento Jurídico - Cap. 28"]
    
    B --> B1["Vocabulário Controlado"]
    B --> B2["Hierarquia de Conceitos"]
    B --> B3["Relações Semânticas"]
    B --> B4["Axiomas e Regras"]
    
    C --> C1["Nós - Entidades"]
    C --> C2["Arestas - Relações"]
    C --> C3["Propriedades"]
    
    B1 --> D["Schemas"]
    D --> D1["Entidades"]
    D --> D2["Relações"]
    D --> D3["Propriedades"]
    
    C --> E["Fontes de Dados"]
    E --> E1["Legislação"]
    E --> E2["Jurisprudência"]
    E --> E3["Doutrina"]
    E --> E4["Processos"]
    E --> E5["Contratos"]

    style A fill:#1a5276,color:#fff
    style B fill:#117a65,color:#fff
    style C fill:#7d3c98,color:#fff
    style D fill:#b9770e,color:#fff
    style E fill:#c0392b,color:#fff
```

## Conteúdo do Diretório

### Capítulos Principais

| Arquivo | Descrição |
|---------|-----------|
| [cap27_ontologia_juridica.md](cap27_ontologia_juridica.md) | **Capítulo 27** — OWL/RDF, Hierarquia de Conceitos, Relações Semânticas |
| [cap28_grafo_conhecimento.md](cap28_grafo_conhecimento.md) | **Capítulo 28** — Nós/Arestas/Propriedades, Fontes de Dados, Construção em 5 Etapas, Neo4j |

### Vocabulário e Schemas

| Arquivo | Descrição |
|---------|-----------|
| [vocabulario_controlado.md](vocabulario_controlado.md) | Vocabulário controlado de termos jurídicos do SJIF |
| [schemas/entidades.md](schemas/entidades.md) | Tipos de entidades (Partes, Processos, Normas, Decisões, etc.) |
| [schemas/relacoes.md](schemas/relacoes.md) | Tipos de relações (hierárquicas, causais, temporais, etc.) |
| [schemas/propriedades.md](schemas/propriedades.md) | Definições de propriedades para entidades e relações |

## Capítulos Relacionados

- [Capítulo 23: Motor de Coerência Jurídica](../04_MOTORES/)
- [Capítulo 24: Motor Decisório Jurídico](../04_MOTORES/)
- [Capítulo 26: Motores Especializados](../04_MOTORES/)
- [Capítulo 29: Modelos Matemáticos](../10_MODELOS_MATEMATICOS/cap29_modelos_matematicos.md)
- [Capítulo 30: Inteligência Artificial](../11_INTELIGENCIA_ARTIFICIAL/cap30_ia_direito.md)
- [Capítulo 37: Manual Técnico de Implementação](../12_DOCUMENTACAO/)
- [Capítulo 40: Kernel Mestre Jurídico](../01_KERNEL/)

## Tecnologias Utilizadas

| Tecnologia | Papel |
|-----------|-------|
| **OWL** (Web Ontology Language) | Representação formal da ontologia |
| **RDF** (Resource Description Framework) | Modelagem de relações semânticas |
| **SPARQL** | Consultas semânticas sobre a ontologia |
| **Neo4j** | Banco de dados de grafo para armazenamento do GCJ |
| **Amazon Neptune** | Alternativa cloud para o banco de dados de grafo |
| **SpaCy / NLTK** | Extração de entidades e relações de textos |

## Fluxo de Construção do Grafo

```mermaid
flowchart LR
    A["1. Extração de Entidades"] --> B["2. Extração de Relações"]
    B --> C["3. Normalização e Desambiguação"]
    C --> D["4. Enriquecimento via Ontologia"]
    D --> E["5. Armazenamento em Neo4j"]
    
    style A fill:#2e86c1,color:#fff
    style B fill:#2e86c1,color:#fff
    style C fill:#2e86c1,color:#fff
    style D fill:#2e86c1,color:#fff
    style E fill:#2e86c1,color:#fff
```

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
