# ARCHITECTURE.md — Arquitetura Mestra do SJIF

## Sigma—Juris Intelligence Framework — Visão Arquitetural Completa

Este documento apresenta os diagramas visuais da arquitetura do SJIF, seus fluxos de operação e as interdependências entre componentes.

---

## 1. Diagrama de Camadas do SJIF

A arquitetura do SJIF é organizada em **5 camadas** hierárquicas, da infraestrutura de dados até a interface do usuário:

```mermaid
graph TB
    subgraph "CAMADA 5 — INTERFACE DO USUÁRIO"
        UI["🖥️ Interface Web<br/>React / Angular / Vue.js"]
        API["🔌 APIs RESTful<br/>Webhooks / GraphQL"]
        DASH["📊 Dashboards<br/>Visualização de Dados"]
    end

    subgraph "CAMADA 4 — BIBLIOTECAS DE CONHECIMENTO"
        BJ["📚 Biblioteca Jurídica<br/>16 Áreas do Direito"]
        BB["📋 Briefings<br/>Mestre + 20 Especializados"]
        BT["📝 Templates<br/>14 Categorias"]
        BC["✅ Checklists<br/>13+ Tipos"]
        BI["📈 Indicadores<br/>KPIs + KRIs"]
        BE["🎯 Estratégias<br/>5 Tipos"]
    end

    subgraph "CAMADA 3 — MOTORES DE INTELIGÊNCIA"
        ME["⚙️ Motores de Engenharia<br/>Processual / Prova / Fundamentação<br/>Pedidos / Reversa / Recursal / Execução"]
        MP["🔍 Motores de Pesquisa<br/>Normativo / Jurisprudencial<br/>Doutrinário / Benchmark / Comparado"]
        MS["🎯 Motores Estratégicos<br/>Estratégico / Riscos / Compliance<br/>Auditoria / Coerência / Decisório"]
        MT["🧮 Motores Técnicos<br/>Matemático / Estatístico<br/>Simulação / Negociação"]
        MA["🏛️ Motores por Área<br/>Empresarial / Tributário / Trabalhista<br/>Minerário / Ambiental / Agrário"]
    end

    subgraph "CAMADA 2 — PROCESSAMENTO E ARMAZENAMENTO"
        DB["🗄️ Bancos de Dados<br/>PostgreSQL / Neo4j"]
        DL["💾 Data Lakes<br/>Armazenamento Massivo"]
        SP["⚡ Processamento<br/>Apache Spark / Kafka"]
        IA["🤖 IA / PLN<br/>TensorFlow / PyTorch / SpaCy"]
    end

    subgraph "CAMADA 1 — COLETA DE DADOS"
        WS["🌐 Web Scrapers<br/>Tribunais / Diários Oficiais"]
        AT["📡 APIs de Tribunais<br/>e-SAJ / PJe / CNPJ"]
        ETL["🔄 ETL<br/>Extração / Transformação / Carga"]
        FD["📰 Feeds<br/>Notícias / Legislação"]
    end

    UI --> API
    API --> DASH
    
    BJ --> ME
    BB --> MS
    BT --> ME
    BC --> MS
    BI --> MS
    BE --> MS

    ME --> SP
    MP --> SP
    MS --> SP
    MT --> SP
    MA --> SP
    SP --> DB
    SP --> DL
    IA --> SP

    DB --> ETL
    DL --> ETL
    ETL --> WS
    ETL --> AT
    ETL --> FD

    style UI fill:#4A90D9,color:#fff
    style API fill:#4A90D9,color:#fff
    style DASH fill:#4A90D9,color:#fff
    style BJ fill:#7B68EE,color:#fff
    style BB fill:#7B68EE,color:#fff
    style BT fill:#7B68EE,color:#fff
    style BC fill:#7B68EE,color:#fff
    style BI fill:#7B68EE,color:#fff
    style BE fill:#7B68EE,color:#fff
    style ME fill:#2ECC71,color:#fff
    style MP fill:#2ECC71,color:#fff
    style MS fill:#2ECC71,color:#fff
    style MT fill:#2ECC71,color:#fff
    style MA fill:#2ECC71,color:#fff
    style DB fill:#E67E22,color:#fff
    style DL fill:#E67E22,color:#fff
    style SP fill:#E67E22,color:#fff
    style IA fill:#E67E22,color:#fff
    style WS fill:#E74C3C,color:#fff
    style AT fill:#E74C3C,color:#fff
    style ETL fill:#E74C3C,color:#fff
    style FD fill:#E74C3C,color:#fff
```

