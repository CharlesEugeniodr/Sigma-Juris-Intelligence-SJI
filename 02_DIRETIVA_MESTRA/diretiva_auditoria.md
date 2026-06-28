# Diretiva de Auditoria

> **02_DIRETIVA_MESTRA** | Diretiva Especializada #8
> Sigma—Juris Intelligence Framework (SJIF)

---

## Definição

A Diretiva de Auditoria direciona a **busca sistemática** por vulnerabilidades, contradições, omissões e fundamentação insuficiente em decisões judiciais, peças processuais e análises jurídicas. Ela é o mecanismo de controle de qualidade do SJIF.

## Escopo

Aplica-se à **auditoria de**:
- Decisões judiciais (sentenças, acórdãos, decisões interlocutórias)
- Peças processuais (petições, contestações, recursos)
- Contratos e instrumentos jurídicos
- Pareceres e consultas
- Análises produzidas pelo próprio SJIF
- Processos de due diligence
- Programas de compliance

## Regras-Chave

### 1. Tipos de Vulnerabilidades a Identificar

| Tipo | Descrição | Gravidade |
|---|---|---|
| **Omissão** | Falta de análise de fatos, provas, normas ou argumentos relevantes | 🔴 Crítica |
| **Contradição** | Argumentos ou conclusões que se opõem entre si | 🔴 Crítica |
| **Salto Argumentativo** | Ausência de conexão lógica entre premissas e conclusão | 🟠 Alta |
| **Fundamentação Insuficiente** | Argumentos superficiais ou genéricos | 🟠 Alta |
| **Fundamentação Aparente** | Fundamentação que parece completa mas é vazia | 🟠 Alta |
| **Erro Material** | Equívocos de fato ou de cálculo | 🟡 Média |
| **Erro de Premissa** | Partir de fato ou norma equivocada | 🟡 Média |
| **Erro de Interpretação** | Aplicação incorreta de métodos hermenêuticos | 🟡 Média |

### 2. Metodologia de Auditoria

A auditoria jurídica segue um processo estruturado:

1. **Escopo da Auditoria** — Definição do que será auditado e dos critérios de avaliação
2. **Coleta de Evidências** — Reunião de todos os documentos e informações relevantes
3. **Análise Sistemática** — Exame ponto a ponto dos elementos jurídicos
4. **Verificação de Coerência** — Uso do Motor de Coerência (Cap. 23) para detectar inconsistências
5. **Relatório de Achados** — Documentação detalhada de todas as vulnerabilidades encontradas
6. **Recomendações** — Sugestões de correção e melhoria para cada achado
7. **Acompanhamento** — Verificação da implementação das recomendações

### 3. Critérios de Avaliação

- **Coerência Interna** — Ausência de contradições internas
- **Coerência Externa** — Alinhamento com o ordenamento jurídico e jurisprudência
- **Consistência Fático-Probatória** — Aderência dos fatos às provas
- **Consistência Normativo-Argumentativa** — Correspondência entre normas e argumentos
- **Completude** — Todas as questões relevantes foram abordadas
- **Precisão** — Informações corretas e atualizadas

### 4. Auditoria das Análises do SJIF

O próprio SJIF deve ser auditado para garantir qualidade:
- Verificação de conformidade com a Diretiva Mestra
- Validação de fontes e referências citadas
- Controle de versões e rastreabilidade
- Avaliação da completude das análises

## Pontos de Integração

| Módulo/Motor | Tipo de Integração |
|---|---|
| **Auditoria Jurídica** (Cap. 22) | Metodologia detalhada |
| **Motor de Coerência** (Cap. 23) | Detecção automatizada de inconsistências |
| **Motor de Auditoria** (Cap. 26) | Automação de processos de auditoria |
| **Engenharia Reversa da Decisão** (Cap. 11) | Auditoria de decisões judiciais |
| **Engenharia da Fundamentação** (Cap. 9) | Auditoria da qualidade argumentativa |
| **Checklists** (Cap. 34) | Listas de verificação de auditoria |
| **Indicadores** (Cap. 35) | KPIs e KRIs de qualidade |

## Capítulos Relacionados

- [Cap. 2 — Diretiva Mestra](../00_GOVERNANCA/cap02_diretiva_mestra.md) — Contexto geral
- [Cap. 9 — Engenharia da Fundamentação](../03_FRAMEWORK/) — Identificação de falhas
- [Cap. 11 — Engenharia Reversa da Decisão](../03_FRAMEWORK/) — Análise de vulnerabilidades
- [Cap. 22 — Auditoria Jurídica](../04_MOTORES/) — Metodologia completa
- [Cap. 23 — Motor de Coerência](../04_MOTORES/) — Avaliação automatizada
- [Cap. 34 — Biblioteca de Checklists](../08_CHECKLISTS/) — Checklists de auditoria

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
