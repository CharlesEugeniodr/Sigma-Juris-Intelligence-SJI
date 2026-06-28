# 🚨 KRI Reputacional

> **Diretório**: `09_INDICADORES/kris/`
> **Tipo**: Indicador de Risco Reputacional
> **Referência**: [Capítulo 35 — Biblioteca de Indicadores](../cap35_kpis_kris.md)

## Definição

O KRI Reputacional monitora a **exposição da organização a riscos que podem afetar sua imagem, marca e reputação** perante clientes, mercado, reguladores e opinião pública. Rastreia menções negativas na mídia, reclamações, sanções públicas, processos de alto perfil e crises de imagem relacionadas a questões jurídicas.

## Sinais de Alerta

### Sinais de Alerta Precoce
- 📰 Aumento de menções negativas na mídia relacionadas a questões jurídicas
- 📰 Crescimento de reclamações em plataformas públicas (Reclame Aqui, PROCON)
- ⚠️ Processos judiciais de alto perfil midiático
- ⚠️ Investigações ou inquéritos divulgados publicamente
- ⚠️ Denúncias em canais externos (MP, imprensa)

### Sinais de Alerta Crítico
- 🔴 Condenação em caso de grande repercussão
- 🔴 Sanção regulatória tornada pública
- 🔴 Operação policial envolvendo a organização ou dirigentes
- 🔴 Crise viral em redes sociais com impacto na marca
- 🔴 Escândalo envolvendo práticas de compliance (corrupção, fraude)

## Níveis de Risco

### 🟢 Baixo (Score 0-25)
- **Indicadores**: Menções negativas isoladas e pontuais; score positivo em plataformas de reputação; nenhuma sanção pública
- **Ações**: Monitoramento de mídia e redes sociais; gestão preventiva de imagem; comunicação institucional proativa
- **Frequência de Revisão**: Trimestral

### 🟡 Médio (Score 26-50)
- **Indicadores**: Aumento moderado de menções negativas; reclamações crescentes em plataformas públicas; processos de médio perfil
- **Ações**: Reforço da comunicação institucional; resposta ativa a reclamações; plano de comunicação de crise preparado
- **Frequência de Revisão**: Mensal

### 🟠 Alto (Score 51-75)
- **Indicadores**: Cobertura midiática negativa relevante; investigação divulgada publicamente; sanção regulatória publicada; queda na reputação em rankings
- **Ações**: Ativação do comitê de crise; assessoria de imprensa especializada; comunicação com stakeholders; estratégia de contenção de danos
- **Frequência de Revisão**: Semanal

### 🔴 Crítico (Score 76-100)
- **Indicadores**: Crise reputacional ampla; escândalo público; operação policial divulgada; impacto no valor de mercado; perda de clientes/parceiros
- **Ações**: Gestão de crise total; posicionamento público imediato; contratação de assessoria de crise; diálogo com reguladores; comunicação com investidores/mercado
- **Frequência de Revisão**: Contínua (tempo real)

## Ações de Mitigação

| Nível | Ação de Mitigação |
|---|---|
| **Preventiva** | Monitoramento de mídia/redes sociais; programa de compliance robusto; comunicação institucional proativa; gestão de stakeholders |
| **Corretiva** | Resposta rápida e transparente; correção de condutas; pedido público de desculpas (quando aplicável); reforço de compliance |
| **Contingencial** | Comitê de crise; assessoria de comunicação; posicionamento público; diálogo com reguladores; ações legais contra desinformação |
| **Estrutural** | Programa de responsabilidade social; governança transparente; cultura de integridade; revisão de práticas comerciais |

### Fórmulas de Cálculo

```
Score de Risco = (Mídia × Peso_M) + (Reclamações × Peso_R) + (Sanções × Peso_S) + (Social × Peso_So)

Onde:
- Mídia       = Volume de menções negativas / Total de menções × 100 (normalizado 0-100)
- Reclamações = Nº reclamações não resolvidas / Total de reclamações × 100
- Sanções     = Nº de sanções públicas no período (ponderado por gravidade)
- Social      = Sentimento negativo em redes sociais (análise de sentimento 0-100)
- Pesos sugeridos: Peso_M=0.30, Peso_R=0.20, Peso_S=0.30, Peso_So=0.20
```

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