---

## 2. Arquitetura do Kernel Mestre Jurídico (KMJ)

O KMJ é o núcleo orquestrador que coordena todos os componentes do SJIF:

```mermaid
graph TB
    subgraph "KERNEL MESTRE JURÍDICO - KMJ"
        direction TB
        
        MIL["🧠 Motor de Inferência Lógica<br/>Raciocínio Formal + Ontologia"]
        GC["📌 Gerenciador de Contexto<br/>Estado da Análise"]
        MRC["⚖️ Módulo de Resolução<br/>de Conflitos Normativos"]
        APII["🔌 API Interna<br/>Comunicação Padronizada"]
        MAA["📈 Módulo de Aprendizado<br/>Adaptativo"]
    end

    subgraph "KERNELS ESPECIALIZADOS"
        KE["Kernel Executivo"]
        KP["Kernel Processual"]
        KES["Kernel Estratégico"]
        KR["Kernel Recursal"]
        KEM["Kernel Empresarial"]
        KAD["Kernel Administrativo"]
        KT["Kernel Tributário"]
        KTR["Kernel Trabalhista"]
        KMI["Kernel Minerário"]
        KAG["Kernel Agrário"]
        KAM["Kernel Ambiental"]
    end

    subgraph "FONTES DE CONHECIMENTO"
        ONT["📖 Ontologia Jurídica<br/>OWL / RDF"]
        GCJ["🕸️ Grafo de Conhecimento<br/>Neo4j / Neptune"]
        BIB["📚 Bibliotecas<br/>6 Repositórios"]
    end

    MIL --> GC
    GC --> MRC
    MRC --> APII
    APII --> MAA
    MAA --> MIL

    APII --> KE
    APII --> KP
    APII --> KES
    APII --> KR
    APII --> KEM
    APII --> KAD
    APII --> KT
    APII --> KTR
    APII --> KMI
    APII --> KAG
    APII --> KAM

    ONT --> MIL
    GCJ --> MIL
    BIB --> GC

    style MIL fill:#1a1a2e,color:#fff
    style GC fill:#16213e,color:#fff
    style MRC fill:#0f3460,color:#fff
    style APII fill:#533483,color:#fff
    style MAA fill:#e94560,color:#fff
```

---

## 3. Fluxo de Orquestração — Pipeline de Análise Jurídica

Fluxo completo de 10 passos do KMJ ao processar uma demanda:

