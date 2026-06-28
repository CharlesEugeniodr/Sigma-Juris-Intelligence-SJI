# 🤝 Guia de Contribuição — SJIF

## Como Contribuir para o Sigma—Juris Intelligence Framework

Obrigado pelo interesse em contribuir para o **Sigma—Juris Intelligence Framework (SJIF)**! Este documento estabelece as diretrizes para contribuições, garantindo a qualidade, a consistência e a integridade do framework.

> [!IMPORTANT]
> O SJIF é propriedade intelectual de **Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda**. Todas as contribuições devem estar em conformidade com a [licença do projeto](../../LICENSE.md).

---

## 📋 Código de Conduta

Ao contribuir para o SJIF, você concorda em:

1. **Respeitar** todos os participantes, independentemente de experiência, gênero, identidade, orientação, deficiência, etnia, idade, religião ou nacionalidade
2. **Manter** um ambiente colaborativo, construtivo e profissional
3. **Aceitar** críticas construtivas com maturidade e abertura
4. **Priorizar** o interesse do projeto acima de preferências individuais
5. **Não publicar** informações confidenciais ou proprietárias sem autorização
6. **Respeitar** a propriedade intelectual e os direitos autorais do titular

### Comportamentos Inaceitáveis
- Assédio, intimidação ou discriminação de qualquer natureza
- Linguagem ofensiva, insultuosa ou depreciativa
- Publicação de informações privadas sem consentimento
- Apropriação indevida de propriedade intelectual
- Qualquer comportamento que comprometa a integridade do projeto

---

## 🔄 Processo de Contribuição (Pull Requests)

### Passo 1: Identifique a Contribuição

Antes de iniciar, verifique se sua contribuição se enquadra em uma das categorias:

| Tipo | Descrição | Branch |
|------|-----------|--------|
| **Correção** | Correção de erros, typos ou inconsistências | `fix/descricao-curta` |
| **Conteúdo** | Adição ou atualização de conteúdo existente | `content/descricao-curta` |
| **Novo Capítulo** | Proposta de novo capítulo ou seção | `feature/cap-XX-nome` |
| **Documentação** | Melhoria na documentação, guias ou FAQ | `docs/descricao-curta` |
| **Motor/Módulo** | Implementação de novo motor ou módulo | `feature/motor-nome` |
| **Template** | Novo template, checklist ou briefing | `feature/template-nome` |

### Passo 2: Fork e Branch

```bash
# 1. Faça fork do repositório
# 2. Clone seu fork
git clone https://github.com/seu-usuario/Sigma-Juris-Intelligence-SJI.git

# 3. Crie uma branch para sua contribuição
git checkout -b feature/descricao-da-contribuicao

# 4. Faça suas alterações seguindo os padrões
```

### Passo 3: Desenvolva a Contribuição

Siga rigorosamente os **Padrões de Documentação** descritos abaixo.

### Passo 4: Commit e Push

```bash
# Use mensagens de commit claras e descritivas
git add .
git commit -m "feat(cap-XX): Adiciona seção sobre [tema]

- Detalha a metodologia de [aspecto]
- Inclui exemplos práticos de [aplicação]
- Adiciona referências cruzadas com Cap. YY e Cap. ZZ"

# Push para seu fork
git push origin feature/descricao-da-contribuicao
```

### Passo 5: Abra um Pull Request

1. Acesse o repositório original no GitHub
2. Clique em **"New Pull Request"**
3. Selecione sua branch
4. Preencha o template de PR com:
   - **Descrição** detalhada da contribuição
   - **Motivação** e contexto
   - **Capítulos/arquivos** afetados
   - **Checklist** de verificação (veja abaixo)

### Passo 6: Revisão

- Um mantenedor revisará sua contribuição
- Poderão ser solicitadas alterações ou esclarecimentos
- Após aprovação, a contribuição será incorporada (merged)

---

## 📝 Padrões de Documentação

### Idioma
- Todo conteúdo **deve estar em Português Brasileiro (pt-BR)**
- Termos técnicos em inglês são aceitos quando não há tradução consagrada (ex: framework, compliance, machine learning)

### Formatação Markdown

#### Cabeçalhos
```markdown
# Capítulo XX: Título do Capítulo

## XX.1 Seção Principal

### XX.1.1 Subseção

#### Detalhamento
```

#### Estrutura de Arquivos
Cada arquivo de capítulo deve conter:

1. **Título** — `# Capítulo XX: Nome`
2. **Introdução** — Contextualização e objetivos do capítulo
3. **Seções** — Conteúdo organizado em seções numeradas
4. **Referências Cruzadas** — Links para capítulos relacionados
5. **Rodapé padrão**:
```markdown
---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
```

#### Elementos de Formatação
- Use **negrito** para termos importantes
- Use *itálico* para ênfase
- Use `código` para termos técnicos
- Use tabelas para dados estruturados
- Use listas para enumerações
- Use diagramas Mermaid para fluxos e arquiteturas
- Use blocos de citação para notas e alertas

### Referências Cruzadas

Sempre que mencionar outro capítulo ou módulo, inclua um link relativo:

```markdown
- Consulte o [Capítulo 25: Módulo Jurídico Forense](../04_MOTORES/cap25_mjf.md)
- Veja também a [Biblioteca de Templates](../07_TEMPLATES/)
```

### Propriedade Intelectual

Toda contribuição deve incluir a atribuição de propriedade intelectual no rodapé:

```
Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
```

---

## ✅ Checklist de Verificação

Antes de submeter um PR, verifique:

- [ ] O conteúdo está em **Português Brasileiro (pt-BR)**
- [ ] A formatação segue os **padrões Markdown** descritos acima
- [ ] O arquivo possui o **rodapé padrão** com atribuição de propriedade
- [ ] As **referências cruzadas** para outros capítulos estão corretas
- [ ] O conteúdo é **original** e não viola direitos de terceiros
- [ ] Não há **erros ortográficos ou gramaticais** significativos
- [ ] O conteúdo é **consistente** com a Diretiva Mestra (Cap. 2)
- [ ] Diagramas e tabelas estão **renderizando corretamente**
- [ ] O **CHANGELOG.md** foi atualizado com as mudanças
- [ ] Os arquivos estão no **diretório correto** da estrutura do SJIF

---

## 🏷️ Convenção de Commits

Utilize a convenção [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(escopo): descrição curta

Corpo detalhado opcional

Rodapé opcional (referências, breaking changes)
```

### Tipos
| Tipo | Descrição |
|------|-----------|
| `feat` | Nova funcionalidade ou conteúdo |
| `fix` | Correção de erro ou inconsistência |
| `docs` | Alteração em documentação |
| `style` | Formatação (sem alteração de conteúdo) |
| `refactor` | Reorganização de conteúdo existente |
| `chore` | Tarefas de manutenção |

### Exemplos
```
feat(cap-25): Adiciona seção sobre simulação do julgador
fix(cap-37): Corrige diagrama de arquitetura em 5 camadas
docs(faq): Adiciona pergunta sobre integração com LDAP
refactor(cap-26): Reorganiza motores por categoria
```

---

## 📞 Contato

Para dúvidas sobre contribuições, entre em contato:

- **Mantenedor Principal**: Charles de Paula Eugênio
- **Organização**: Sigma Sihf Soluções Analíticas Ltda
- **CNPJ**: 01.851.824/0001-38

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
