# 📋 CHANGELOG — Sigma—Juris Intelligence Framework (SJIF)

Todas as mudanças relevantes no projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [3.0.0] - 2026-06-28

### Added
- Backend API with FastAPI (server/)
- Motor de Inteligência Judicial (MIJ) with SET, IPT, TR, IAJ metrics
- MIJ API endpoints: magistrados, decisoes, tribunais, simulador
- Scraper modules for DataJud, TJMG, STJ
- Database models with SQLAlchemy (async)
- JWT authentication system
- Seed data for 50+ magistrados and 900+ decisões

### Fixed
- Security: bcrypt password hashing (replaced SHA256)
- Security: Removed hardcoded credentials from client JS
- Security: Protected /register endpoint
- Bug: Logout button ID mismatch
- Bug: Upload saveDocument method
- Bug: Process modal callback
- Connected metricas.py calculator to API

---

## [2.0.0] - 2026-06-27

### Added
- Frontend SPA with vanilla JavaScript
- Document classifier (197 legal document types)
- Document analyzer (9-element analysis)
- Dashboard with Chart.js visualizations
- IndexedDB-based local storage
- Hash-based SPA routing
- Dark theme premium design system
- MIJ Dashboard, Magistrados, and Simulador pages

---

## [1.0.0] — 2026-06-27

### 🎉 Lançamento Inaugural

Versão inaugural do Sigma—Juris Intelligence Framework (SJIF), consolidando a arquitetura mestra completa do Sistema Integrado de Inteligência Jurídica.

### Adicionado

#### Estrutura do Framework
- **14 diretórios** organizacionais (00_GOVERNANCA a 99_EVOLUCAO)
- **40 capítulos** completos distribuídos em 7 blocos temáticos
- **23+ motores especializados** com especificações detalhadas
- **6 bibliotecas de conhecimento** (Jurídica, Briefings, Templates, Checklists, Indicadores, Estratégias)
- **12 kernels** (1 Principal + 11 Especializados)

#### Bloco I — Fundamentos (Capítulos 1–6)
- Governança Jurídica e Filosofia do Framework
- Diretiva Mestra Jurídica
- Kernel Jurídico
- Método Científico Aplicado ao Direito
- Lógica Jurídica e Engenharia Argumentativa
- Hermenêutica Jurídica Avançada

#### Bloco II — Engenharia Jurídica (Capítulos 7–13)
- Engenharia Processual, da Prova, da Fundamentação, dos Pedidos
- Engenharia Reversa das Decisões Judiciais
- Engenharia Recursal e da Execução

#### Bloco III — Pesquisa Jurídica (Capítulos 14–18)
- Pesquisa Legislativa, Jurisprudencial e Doutrinária
- Benchmark Jurídico
- Inteligência Jurídica Comparada

#### Bloco IV — Análise Estratégica (Capítulos 19–24)
- Gestão Estratégica Jurídica e de Riscos
- Compliance e Governança
- Auditoria Jurídica
- Motor de Coerência Jurídica (MCJ)
- Motor Decisório Jurídico (MDJ)

#### Bloco V — Módulos e Motores Especializados (Capítulos 25–30)
- Módulo Jurídico Forense (MJF)
- 23+ Motores Especializados
- Ontologia Jurídica e Grafo de Conhecimento
- Modelos Matemáticos Aplicados ao Direito
- Inteligência Artificial Aplicada ao Direito

#### Bloco VI — Bibliotecas e Ferramentas (Capítulos 31–36)
- 6 Bibliotecas de Conhecimento completas
- KPIs e KRIs jurídicos
- Estratégias matemáticas e processuais

#### Bloco VII — Documentação e Evolução (Capítulos 37–40)
- Manual Técnico de Implementação (Cap. 37)
- Manual Operacional do Usuário (Cap. 38)
- Casos de Uso e Aplicações Práticas — 5 casos detalhados (Cap. 39)
- Kernel Mestre Jurídico (Cap. 40)

#### Documentação
- Guia Rápido em 10 passos
- FAQ com 20 perguntas e respostas
- Guia de Contribuição (CONTRIBUTING.md)
- Licença proprietária (LICENSE.md)
- Roadmap de evolução (ROADMAP.md)

#### Casos de Uso
- Caso 1: Gestão de Litígios em Massa
- Caso 2: Due Diligence Legal em M&A
- Caso 3: Compliance Preventivo LGPD
- Caso 4: Estratégia Recursal
- Caso 5: Análise de Contratos e Negociação

---

## Histórico de Versões

| Versão | Data | Tipo | Descrição |
|--------|------|------|-----------|
| **3.0.0** | 2026-06-28 | Major | Backend API (FastAPI) + MIJ Engine + JWT Auth + Seed Data |
| **2.0.0** | 2026-06-27 | Major | Frontend SPA + Dashboard + Classificador + MIJ Pages |
| **1.0.0** | 2026-06-27 | Major | Lançamento inaugural — Arquitetura mestra completa |

---
> Sigma—Juris Intelligence Framework (SJIF) v3.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