```mermaid
sequenceDiagram
    actor U as Usuário/Advogado
    participant KMJ as Kernel Mestre Jurídico
    participant MJF as Módulo Jurídico Forense
    participant MN as Motor Normativo
    participant MJ as Motor Jurisprudencial
    participant MD as Motor Doutrinário
    participant MCJ as Motor de Coerência
    participant MDJ as Motor Decisório
    participant MM as Modelos Matemáticos
    participant ME as Motor Estratégico
    participant BT as Biblioteca Templates

    U->>KMJ: 1. Entrada de Dados (Documentos do Caso)
    KMJ->>MJF: 2. Processamento Inicial (PLN + Extração)
    MJF-->>KMJ: Entidades e Relações → Grafo de Conhecimento
    
    KMJ->>MN: 3. Análise Normativa
    MN-->>KMJ: Leis aplicáveis, vigência, hierarquia
    
    KMJ->>MJ: 4. Análise Jurisprudencial
    MJ-->>KMJ: Precedentes, súmulas, padrões decisórios
    
    KMJ->>MD: 5. Análise Doutrinária
    MD-->>KMJ: Correntes de pensamento, posições majoritárias
    
    KMJ->>MCJ: 6. Auditoria de Coerência
    MCJ-->>KMJ: Matriz de consistência, omissões, contradições
    
    KMJ->>MDJ: 7. Análise Preditiva
    KMJ->>MM: 7. Simulação de Cenários
    MDJ-->>KMJ: Perfil do julgador, probabilidade de acolhimento
    MM-->>KMJ: Probabilidades, riscos quantificados
    
    KMJ->>ME: 8. Geração de Estratégia
    ME-->>KMJ: Planos A/B/C, teses hierarquizadas
    
    KMJ->>BT: 9. Geração de Documentos
    BT-->>KMJ: Peças jurídicas pré-preenchidas
    
    KMJ->>U: 10. Entrega + Monitoramento Contínuo
```

---

## 4. Pipeline do Módulo Jurídico Forense (MJF) — 10 Camadas

O MJF é o motor mais complexo do SJIF, operando em 10 camadas sequenciais:

```mermaid
graph LR
    L1["1️⃣ Instrução<br/>Processual"]
    L2["2️⃣ Análise<br/>Documental<br/>Integral"]
    L3["3️⃣ Engenharia<br/>Reversa da<br/>Decisão"]
    L4["4️⃣ Auditoria<br/>Jurídica"]
    L5["5️⃣ Pesquisa<br/>Jurisprudencial"]
    L6["6️⃣ Pesquisa<br/>Doutrinária"]
    L7["7️⃣ Análise<br/>Estratégica"]
    L8["8️⃣ Simulação<br/>do Julgador"]
    L9["9️⃣ Simulação<br/>Parte Contrária"]
    L10["🔟 Construção<br/>da Peça"]

    L1 --> L2 --> L3 --> L4 --> L5 --> L6 --> L7 --> L8 --> L9 --> L10

    style L1 fill:#e74c3c,color:#fff
    style L2 fill:#e67e22,color:#fff
    style L3 fill:#f39c12,color:#fff
    style L4 fill:#27ae60,color:#fff
    style L5 fill:#2ecc71,color:#fff
    style L6 fill:#1abc9c,color:#fff
    style L7 fill:#3498db,color:#fff
    style L8 fill:#2980b9,color:#fff
    style L9 fill:#9b59b6,color:#fff
    style L10 fill:#8e44ad,color:#fff
```

**Detalhamento das Camadas:**

| Camada | Função | Entrada | Saída |
|:------:|--------|---------|-------|
| 1 | Instrução Processual | Documentos do caso | Tipo de ação, fase, competência, partes, pedidos |
| 2 | Análise Documental Integral | Todos os documentos | Mapa completo do processo (linha por linha) |
| 3 | Engenharia Reversa da Decisão | Decisões judiciais | Teses, provas aceitas/ignoradas, fundamentos |
| 4 | Auditoria Jurídica | Saídas anteriores | Vulnerabilidades, contradições, omissões |
| 5 | Pesquisa Jurisprudencial | Temas identificados | Precedentes, súmulas, temas repetitivos |
| 6 | Pesquisa Doutrinária | Temas identificados | Posições majoritárias/minoritárias |
| 7 | Análise Estratégica | Todas as saídas | Melhor tese, 2ª melhor, subsidiárias, Planos A/B/C |
| 8 | Simulação do Julgador | Perfil decisório | Probabilidade de acolhimento por tese |
| 9 | Simulação Parte Contrária | Análise estratégica | Melhor defesa possível, pontos de ataque |
| 10 | Construção da Peça | Estratégia definida | Petição, recurso, parecer (template preenchido) |

