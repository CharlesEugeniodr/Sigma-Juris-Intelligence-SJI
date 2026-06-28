# ❓ FAQ — Perguntas Frequentes sobre o SJIF

## Introdução

Este documento reúne as perguntas mais frequentes sobre o **Sigma—Juris Intelligence Framework (SJIF)**, suas funcionalidades, arquitetura e utilização. Se sua dúvida não estiver aqui, consulte o [Manual Operacional — Cap. 38](../cap38_manual_operacional.md) ou entre em contato com o suporte técnico.

---

## 📋 Perguntas Gerais

### 1. O que é o Sigma—Juris Intelligence Framework (SJIF)?

O SJIF é um **Sistema Integrado de Inteligência Jurídica** — um framework metodológico completo que combina inteligência artificial, gestão do conhecimento e análise estratégica para transformar a prática jurídica. Ele é organizado em 40 capítulos, 14 diretórios, 23+ motores especializados e 6 bibliotecas de conhecimento.

### 2. Para quem o SJIF foi projetado?

O SJIF foi projetado para:
- **Advogados** — Análise de casos, pesquisa jurídica, elaboração de peças
- **Gestores Jurídicos** — Gestão de portfólio, KPIs, compliance
- **Departamentos Jurídicos** — Contencioso em massa, due diligence, contratos
- **Equipes de TI** — Implementação, integração, manutenção
- **Pesquisadores** — Pesquisa jurisprudencial, doutrinária e legislativa

### 3. O SJIF substitui o advogado?

**Não.** O SJIF é um **assistente inteligente**, não um substituto do profissional do Direito. Ele opera com base em dados, algoritmos e metodologias estruturadas, mas a interpretação final, a estratégia e a responsabilidade pela decisão jurídica permanecem **sempre** com o profissional. A Diretiva Mestra (Cap. 2) reforça que o SJIF é uma ferramenta de suporte, jamais de substituição.

### 4. Qual a diferença entre o SJIF e um software jurídico tradicional?

| Aspecto | Software Tradicional | SJIF |
|---------|---------------------|------|
| **Abordagem** | Gestão de processos e documentos | Inteligência jurídica integrada |
| **Análise** | Busca por palavras-chave | Busca semântica + IA |
| **Motores** | Não possui | 23+ motores especializados |
| **Estratégia** | Manual | Automatizada com simulações |
| **Conhecimento** | Armazenamento | Grafo de conhecimento interconectado |
| **Método** | Ad hoc | Método científico aplicado (Cap. 4) |

---

## 🔧 Perguntas Técnicas

### 5. Quais são os requisitos mínimos para implementar o SJIF?

| Componente | Mínimo |
|------------|--------|
| **CPU** | 8 cores |
| **RAM** | 32 GB |
| **Armazenamento** | 1 TB SSD |
| **Rede** | 1 Gbps |
| **SO** | Linux (Ubuntu 22.04+) |
| **Docker** | 24+ |
| **Python** | 3.11+ |
| **PostgreSQL** | 15+ |
| **Neo4j** | 5+ |

Para detalhes completos, consulte o [Manual Técnico — Cap. 37, Seção 37.3](../cap37_manual_implementacao.md).

### 6. O SJIF pode ser implantado na nuvem?

**Sim**, e essa é a abordagem **recomendada**. O SJIF suporta implantação em:
- **AWS** (Amazon Web Services)
- **Azure** (Microsoft)
- **Google Cloud Platform**
- **Nuvem híbrida** (combinação de on-premise e nuvem)
- **On-premise** (para organizações com requisitos regulatórios específicos)

### 7. Como o SJIF se integra com sistemas existentes (CMS, ERP)?

O SJIF oferece múltiplos mecanismos de integração:
- **APIs RESTful** — Endpoints completos para todas as funcionalidades
- **Webhooks** — Notificações em tempo real para sistemas externos
- **Conectores de Dados** — Integração com bancos de dados e fontes externas
- **Autenticação** — Suporte a LDAP, OAuth 2.0 e SAML

### 8. Quais bancos de dados o SJIF utiliza?

- **PostgreSQL** — Dados estruturados, metadados e configurações
- **Neo4j** — Grafo de Conhecimento Jurídico (relações entre entidades)
- **Elasticsearch** — Busca textual e semântica de alta performance
- **Apache Kafka** — Streaming de dados em tempo real

---

## 📊 Perguntas sobre Funcionalidades

### 9. O que é o Módulo Jurídico Forense (MJF)?

O MJF (Capítulo 25) é o módulo central de análise de casos do SJIF. Ele realiza:
1. **Instrução Processual** — Identifica tipo de ação, fase, competência, partes e pedidos
2. **Análise Documental Integral** — Leitura linha por linha, sem omissões
3. **Engenharia Reversa da Decisão** — Reconstrói o raciocínio do julgador
4. **Auditoria Jurídica** — Busca contradições, omissões e fundamentação insuficiente
5. **Pesquisa Automatizada** — Jurisprudência e doutrina relevantes
6. **Análise Estratégica** — Construção de teses e planos A, B, C
7. **Simulação** — Do julgador e da parte contrária
8. **Construção de Peças** — Petição, recurso, parecer, etc.

### 10. O que são os "Motores Especializados"?

Os Motores são componentes de inteligência que aplicam algoritmos específicos para diferentes tarefas. O SJIF possui 23+ motores, incluindo:

- **Motor Normativo** — Pesquisa e análise legislativa
- **Motor Jurisprudencial** — Análise de precedentes e padrões
- **Motor de Coerência Jurídica** — Auditoria de argumentação
- **Motor Decisório** — Análise de padrões de julgadores
- **Motor de Compliance** — Conformidade regulatória
- **Motor de Gestão de Riscos** — Identificação e mitigação de riscos
- **Motor de Simulação** — Cenários e previsões
- **Motor Recursal** — Estratégias de recurso

### 11. O que é o Grafo de Conhecimento Jurídico?

É uma estrutura de dados que registra **relações** entre fatos, provas, normas, jurisprudência, doutrina e estratégias. Diferente de um banco de dados tradicional, o grafo permite:
- Descobrir conexões ocultas entre entidades jurídicas
- Responder perguntas complexas (ex: "Quais precedentes semelhantes foram decididos favoravelmente por este julgador?")
- Visualizar relações de forma interativa

### 12. Como funciona a Busca Semântica?

A busca semântica do SJIF vai além de palavras-chave. Ela:
1. Compreende o **significado** do termo pesquisado
2. Identifica **sinônimos** e **conceitos relacionados**
3. Considera o **contexto jurídico** da busca
4. Retorna resultados de **múltiplas fontes** (legislação, jurisprudência, doutrina, documentos internos)
5. Ordena por **relevância semântica**, não apenas por frequência de termos

---

## 🔒 Perguntas sobre Segurança e Compliance

### 13. O SJIF está em conformidade com a LGPD?

**Sim.** O SJIF foi projetado com **privacidade por design** e inclui:
- Controle de acesso baseado em papéis (RBAC)
- Criptografia de dados em trânsito e em repouso
- Logs de auditoria completos
- Ferramentas de anonimização de dados
- Motor de Compliance específico para LGPD (Cap. 21 e Cap. 26)
- Políticas de retenção e descarte de dados

### 14. Como é feita a segurança dos dados no SJIF?

| Camada | Proteção |
|--------|----------|
| **Rede** | Firewalls, IDS/IPS, VPN |
| **Aplicação** | Autenticação multifator, RBAC, OAuth 2.0 |
| **Banco de Dados** | Criptografia AES-256, backups criptografados |
| **Transporte** | TLS 1.3 para todas as comunicações |
| **Auditoria** | Logs imutáveis de todas as operações |

---

## 📚 Perguntas sobre Conteúdo e Metodologia

### 15. O que é a Diretiva Mestra Jurídica?

A Diretiva Mestra (Cap. 2) é o coração filosófico do SJIF, estabelecendo princípios inegociáveis:
- **Nenhuma linha poderá ser ignorada** — Leitura integral de todo documento
- **Nenhuma prova poderá ser omitida** — Consideração de todas as evidências
- **Nenhuma decisão poderá ser ignorada** — Análise completa do histórico
- **Nenhuma jurisprudência relevante poderá ser desconsiderada** — Pesquisa exaustiva

### 16. Quantos capítulos e módulos compõem o SJIF?

| Componente | Quantidade |
|------------|-----------|
| **Capítulos** | 40 |
| **Diretórios** | 14 |
| **Motores Especializados** | 23+ |
| **Bibliotecas de Conhecimento** | 6 |
| **Kernels** | 12 (1 Principal + 11 Especializados) |
| **Blocos Temáticos** | 7 |

### 17. O SJIF é aplicável a todos os ramos do Direito?

**Sim.** O SJIF foi projetado com Kernels especializados para:
- Direito Civil, Empresarial, Tributário, Trabalhista
- Direito Ambiental, Minerário, Agrário
- Direito Administrativo, Constitucional
- Direito do Consumidor, Digital
- Arbitragem, Mediação, Recuperação Judicial, Licitações

### 18. Como os Modelos Matemáticos são aplicados?

O SJIF utiliza modelos matemáticos (Cap. 29) para quantificar análises jurídicas:
- **Modelo de Ponderação** — Peso dos argumentos
- **Modelo Probabilístico** — Chances de sucesso
- **Modelo Bayesiano** — Atualização de probabilidades com novas evidências
- **Modelo Multicritério** — Decisões com múltiplos fatores
- **Modelo de Sensibilidade** — Impacto de variáveis no resultado
- **Modelo de Risco** — Quantificação de contingências

---

## 🆘 Perguntas sobre Suporte

### 19. Onde posso obter ajuda?

| Canal | Descrição |
|-------|-----------|
| **Este FAQ** | Respostas rápidas para dúvidas comuns |
| **Manual Operacional** | [Cap. 38](../cap38_manual_operacional.md) — Guia completo de uso |
| **Manual Técnico** | [Cap. 37](../cap37_manual_implementacao.md) — Implementação e configuração |
| **Guia Rápido** | [10 Passos](guia_rapido.md) — Início rápido |
| **Suporte Técnico** | Canal direto com a equipe de suporte |
| **Treinamentos** | Sessões periódicas de capacitação |

### 20. Com que frequência o SJIF é atualizado?

O SJIF segue um ciclo de evolução contínua documentado no [Roadmap](../../ROADMAP.md):
- **Patches** (correções) — Conforme necessidade
- **Minor releases** — Novas funcionalidades a cada trimestre
- **Major releases** — Evolução arquitetural e novos módulos

---

## Referências

- [Guia Rápido — 10 Passos](guia_rapido.md)
- [Manual Operacional — Cap. 38](../cap38_manual_operacional.md)
- [Manual Técnico — Cap. 37](../cap37_manual_implementacao.md)
- [Casos de Uso — Cap. 39](../../13_CASOS_DE_USO/cap39_casos_de_uso.md)
- [Roadmap de Evolução](../../ROADMAP.md)
- [CHANGELOG](../../CHANGELOG.md)

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
