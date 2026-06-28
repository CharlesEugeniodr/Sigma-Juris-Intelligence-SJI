# 📑 Memoriais

> **Diretório**: `07_TEMPLATES/memoriais/`
> **Categoria**: Templates de Memoriais

## Propósito

Fornecer modelos padronizados para a elaboração de memoriais de sustentação oral e memoriais descritivos, documentos essenciais para sintetizar argumentos de forma persuasiva perante tribunais e órgãos julgadores. Os templates garantem organização lógica, concisão e impacto argumentativo.

## Tipos de Documento

| Tipo | Descrição |
|---|---|
| **Memorial de Sustentação Oral** | Síntese argumentativa para sustentação em plenário |
| **Memorial Descritivo** | Descrição detalhada de fatos e argumentos do caso |
| **Memorial de Julgamento** | Documento entregue ao julgador antes da sessão |
| **Memorial de Razões Finais** | Síntese final após instrução processual |
| **Memorial em Tribunal Superior** | Adaptado para STJ, STF e Tribunais Superiores |

## Estrutura Padrão

```
1. Cabeçalho e Identificação do Processo
2. Síntese dos Fatos
3. Questões Centrais em Debate
4. Argumentos Principais (hierarquizados)
   4.1. Tese principal
   4.2. Teses subsidiárias
5. Jurisprudência de Suporte
6. Pedido Final
7. Conclusão Impactante
```

## Campos Dinâmicos

```
{{tribunal_julgador}}      → Tribunal onde será sustentado
{{sessao_julgamento}}      → Data/horário da sessão
{{relator_nome}}           → Nome do relator
{{turma_camara}}           → Turma/Câmara julgadora
{{tempo_sustentacao}}      → Tempo disponível para sustentação
{{pontos_chave}}           → Pontos-chave da argumentação
{{precedentes_favoraveis}} → Precedentes favoráveis selecionados
```

## Integração com Motores

- **Motor Decisório (Cap. 24)** — Analisa padrões do julgador/turma para adaptação
- **Motor Jurisprudencial** — Identifica precedentes mais impactantes
- **Motor Estratégico** — Auxilia na hierarquização dos argumentos
- **MCJ (Cap. 23)** — Verifica coerência e completude do memorial
- **Motor de Simulação** — Simula reação da parte contrária

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
