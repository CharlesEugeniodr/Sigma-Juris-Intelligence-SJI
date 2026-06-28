# 🛡️ Compliance

> **Diretório**: `07_TEMPLATES/compliance/`
> **Categoria**: Templates de Compliance

## Propósito

Fornecer modelos padronizados para a estruturação e documentação de programas de compliance, incluindo códigos de conduta, políticas internas, termos de consentimento e relatórios de conformidade. Os templates asseguram a conformidade com a legislação aplicável (Lei Anticorrupção, LGPD, entre outras), a padronização de políticas internas e a documentação de controles e treinamentos.

## Tipos de Documento

| Tipo | Descrição |
|---|---|
| **Código de Conduta** | Diretrizes éticas e comportamentais da organização |
| **Política Anticorrupção** | Prevenção e combate à corrupção (Lei nº 12.846/2013) |
| **Política de Proteção de Dados (LGPD)** | Conformidade com a Lei Geral de Proteção de Dados |
| **Política de Prevenção à Lavagem de Dinheiro** | Conformidade com normas de PLD/FT |
| **Canal de Denúncias** | Estrutura e procedimentos do canal |
| **Termo de Consentimento** | Consentimento para tratamento de dados pessoais |
| **Relatório de Compliance** | Relatório periódico de conformidade |
| **Plano de Integridade** | Programa de integridade estruturado |
| **Matriz de Riscos de Compliance** | Mapeamento de riscos de não conformidade |
| **Registro de Treinamentos** | Documentação de treinamentos realizados |

## Estrutura Padrão

```
1. Objetivo e Escopo
2. Definições
3. Princípios e Valores
4. Diretrizes e Regras
   4.1. Condutas esperadas
   4.2. Condutas proibidas
   4.3. Exceções e salvaguardas
5. Responsabilidades
6. Canais de Comunicação e Denúncia
7. Consequências do Descumprimento
8. Vigência e Revisão
9. Termo de Adesão/Ciência
```

## Campos Dinâmicos

```
{{empresa_nome}}           → Nome da empresa/organização
{{cnpj_empresa}}           → CNPJ da organização
{{comite_compliance}}      → Composição do comitê de compliance
{{encarregado_dados}}      → Nome do DPO/Encarregado de dados
{{canal_denuncia}}         → Canais disponíveis para denúncia
{{data_vigencia}}          → Data de início de vigência
{{versao_politica}}        → Versão do documento
{{legislacao_aplicavel}}   → Legislação aplicável listada
{{periodicidade_revisao}}  → Periodicidade de revisão da política
```

## Integração com Motores

- **Motor de Compliance (Cap. 21/26)** — Direcionamento normativo e monitoramento
- **Motor Normativo** — Atualização conforme mudanças legislativas
- **Motor de Riscos** — Mapeamento de riscos de não conformidade
- **Biblioteca de Checklists (Cap. 34)** — Checklists de verificação de compliance
- **Biblioteca de Indicadores (Cap. 35)** — KPIs e KRIs de compliance

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
