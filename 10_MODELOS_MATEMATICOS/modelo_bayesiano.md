# Modelo Bayesiano (Bayesian Model)

## Definição

O **Modelo Bayesiano** é um método de inferência probabilística que permite atualizar crenças e probabilidades à medida que novas evidências são obtidas. Fundamentado no Teorema de Bayes, este modelo é particularmente poderoso no contexto jurídico, onde novas provas, decisões ou fatos emergem continuamente ao longo de um processo, exigindo a revisão das estimativas iniciais.

No SJIF, o modelo bayesiano é usado para atualizar dinamicamente a probabilidade de sucesso de uma tese, a classificação de risco de um processo ou a força de um argumento à medida que o cenário evolui.

---

## Fórmula / Método

### Teorema de Bayes

$$
P(H|E) = \frac{P(E|H) \cdot P(H)}{P(E)}
$$

Onde:
- $P(H|E)$ = **Probabilidade posterior** — probabilidade da hipótese $H$ ser verdadeira dado que a evidência $E$ foi observada
- $P(E|H)$ = **Verossimilhança** — probabilidade de observar a evidência $E$ se $H$ for verdadeira
- $P(H)$ = **Probabilidade a priori** — probabilidade inicial de $H$ antes da evidência
- $P(E)$ = **Probabilidade marginal da evidência** — probabilidade total de $E$ ocorrer

### Atualização Sequencial

O modelo bayesiano permite **atualização iterativa**: a probabilidade posterior de uma etapa se torna a probabilidade a priori da próxima etapa, quando uma nova evidência surge.

$$
P(H|E_1, E_2) = \frac{P(E_2|H, E_1) \cdot P(H|E_1)}{P(E_2|E_1)}
$$

---

## Aplicação Jurídica

- **Atualização de Probabilidade de Sucesso**: Revisar a probabilidade de vitória à medida que novas provas são juntadas ao processo
- **Avaliação Dinâmica de Risco**: Atualizar classificação de contingências quando novos fatos surgem
- **Análise de Precedentes**: Ajustar a estimativa de tendência jurisprudencial quando novos acórdãos são publicados
- **Investigação e Compliance**: Atualizar a probabilidade de fraude ou não conformidade à medida que auditorias avançam
- **Valoração de Provas**: Calcular o impacto de cada nova prova na hipótese jurídica

---

## Exemplo Prático

**Cenário**: Avaliação da probabilidade de reconhecimento de vínculo empregatício em ação trabalhista.

**Dados iniciais (a priori)**:
- $P(H)$ = Probabilidade de reconhecimento de vínculo = 0.50 (50%)
- $P(\neg H)$ = 0.50

**Nova Evidência**: Testemunha confirma subordinação e controle de horário.
- $P(E|H)$ = Probabilidade da testemunha confirmar subordinação se houver vínculo = 0.90
- $P(E|\neg H)$ = Probabilidade da testemunha confirmar subordinação se NÃO houver vínculo = 0.15

**Cálculo**:

$$
P(E) = P(E|H) \cdot P(H) + P(E|\neg H) \cdot P(\neg H) = 0.90 \times 0.50 + 0.15 \times 0.50 = 0.525
$$

$$
P(H|E) = \frac{0.90 \times 0.50}{0.525} = \frac{0.45}{0.525} = 0.857
$$

**Interpretação**: Após a prova testemunhal, a probabilidade de reconhecimento de vínculo sobe de **50% para 85.7%**, passando de "possível" para "provável".

---

## Limitações

- A definição das probabilidades a priori e de verossimilhança requer julgamento especializado
- Pode ser sensível a probabilidades a priori mal calibradas
- Em casos com muitas evidências interdependentes, o cálculo pode se tornar computacionalmente complexo
- A independência entre evidências (premissa simplificadora) nem sempre é verdadeira no Direito
- Resultados podem ser contra-intuitivos quando as probabilidades base são muito pequenas ou muito grandes

---

## Integração com Motores

| Motor | Integração |
|-------|-----------|
| **Motor de Gestão de Riscos** (Cap. 26) | Atualiza classificação de contingências dinamicamente |
| **Motor Jurisprudencial** (Cap. 26) | Revisa tendências com base em novas decisões |
| **Motor Decisório Jurídico** (Cap. 24) | Atualiza previsões de comportamento do julgador |
| **Motor Probatório** (Cap. 26) | Calcula impacto de cada nova prova na tese |
| **Motor de Compliance** (Cap. 26) | Atualiza avaliações de risco de não conformidade |

### Referências Cruzadas

- [Capítulo 29: Modelos Matemáticos](cap29_modelos_matematicos.md)
- [Modelo Probabilístico](modelo_probabilistico.md)
- [Modelo de Peso das Provas](modelo_peso_provas.md)
- [Modelo de Risco Jurídico](modelo_risco_juridico.md)

---
> Sigma—Juris Intelligence Framework (SJIF) v1.0 | Propriedade de Charles de Paula Eugênio — Sigma Sihf Soluções Analíticas Ltda