---

## 5. Mapa de Interdependências dos Motores

```mermaid
graph TB
    subgraph "MOTORES CORE"
        MN["Motor<br/>Normativo"]
        MJ["Motor<br/>Jurisprudencial"]
        MD["Motor<br/>Doutrinário"]
    end

    subgraph "MOTORES ANALÍTICOS"
        MCJ["Motor de<br/>Coerência"]
        MDJ["Motor<br/>Decisório"]
        MP["Motor<br/>Probatório"]
        MF["Motor de<br/>Fundamentação"]
    end

    subgraph "MOTORES ESTRATÉGICOS"
        MES["Motor<br/>Estratégico"]
        MGR["Motor Gestão<br/>de Riscos"]
        MC["Motor de<br/>Compliance"]
        MA["Motor de<br/>Auditoria"]
    end

    subgraph "MOTORES TÉCNICOS"
        MM["Motor<br/>Matemático"]
        MSI["Motor de<br/>Simulação"]
        MNE["Motor de<br/>Negociação"]
    end

    subgraph "INFRAESTRUTURA"
        ONT["Ontologia<br/>Jurídica"]
        GCJ["Grafo de<br/>Conhecimento"]
        IAM["IA / PLN /<br/>Machine Learning"]
    end

    %% Core → Analíticos
    MN --> MCJ
    MN --> MF
    MJ --> MCJ
    MJ --> MDJ
    MD --> MF

    %% Analíticos → Estratégicos
    MCJ --> MES
    MCJ --> MA
    MDJ --> MES
    MP --> MCJ
    MF --> MCJ

    %% Estratégicos → Técnicos
    MES --> MM
    MES --> MSI
    MGR --> MM
    MGR --> MSI
    MC --> MA

    %% Técnicos ↔ Estratégicos
    MM --> MES
    MSI --> MDJ
    MNE --> MES

    %% Infraestrutura → Todos
    ONT --> MN
    ONT --> MJ
    ONT --> MD
    GCJ --> MCJ
    GCJ --> MDJ
    IAM --> MN
    IAM --> MJ
    IAM --> MCJ
    IAM --> MDJ
    IAM --> MM

    style MN fill:#3498db,color:#fff
    style MJ fill:#3498db,color:#fff
    style MD fill:#3498db,color:#fff
    style MCJ fill:#2ecc71,color:#fff
    style MDJ fill:#2ecc71,color:#fff
    style MP fill:#2ecc71,color:#fff
    style MF fill:#2ecc71,color:#fff
    style MES fill:#e67e22,color:#fff
    style MGR fill:#e67e22,color:#fff
    style MC fill:#e67e22,color:#fff
    style MA fill:#e67e22,color:#fff
    style MM fill:#9b59b6,color:#fff
    style MSI fill:#9b59b6,color:#fff
    style MNE fill:#9b59b6,color:#fff
    style ONT fill:#34495e,color:#fff
    style GCJ fill:#34495e,color:#fff
    style IAM fill:#34495e,color:#fff
```

---

## 6. Matriz de Coerência Jurídica (MCJ)

O Motor de Coerência avalia 6 critérios para pontuar a qualidade técnica:

