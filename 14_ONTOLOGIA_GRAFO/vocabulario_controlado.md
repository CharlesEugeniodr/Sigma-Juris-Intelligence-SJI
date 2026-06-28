# Vocabulário Controlado de Termos Jurídicos do SJIF

## Visão Geral

O **Vocabulário Controlado** do SJIF é um conjunto padronizado e curado de termos jurídicos que garante consistência terminológica em todo o framework. Ele funciona como uma camada de normalização linguística entre os textos jurídicos de entrada e a [Ontologia Jurídica](cap27_ontologia_juridica.md), resolvendo ambiguidades, sinonímias e variações regionais na linguagem do Direito brasileiro.

> [!NOTE]
> O vocabulário controlado é a ponte entre a linguagem natural dos textos jurídicos e a representação formal da ontologia. Ele garante que o mesmo conceito seja sempre identificado da mesma forma, independentemente da variação linguística utilizada.

---

## Estrutura do Vocabulário

### Formato de Cada Entrada

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| **Termo Preferido** | Forma padronizada adotada pelo SJIF | `Sentença` |
| **Sinônimos** | Variações aceitas | decisão de primeiro grau, decisão monocrática de mérito |
| **Definição** | Significado preciso no contexto | Decisão judicial que resolve o mérito em primeira instância |
| **Categoria** | Classificação ontológica | Decisão Judicial |
| **Domínio** | Ramo do Direito | Processual Civil |
| **Relações** | Conexões com outros termos | *é-tipo-de* Decisão Judicial; *produzida-por* Juiz |

---

## Categorias do Vocabulário

### 1. Entidades Processuais

| Termo Preferido | Sinônimos | Definição |
|----------------|-----------|-----------|
| `Autor` | Requerente, Demandante, Suplicante | Parte que propõe a ação |
| `Réu` | Requerido, Demandado, Suplicado | Parte contra quem se propõe a ação |
| `Litisconsorte` | Colitigante | Parte que litiga ao lado de outra |
| `Terceiro Interessado` | Interveniente, Assistente | Pessoa que intervém no processo |
| `Juiz` | Magistrado, Julgador | Autoridade judicial competente |
| `Tribunal` | Corte, Órgão Colegiado | Instância judicial superior |
| `Promotor` | Membro do MP, Parquet | Representante do Ministério Público |

### 2. Atos Processuais

| Termo Preferido | Sinônimos | Definição |
|----------------|-----------|-----------|
| `Petição Inicial` | Exordial, Inaugural, Vestibular | Peça que inicia o processo |
| `Contestação` | Resposta, Defesa | Peça de defesa do réu |
| `Sentença` | Decisão de mérito | Decisão que resolve o mérito em 1ª instância |
| `Acórdão` | Decisão colegiada | Decisão proferida por órgão colegiado |
| `Despacho` | Despacho ordinatório | Ato judicial sem conteúdo decisório |
| `Decisão Interlocutória` | Decisão incidental | Decisão sobre questão incidente |

### 3. Recursos

| Termo Preferido | Sinônimos | Definição |
|----------------|-----------|-----------|
| `Apelação` | — | Recurso contra sentença |
| `Agravo de Instrumento` | AI | Recurso contra decisão interlocutória |
| `Embargos de Declaração` | ED, Embargos Declaratórios | Recurso para esclarecer obscuridade, contradição ou omissão |
| `Recurso Especial` | REsp | Recurso ao STJ por violação de lei federal |
| `Recurso Extraordinário` | RE | Recurso ao STF por violação constitucional |

### 4. Provas

| Termo Preferido | Sinônimos | Definição |
|----------------|-----------|-----------|
| `Prova Documental` | Documento, Prova escrita | Evidência materializada em documento |
| `Prova Testemunhal` | Testemunho, Depoimento de testemunha | Declaração de terceiro sobre fatos |
| `Prova Pericial` | Perícia, Laudo pericial | Exame técnico-científico |
| `Prova Oral` | Depoimento pessoal | Declaração da própria parte |
| `Prova Emprestada` | — | Prova produzida em outro processo |

### 5. Normas Jurídicas

| Termo Preferido | Sinônimos | Definição |
|----------------|-----------|-----------|
| `Lei Ordinária` | Lei | Norma aprovada por maioria simples |
| `Lei Complementar` | LC | Norma aprovada por maioria absoluta |
| `Decreto` | Decreto regulamentar | Ato do Poder Executivo |
| `Resolução` | — | Ato normativo de órgão colegiado |
| `Portaria` | — | Ato administrativo de autoridade |
| `Súmula` | Enunciado | Síntese de jurisprudência dominante |
| `Súmula Vinculante` | SV | Súmula com efeito vinculante (STF) |

### 6. Conceitos Fundamentais

| Termo Preferido | Sinônimos | Definição |
|----------------|-----------|-----------|
| `Competência` | Jurisdição competente | Atribuição de poder para julgar |
| `Prescrição` | — | Perda da pretensão pelo decurso do prazo |
| `Decadência` | Caducidade | Perda do direito pelo decurso do prazo |
| `Litispendência` | — | Existência de ação idêntica em curso |
| `Coisa Julgada` | Res judicata | Decisão transitada em julgado |
| `Causa de Pedir` | Fundamento de fato e de direito | Base fática e jurídica do pedido |

---

## Regras de Uso

> [!IMPORTANT]
> Todo módulo do SJIF deve utilizar os termos preferidos ao armazenar e processar dados.

1. **Normalização na Entrada**: Termos sinônimos devem ser convertidos ao termo preferido na fase de processamento
2. **Preservação do Original**: O texto original deve ser mantido, com o termo normalizado como metadado
3. **Resolução de Ambiguidade**: Quando um termo é ambíguo, o contexto deve ser utilizado para determinar o significado
4. **Atualização Periódica**: O vocabulário deve ser revisado periodicamente para incorporar novos termos e alterações legislativas
5. **Hierarquia**: Termos devem respeitar a hierarquia definida na ontologia

---

## Integração com o SJIF

| Componente | Uso do Vocabulário |
|-----------|-------------------|
| **Ontologia Jurídica** (Cap. 27) | Base terminológica da ontologia |
| **Grafo de Conhecimento** (Cap. 28) | Normalização de entidades no grafo |
| **Motor Normativo** (Cap. 26) | Padronização de referências legislativas |
| **Motor Jurisprudencial** (Cap. 26) | Normalização de termos em decisões |
| **PLN** (Cap. 30) | Dicionário para NER e classificação |
| **Schemas** | Base para definição de [Entidades](schemas/entidades.md), [Relações](schemas/relacoes.md) e [Propriedades](schemas/propriedades.md) |

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
