# Motor Normativo

> **Sigma—Juris Intelligence Framework (SJIF) v1.0 | 04_MOTORES / Especializados**

## Definição

O **Motor Normativo** é o componente do JIF responsável por toda a inteligência relacionada à **legislação**. Sua função vai além da simples busca, englobando a análise, consolidação e interpretação das normas jurídicas aplicáveis a qualquer demanda. Ele atua como a base legislativa do framework, alimentando todos os demais motores com dados normativos precisos e atualizados.

---

## Funcionalidades Principais

### 1. Pesquisa Legislativa Avançada
Localiza leis, decretos, portarias e regulamentos em diversas bases de dados, utilizando **busca semântica** e filtros contextuais que vão além da correspondência simples de palavras-chave.

### 2. Consolidação de Normas
Apresenta o **texto atualizado** de uma norma, incorporando todas as alterações, revogações e aditamentos ao longo do tempo, permitindo visualizar o estado atual de qualquer dispositivo legal.

### 3. Análise de Vigência e Eficácia
Verifica se uma norma está:
- ✅ Em vigor
- ❌ Revogada
- ⏸️ Suspensa
- ↩️ Com efeitos retroativos
- ⏰ Com vacatio legis em curso

### 4. Mapeamento de Hierarquia Normativa
Posiciona a norma dentro da **pirâmide de Kelsen**, identificando sua relação com normas superiores (Constituição, leis complementares) e inferiores (decretos, portarias, regulamentos).

```
🏛️ Constituição Federal
  └── Emendas Constitucionais
      └── Leis Complementares
          └── Leis Ordinárias
              └── Medidas Provisórias
                  └── Decretos
                      └── Portarias / Resoluções
                          └── Instruções Normativas
```

### 5. Identificação de Conflitos Normativos
Alerta para possíveis **antinomias** ou conflitos entre diferentes dispositivos legais, aplicando critérios de:
- **Hierarquia** — Norma superior prevalece
- **Especialidade** — Norma especial prevalece sobre geral
- **Temporalidade** — Norma posterior prevalece

### 6. Análise de Impacto Legislativo
Avalia os potenciais efeitos de uma **nova lei ou alteração normativa** sobre um caso ou setor específico, identificando riscos e oportunidades.

### 7. Monitoramento Legislativo
Notifica sobre novas leis, projetos de lei ou alterações em normas existentes que sejam relevantes para as áreas de interesse do usuário, garantindo **atualização contínua**.

---

## Integração com Outros Motores

| Motor | Tipo de Integração |
|-------|-------------------|
| **Motor de Compliance** | Alimenta com leis e regulamentos aplicáveis para monitoramento de conformidade |
| **Motor Jurisprudencial** | Fornece a base normativa para análise de como tribunais interpretam as leis |
| **Motor Constitucional** | Recebe dados de hierarquia normativa para análise de constitucionalidade |
| **Motor de Coerência** | Fornece fundamentação normativa para verificação de aderência |
| **Motor Estratégico** | Base legislativa para construção de teses jurídicas |
| **Motor de Gestão de Riscos** | Dados normativos para identificação de riscos regulatórios |
| **MJF (Cap. 25)** | Suporte às Camadas 5 e 10 (pesquisa e construção da peça) |

---

## Tecnologias Subjacentes

- **Processamento de Linguagem Natural (PLN)** — Para consolidação de normas, análise de vigência e identificação de conflitos legislativos
- **Busca Semântica** — Para localização de normas por conceito e contexto, não apenas palavras-chave
- **Ontologia Jurídica (Cap. 27)** — Mapeamento de hierarquia e relações entre normas
- **Grafo de Conhecimento (Cap. 28)** — Rede de relações entre normas, com arestas como `regula`, `altera`, `revoga`, `cita`
- **Web Scraping / APIs** — Coleta automatizada de dados de bases legislativas oficiais
- **Sistemas de Alertas** — Monitoramento em tempo real de publicações no Diário Oficial

---

## Aplicações Práticas

1. **Análise de vigência normativa** para fundamentação de petições e pareceres
2. **Consolidação legislativa** para visualizar o estado atual de leis com múltiplas alterações
3. **Identificação de antinomias** em casos que envolvem conflito entre normas
4. **Monitoramento de mudanças regulatórias** para compliance empresarial
5. **Análise de impacto** de nova legislação sobre carteira de processos
6. **Mapeamento de hierarquia** para fundamentação constitucional
7. **Pesquisa legislativa exaustiva** para due diligence e auditoria jurídica

---

## Referências Cruzadas

- [Capítulo 14 — Pesquisa Legislativa](../../03_FRAMEWORK/)
- [Capítulo 26 — Motores Especializados](cap26_motores_especializados.md)
- [Capítulo 27 — Ontologia Jurídica](../../05_BIBLIOTECAS/)
- [Motor de Compliance](motor_compliance.md)
- [Motor Constitucional](motor_constitucional.md)

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