```mermaid
graph TD
    subgraph "MATRIZ DE CONSISTÊNCIA — 6 CRITÉRIOS"
        C1["1. Aderência<br/>Fatos ↔ Provas"]
        C2["2. Correspondência<br/>Pedidos ↔ Fundamentos"]
        C3["3. Cobertura<br/>Requisitos Legais"]
        C4["4. Confrontação<br/>Argumentativa"]
        C5["5. Adequação<br/>de Precedentes"]
        C6["6. Coerência<br/>Lógica Global"]
    end

    C1 --> SCORE["📊 SCORE DE<br/>COERÊNCIA<br/>0-100%"]
    C2 --> SCORE
    C3 --> SCORE
    C4 --> SCORE
    C5 --> SCORE
    C6 --> SCORE

    SCORE --> R1["✅ Aprovado (80-100%)"]
    SCORE --> R2["⚠️ Revisão Necessária (50-79%)"]
    SCORE --> R3["❌ Refazer (0-49%)"]

    style C1 fill:#3498db,color:#fff
    style C2 fill:#2ecc71,color:#fff
    style C3 fill:#e67e22,color:#fff
    style C4 fill:#9b59b6,color:#fff
    style C5 fill:#1abc9c,color:#fff
    style C6 fill:#e74c3c,color:#fff
    style SCORE fill:#2c3e50,color:#fff
    style R1 fill:#27ae60,color:#fff
    style R2 fill:#f39c12,color:#fff
    style R3 fill:#c0392b,color:#fff
```

---

## 7. Fluxo do Método Científico Aplicado ao Direito

```mermaid
graph LR
    O["1️⃣ Observação<br/>Definição do<br/>Problema"]
    H["2️⃣ Formulação<br/>de Hipóteses<br/>(Teses Jurídicas)"]
    C["3️⃣ Coleta de<br/>Dados<br/>(Fatos + Normas +<br/>Jurisprudência +<br/>Doutrina)"]
    T["4️⃣ Teste das<br/>Hipóteses<br/>(Motor de Coerência)"]
    CO["5️⃣ Formulação<br/>de Conclusões"]
    CM["6️⃣ Comunicação<br/>dos Resultados<br/>(Briefing/Peça)"]

    O --> H --> C --> T --> CO --> CM
    CM -.->|Feedback| O

    style O fill:#e74c3c,color:#fff
    style H fill:#e67e22,color:#fff
    style C fill:#f1c40f,color:#000
    style T fill:#2ecc71,color:#fff
    style CO fill:#3498db,color:#fff
    style CM fill:#9b59b6,color:#fff
```

---

## 8. Pirâmide de Kelsen — Hierarquia Normativa

```mermaid
graph TB
    N1["🏛️ CONSTITUIÇÃO FEDERAL<br/>Norma Suprema"]
    N2["📜 LEIS COMPLEMENTARES<br/>E ORDINÁRIAS"]
    N3["📋 DECRETOS E<br/>REGULAMENTOS"]
    N4["📄 ATOS NORMATIVOS<br/>LOCAIS E INTERNOS"]

    N1 --> N2 --> N3 --> N4

    style N1 fill:#c0392b,color:#fff
    style N2 fill:#e67e22,color:#fff
    style N3 fill:#f39c12,color:#fff
    style N4 fill:#27ae60,color:#fff
```

---

## 9. Tecnologias Subjacentes

| Camada | Tecnologias |
|--------|------------|
| **Frontend** | React.js / Angular / Vue.js, D3.js, Chart.js |
| **Backend** | Python, Node.js, APIs RESTful, GraphQL |
| **IA/ML** | scikit-learn, TensorFlow, PyTorch, NLTK, SpaCy |
| **Bancos de Dados** | PostgreSQL (relacional), Neo4j / Amazon Neptune (grafo) |
| **Processamento** | Apache Spark, Apache Kafka, Redis |
| **Infraestrutura** | Docker, Kubernetes, CI/CD |
| **Ontologia** | OWL, RDF, SPARQL |

---

## 10. Matriz de Risco — Probabilidade × Impacto

| | **Impacto Baixo** | **Impacto Médio** | **Impacto Alto** |
|---|:---:|:---:|:---:|
| **Probabilidade Alta** | 🟡 Médio | 🟠 Alto | 🔴 Crítico |
| **Probabilidade Média** | 🟢 Baixo | 🟡 Médio | 🟠 Alto |
| **Probabilidade Baixa** | 🟢 Baixo | 🟢 Baixo | 🟡 Médio |

---

> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
