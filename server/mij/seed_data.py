"""
MIJ Seed Data - Dados demonstrativos para o Motor de Inteligência Judicial

Gera dados realistas de magistrados e decisões judiciais para demonstração
e testes do sistema MIJ.

Inclui:
  - 50+ magistrados distribuídos entre TJMG, STJ, TJPA e TJMA
  - 500+ decisões com ementas em português, matérias variadas e
    distribuição estatística realista
"""

import logging
import random
from datetime import datetime, timedelta, timezone
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from server.models.decisao import Decisao
from server.models.magistrado import Magistrado

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Dados de referência para geração
# ---------------------------------------------------------------------------

# Nomes próprios brasileiros (variados, não apenas 'Silva')
PRIMEIROS_NOMES_MASC = [
    "Antônio", "Carlos", "Eduardo", "Fernando", "Gustavo", "Henrique",
    "João", "Lucas", "Marcos", "Paulo", "Rafael", "Ricardo", "Sérgio",
    "Thiago", "Vinícius", "Wagner", "Alexandre", "Bruno", "Cláudio",
    "Daniel", "Felipe", "Gabriel", "Igor", "José", "Leonardo", "Marcelo",
    "Nelson", "Otávio", "Pedro", "Roberto",
]

PRIMEIROS_NOMES_FEM = [
    "Ana", "Beatriz", "Camila", "Diana", "Elaine", "Fernanda",
    "Gabriela", "Helena", "Isabela", "Juliana", "Karla", "Luciana",
    "Mariana", "Natália", "Patrícia", "Renata", "Sandra", "Tatiana",
    "Valéria", "Adriana", "Bianca", "Cristina", "Daniela", "Eduarda",
    "Flávia", "Giovana", "Heloísa", "Íris", "Jéssica", "Larissa",
]

SOBRENOMES = [
    "Oliveira", "Santos", "Pereira", "Costa", "Rodrigues", "Almeida",
    "Nascimento", "Lima", "Araújo", "Fernandes", "Carvalho", "Gomes",
    "Martins", "Rocha", "Ribeiro", "Souza", "Monteiro", "Mendes",
    "Barros", "Freitas", "Barbosa", "Pinto", "Moura", "Cavalcanti",
    "Dias", "Campos", "Cardoso", "Correia", "Cunha", "Vieira",
    "Lopes", "Machado", "Medeiros", "Nunes", "Reis", "Teixeira",
    "Figueiredo", "Aguiar", "Prado", "Moreira", "Azevedo", "Braga",
    "Coelho", "Duarte", "Fonseca", "Guimarães", "Lacerda", "Melo",
    "Nogueira", "Pacheco", "Queiroz", "Ramos",
]

# Matérias jurídicas
MATERIAS = [
    "Consumidor", "Contratos", "Responsabilidade Civil", "Família",
    "Tributário", "Trabalhista", "Criminal", "Ambiental",
    "Administrativo", "Execução Fiscal",
]

# Tipos de decisão
TIPOS_DECISAO = ["Sentença", "Acórdão", "Decisão Interlocutória", "Despacho"]

# Resultados possíveis
RESULTADOS_1A_INSTANCIA = [
    "procedente", "improcedente", "parcialmente_procedente",
]

RESULTADOS_2A_INSTANCIA = [
    "provido", "desprovido", "parcial_provimento", "não_conhecido",
]

# Varas do TJMG
VARAS_TJMG = [
    "1ª Vara Cível de Belo Horizonte",
    "2ª Vara Cível de Belo Horizonte",
    "3ª Vara Cível de Belo Horizonte",
    "1ª Vara de Família de Belo Horizonte",
    "2ª Vara de Família de Belo Horizonte",
    "Vara de Fazenda Pública de Belo Horizonte",
    "1ª Vara Criminal de Belo Horizonte",
    "Vara de Execuções Fiscais de Belo Horizonte",
    "1ª Vara Cível de Uberlândia",
    "1ª Vara Cível de Juiz de Fora",
    "1ª Câmara Cível",
    "2ª Câmara Cível",
    "3ª Câmara Cível",
    "4ª Câmara Cível",
    "5ª Câmara Cível",
    "1ª Câmara Criminal",
    "2ª Câmara Criminal",
    "1ª Câmara de Direito Público",
    "2ª Câmara de Direito Público",
    "Câmara de Uniformização de Jurisprudência",
]

# Turmas do STJ
TURMAS_STJ = [
    "1ª Turma", "2ª Turma", "3ª Turma",
    "4ª Turma", "5ª Turma", "6ª Turma",
]

# Varas do TJPA
VARAS_TJPA = [
    "1ª Vara Cível de Belém",
    "2ª Vara Cível de Belém",
    "1ª Vara de Família de Belém",
    "Vara de Fazenda Pública de Belém",
    "1ª Câmara Cível Isolada",
    "2ª Câmara Cível Isolada",
    "3ª Câmara Cível Isolada",
    "1ª Turma de Direito Público",
    "1ª Turma de Direito Privado",
    "Vara de Execuções Fiscais de Belém",
]

# Varas do TJMA
VARAS_TJMA = [
    "1ª Vara Cível de São Luís",
    "2ª Vara Cível de São Luís",
    "1ª Vara de Família de São Luís",
    "Vara de Fazenda Pública de São Luís",
    "1ª Câmara Cível",
    "2ª Câmara Cível",
    "3ª Câmara Cível",
    "Câmara Criminal",
    "Vara de Execuções Fiscais de São Luís",
    "1ª Vara Cível de Imperatriz",
]

# ---------------------------------------------------------------------------
# Templates de ementas por matéria
# ---------------------------------------------------------------------------

EMENTAS_TEMPLATES = {
    "Consumidor": [
        "APELAÇÃO CÍVEL. DIREITO DO CONSUMIDOR. RESPONSABILIDADE OBJETIVA DO "
        "FORNECEDOR. Falha na prestação de serviço devidamente comprovada nos autos. "
        "Dano moral configurado ante a situação vexatória imposta ao consumidor. "
        "Quantum indenizatório fixado em consonância com os princípios da "
        "razoabilidade e proporcionalidade. {resultado_texto}.",

        "AÇÃO INDENIZATÓRIA. RELAÇÃO DE CONSUMO. PRODUTO COM VÍCIO. "
        "Comprovação do defeito do produto por laudo pericial. Responsabilidade "
        "solidária do fabricante e do comerciante. Danos materiais e morais "
        "demonstrados. Juros de mora a partir da citação. {resultado_texto}.",

        "RECURSO INOMINADO. JUIZADO ESPECIAL. CONSUMIDOR. COBRANÇA INDEVIDA. "
        "Inscrição irregular em cadastro de inadimplentes. Dever de indenizar "
        "reconhecido. Aplicação do art. 42, parágrafo único, do CDC. "
        "Repetição do indébito em dobro. {resultado_texto}.",

        "APELAÇÃO CÍVEL. AÇÃO DE OBRIGAÇÃO DE FAZER C/C INDENIZATÓRIA. "
        "PLANO DE SAÚDE. Negativa de cobertura abusiva. Procedimento prescrito "
        "pelo médico assistente. Súmula 608 do STJ. Dano moral in re ipsa "
        "configurado. {resultado_texto}.",
    ],
    "Contratos": [
        "APELAÇÃO CÍVEL. AÇÃO DE RESOLUÇÃO CONTRATUAL. INADIMPLEMENTO. "
        "Comprovação do descumprimento das obrigações contratuais pela parte ré. "
        "Cláusula resolutória expressa. Restituição dos valores pagos devida, "
        "com retenção percentual a título de cláusula penal. {resultado_texto}.",

        "AÇÃO REVISIONAL DE CONTRATO. EMPRÉSTIMO CONSIGNADO. "
        "Juros remuneratórios acima da taxa média de mercado. Abusividade "
        "reconhecida. Limitação dos juros à taxa média do BACEN para a "
        "modalidade contratada. {resultado_texto}.",

        "APELAÇÃO. CONTRATO DE COMPRA E VENDA DE IMÓVEL. ATRASO NA ENTREGA. "
        "Cláusula de tolerância de 180 dias válida. Ultrapassado o prazo de "
        "tolerância, devida indenização por lucros cessantes, equivalente ao "
        "valor locatício do imóvel. {resultado_texto}.",
    ],
    "Responsabilidade Civil": [
        "APELAÇÃO CÍVEL. AÇÃO DE INDENIZAÇÃO. RESPONSABILIDADE CIVIL. "
        "ACIDENTE DE TRÂNSITO. Culpa do réu comprovada pela dinâmica dos fatos "
        "e testemunhos. Danos materiais demonstrados por orçamentos e notas fiscais. "
        "Dano moral fixado em valor adequado. {resultado_texto}.",

        "AÇÃO INDENIZATÓRIA. ERRO MÉDICO. Responsabilidade subjetiva do "
        "profissional liberal. Prova pericial conclusiva quanto à conduta "
        "negligente. Nexo causal demonstrado. Danos morais e estéticos "
        "configurados. {resultado_texto}.",

        "RESPONSABILIDADE CIVIL. DANO MORAL. PUBLICAÇÃO OFENSIVA EM REDE SOCIAL. "
        "Direito à honra e à imagem. Excesso no exercício da liberdade de expressão. "
        "Indenização arbitrada com observância da função punitivo-pedagógica. "
        "{resultado_texto}.",
    ],
    "Família": [
        "APELAÇÃO CÍVEL. DIREITO DE FAMÍLIA. AÇÃO DE DIVÓRCIO C/C PARTILHA "
        "DE BENS. Regime de comunhão parcial. Bens adquiridos na constância "
        "do casamento devem ser partilhados igualitariamente. Imóvel adquirido "
        "antes do matrimônio é bem particular. {resultado_texto}.",

        "AGRAVO DE INSTRUMENTO. AÇÃO DE ALIMENTOS. Binômio necessidade/"
        "possibilidade. Alimentos provisórios fixados em 30% dos rendimentos "
        "líquidos do alimentante. Manutenção do quantum até instrução "
        "processual completa. {resultado_texto}.",

        "APELAÇÃO. GUARDA COMPARTILHADA. Melhor interesse da criança. "
        "Inexistência de impedimento para o compartilhamento da guarda. "
        "Residência-base fixada com a genitora. Regime de convivência "
        "estabelecido de forma equilibrada. {resultado_texto}.",
    ],
    "Tributário": [
        "APELAÇÃO CÍVEL. DIREITO TRIBUTÁRIO. MANDADO DE SEGURANÇA. "
        "EXCLUSÃO DO ICMS DA BASE DE CÁLCULO DO PIS/COFINS. Aplicação do "
        "Tema 69 do STF (RE 574.706). O ICMS não compõe a base de cálculo "
        "para incidência do PIS e da COFINS. {resultado_texto}.",

        "EXECUÇÃO FISCAL. EXCEÇÃO DE PRÉ-EXECUTIVIDADE. PRESCRIÇÃO "
        "INTERCORRENTE. Transcurso de prazo superior a 5 anos sem "
        "localização de bens penhoráveis. Aplicação do art. 40, §4º, da "
        "Lei 6.830/80. {resultado_texto}.",

        "MANDADO DE SEGURANÇA. ISS. BASE DE CÁLCULO. SOCIEDADE DE PROFISSIONAIS. "
        "Direito ao recolhimento do ISS em valor fixo por profissional habilitado. "
        "Preenchimento dos requisitos do art. 9º, §3º, do DL 406/68. "
        "{resultado_texto}.",
    ],
    "Trabalhista": [
        "RECURSO ORDINÁRIO. RECLAMAÇÃO TRABALHISTA. VÍNCULO EMPREGATÍCIO. "
        "Presença dos requisitos do art. 3º da CLT: pessoalidade, "
        "habitualidade, onerosidade e subordinação. Reconhecimento do "
        "vínculo no período indicado na inicial. {resultado_texto}.",

        "RECURSO ORDINÁRIO. HORAS EXTRAS. INTERVALO INTRAJORNADA. "
        "Comprovação de supressão parcial do intervalo por controles de "
        "ponto. Pagamento do período suprimido como hora extra, com "
        "adicional de 50%. {resultado_texto}.",

        "AGRAVO DE PETIÇÃO. EXECUÇÃO TRABALHISTA. DESCONSIDERAÇÃO DA "
        "PERSONALIDADE JURÍDICA. Insuficiência patrimonial da empresa "
        "executada. Redirecionamento da execução aos sócios nos termos "
        "do art. 28, §5º, do CDC. {resultado_texto}.",
    ],
    "Criminal": [
        "APELAÇÃO CRIMINAL. FURTO QUALIFICADO. ART. 155, §4º, DO CP. "
        "Materialidade e autoria comprovadas pelo conjunto probatório. "
        "Depoimentos harmônicos das testemunhas e imagens de câmeras de "
        "segurança. Dosimetria adequada. {resultado_texto}.",

        "HABEAS CORPUS. TRÁFICO DE DROGAS. PRISÃO PREVENTIVA. "
        "Presença dos requisitos do art. 312 do CPP. Garantia da ordem "
        "pública ante a gravidade concreta do delito e risco de "
        "reiteração delitiva. {resultado_texto}.",

        "APELAÇÃO CRIMINAL. ESTELIONATO. ART. 171 DO CP. Ardil empregado "
        "para obtenção de vantagem patrimonial ilícita. Vítima induzida em "
        "erro mediante documentos falsificados. Condenação mantida. "
        "{resultado_texto}.",
    ],
    "Ambiental": [
        "APELAÇÃO CÍVEL. AÇÃO CIVIL PÚBLICA. DANO AMBIENTAL. "
        "Desmatamento irregular em área de preservação permanente. "
        "Responsabilidade objetiva do degradador, nos termos do art. 14, "
        "§1º, da Lei 6.938/81. Obrigação de reparação integral. "
        "{resultado_texto}.",

        "AGRAVO DE INSTRUMENTO. DIREITO AMBIENTAL. EMBARGO DE OBRA EM APP. "
        "Tutela de urgência concedida para cessação imediata da atividade "
        "degradadora. Periculum in mora e fumus boni iuris demonstrados. "
        "Princípio da precaução. {resultado_texto}.",
    ],
    "Administrativo": [
        "APELAÇÃO CÍVEL. MANDADO DE SEGURANÇA. CONCURSO PÚBLICO. "
        "Candidato aprovado dentro do número de vagas previsto no edital. "
        "Direito subjetivo à nomeação. Precedentes do STF (RE 598.099). "
        "{resultado_texto}.",

        "AÇÃO ORDINÁRIA. SERVIDOR PÚBLICO. REAJUSTE REMUNERATÓRIO. "
        "Lei estadual que concedeu reajuste a determinada categoria. "
        "Extensão administrativa indevida. Violação ao princípio da "
        "legalidade. {resultado_texto}.",

        "APELAÇÃO. DESAPROPRIAÇÃO. INDENIZAÇÃO PRÉVIA E JUSTA. "
        "Laudo pericial que fixou o valor do imóvel em montante superior "
        "ao ofertado pela Administração. Prevalência do laudo técnico "
        "imparcial. Juros compensatórios devidos. {resultado_texto}.",
    ],
    "Execução Fiscal": [
        "APELAÇÃO. EXECUÇÃO FISCAL. CDA. NULIDADE. Certidão da dívida "
        "ativa que não atende aos requisitos do art. 2º, §5º, da Lei "
        "6.830/80. Ausência de fundamentação legal da cobrança e do "
        "cálculo dos juros. {resultado_texto}.",

        "EXECUÇÃO FISCAL. REDIRECIONAMENTO AO SÓCIO-GERENTE. "
        "Dissolução irregular da empresa. Aplicação da Súmula 435 do STJ. "
        "Nome do sócio constante na CDA gera presunção de legitimidade "
        "passiva. {resultado_texto}.",

        "EMBARGOS À EXECUÇÃO FISCAL. IPTU. ISENÇÃO. Imóvel utilizado "
        "como templo religioso. Imunidade tributária do art. 150, VI, "
        "'b', da CF/88. Extensão aos imóveis alugados cujo rendimento "
        "é revertido às finalidades da entidade. {resultado_texto}.",
    ],
}

# Textos de resultado para inserir nas ementas
RESULTADO_TEXTOS = {
    "procedente": "Recurso conhecido e julgado procedente",
    "improcedente": "Recurso conhecido, porém julgado improcedente",
    "parcialmente_procedente": "Recurso conhecido e julgado parcialmente procedente",
    "provido": "Recurso provido para reformar a sentença de primeiro grau",
    "desprovido": "Recurso conhecido e desprovido, mantendo-se a decisão recorrida",
    "parcial_provimento": "Recurso parcialmente provido para adequar o quantum indenizatório",
    "não_conhecido": "Recurso não conhecido por ausência de pressupostos de admissibilidade",
}

# ---------------------------------------------------------------------------
# Perfis de tendência para magistrados
# ---------------------------------------------------------------------------

# Distribuições de probabilidade de resultado por "perfil" do magistrado
# (procedente, improcedente, parcial)
PERFIL_LIBERAL = [0.55, 0.20, 0.25]
PERFIL_MODERADO = [0.35, 0.35, 0.30]
PERFIL_CONSERVADOR = [0.20, 0.55, 0.25]

# STJ tem padrão diferente: mais desprovido
PERFIL_STJ_PADRAO = [0.15, 0.55, 0.20, 0.10]  # provido, desprovido, parcial, não_conhecido


# ---------------------------------------------------------------------------
# Funções auxiliares
# ---------------------------------------------------------------------------

def _gerar_nome() -> str:
    """Gera um nome brasileiro realista e variado."""
    if random.random() < 0.5:
        primeiro = random.choice(PRIMEIROS_NOMES_MASC)
    else:
        primeiro = random.choice(PRIMEIROS_NOMES_FEM)

    # 2 ou 3 sobrenomes
    n_sobrenomes = random.choice([2, 3])
    sobrenomes = random.sample(SOBRENOMES, n_sobrenomes)

    return f"{primeiro} {' '.join(sobrenomes)}"


def _gerar_numero_processo(tribunal: str, ano: int) -> str:
    """Gera um número de processo no formato CNJ."""
    seq = random.randint(1000000, 9999999)
    digito = random.randint(10, 99)
    justica = "8"  # Justiça Estadual

    codigos_tribunal = {
        "TJMG": "13",
        "STJ": "03",
        "TJPA": "14",
        "TJMA": "10",
    }

    tribunal_cod = codigos_tribunal.get(tribunal, "13")
    vara = f"{random.randint(1, 99):04d}"

    return f"{seq}-{digito}.{ano}.{justica}.{tribunal_cod}.{vara}"


def _gerar_ementa(materia: str, resultado: str) -> str:
    """Gera uma ementa realista para a matéria e resultado dados."""
    templates = EMENTAS_TEMPLATES.get(materia, EMENTAS_TEMPLATES["Consumidor"])
    template = random.choice(templates)
    resultado_texto = RESULTADO_TEXTOS.get(resultado, "Recurso julgado")
    return template.format(resultado_texto=resultado_texto)


def _gerar_data_aleatoria(inicio: datetime, fim: datetime) -> datetime:
    """Gera uma data aleatória entre início e fim."""
    delta = fim - inicio
    dias = random.randint(0, delta.days)
    return inicio + timedelta(days=dias)


def _escolher_resultado_1a(perfil: list[float]) -> str:
    """Escolhe resultado de 1ª instância baseado no perfil do magistrado."""
    return random.choices(
        RESULTADOS_1A_INSTANCIA,
        weights=perfil,
        k=1,
    )[0]


def _escolher_resultado_2a(perfil_stj: list[float]) -> str:
    """Escolhe resultado de 2ª instância / STJ."""
    return random.choices(
        RESULTADOS_2A_INSTANCIA,
        weights=perfil_stj,
        k=1,
    )[0]


def _escolher_perfil() -> list[float]:
    """Escolhe um perfil de tendência para o magistrado."""
    return random.choices(
        [PERFIL_LIBERAL, PERFIL_MODERADO, PERFIL_CONSERVADOR],
        weights=[0.3, 0.4, 0.3],
        k=1,
    )[0]


# ---------------------------------------------------------------------------
# Definições de magistrados por tribunal
# ---------------------------------------------------------------------------

def _gerar_magistrados_tjmg() -> list[dict]:
    """Gera 20 magistrados do TJMG."""
    magistrados = []
    for i in range(20):
        vara = VARAS_TJMG[i % len(VARAS_TJMG)]
        is_desembargador = "Câmara" in vara
        cargo = "Desembargador(a)" if is_desembargador else "Juiz(a) de Direito"

        magistrados.append({
            "nome": _gerar_nome(),
            "tribunal": "TJMG",
            "vara_turma": vara,
            "cargo": cargo,
            "perfil": _escolher_perfil(),
            "n_decisoes": random.randint(8, 30),
            "materias_preferidas": random.sample(MATERIAS, k=random.randint(2, 4)),
        })
    return magistrados


def _gerar_magistrados_stj() -> list[dict]:
    """Gera 10 ministros do STJ."""
    magistrados = []
    for i in range(10):
        turma = TURMAS_STJ[i % len(TURMAS_STJ)]
        magistrados.append({
            "nome": _gerar_nome(),
            "tribunal": "STJ",
            "vara_turma": turma,
            "cargo": "Ministro(a)",
            "perfil": PERFIL_STJ_PADRAO,  # STJ tem perfil próprio
            "n_decisoes": random.randint(10, 30),
            "materias_preferidas": random.sample(MATERIAS, k=random.randint(3, 5)),
        })
    return magistrados


def _gerar_magistrados_tjpa() -> list[dict]:
    """Gera 10 desembargadores do TJPA."""
    magistrados = []
    for i in range(10):
        vara = VARAS_TJPA[i % len(VARAS_TJPA)]
        is_desembargador = "Câmara" in vara or "Turma" in vara
        cargo = "Desembargador(a)" if is_desembargador else "Juiz(a) de Direito"

        magistrados.append({
            "nome": _gerar_nome(),
            "tribunal": "TJPA",
            "vara_turma": vara,
            "cargo": cargo,
            "perfil": _escolher_perfil(),
            "n_decisoes": random.randint(8, 25),
            "materias_preferidas": random.sample(MATERIAS, k=random.randint(2, 4)),
        })
    return magistrados


def _gerar_magistrados_tjma() -> list[dict]:
    """Gera 10 desembargadores do TJMA."""
    magistrados = []
    for i in range(10):
        vara = VARAS_TJMA[i % len(VARAS_TJMA)]
        is_desembargador = "Câmara" in vara
        cargo = "Desembargador(a)" if is_desembargador else "Juiz(a) de Direito"

        magistrados.append({
            "nome": _gerar_nome(),
            "tribunal": "TJMA",
            "vara_turma": vara,
            "cargo": cargo,
            "perfil": _escolher_perfil(),
            "n_decisoes": random.randint(8, 25),
            "materias_preferidas": random.sample(MATERIAS, k=random.randint(2, 4)),
        })
    return magistrados


# ---------------------------------------------------------------------------
# Função principal de seed
# ---------------------------------------------------------------------------

async def seed_mij_data(db_session: AsyncSession) -> dict:
    """
    Popula o banco de dados com dados demonstrativos do MIJ.

    Cria magistrados e decisões distribuídos entre TJMG, STJ, TJPA e TJMA
    com distribuição estatística realista.

    Args:
        db_session: Sessão assíncrona do SQLAlchemy.

    Returns:
        Dicionário com resumo da inserção:
        {
            'magistrados_criados': int,
            'decisoes_criadas': int,
            'por_tribunal': { 'TJMG': {'magistrados': N, 'decisoes': N}, ... }
        }
    """
    logger.info("Iniciando seed de dados MIJ...")

    # Período das decisões: Jan/2024 a Jun/2026
    data_inicio = datetime(2024, 1, 1, tzinfo=timezone.utc)
    data_fim = datetime(2026, 6, 30, tzinfo=timezone.utc)

    # Gerar definições de magistrados
    todas_definicoes = []
    todas_definicoes.extend(_gerar_magistrados_tjmg())
    todas_definicoes.extend(_gerar_magistrados_stj())
    todas_definicoes.extend(_gerar_magistrados_tjpa())
    todas_definicoes.extend(_gerar_magistrados_tjma())

    # Contadores para resumo
    magistrados_criados = 0
    decisoes_criadas = 0
    por_tribunal: dict = {}

    for defn in todas_definicoes:
        tribunal = defn["tribunal"]
        if tribunal not in por_tribunal:
            por_tribunal[tribunal] = {"magistrados": 0, "decisoes": 0}

        # Criar magistrado
        magistrado = Magistrado(
            nome=defn["nome"],
            tribunal=tribunal,
            vara=defn["vara_turma"],
            comarca=defn.get("comarca"),
        )
        db_session.add(magistrado)
        await db_session.flush()  # Obter o ID

        magistrados_criados += 1
        por_tribunal[tribunal]["magistrados"] += 1

        logger.debug(
            "Magistrado criado: %s (%s - %s)",
            defn["nome"],
            tribunal,
            defn["vara_turma"],
        )

        # Gerar decisões para este magistrado
        n_decisoes = defn["n_decisoes"]
        perfil = defn["perfil"]
        materias_pref = defn["materias_preferidas"]

        for _ in range(n_decisoes):
            materia = random.choice(materias_pref)
            data_julg = _gerar_data_aleatoria(data_inicio, data_fim)

            # Determinar tipo e resultado baseado no tribunal
            if tribunal == "STJ":
                tipo = random.choices(
                    ["Acórdão", "Decisão Interlocutória"],
                    weights=[0.8, 0.2],
                    k=1,
                )[0]
                resultado = _escolher_resultado_2a(perfil)
            else:
                tipo = random.choices(
                    TIPOS_DECISAO,
                    weights=[0.50, 0.25, 0.15, 0.10],
                    k=1,
                )[0]
                resultado = _escolher_resultado_1a(perfil)

            # Gerar dados complementares
            ementa = _gerar_ementa(materia, resultado)
            ano = data_julg.year
            numero_processo = _gerar_numero_processo(tribunal, ano)

            # Tempo de tramitação (em dias) — aleatório mas realista
            tempo_tramitacao = random.randint(30, 720)

            # Para decisões de 1ª instância, eventualmente adicionar
            # resultado de 2ª instância (30% das vezes)
            resultado_2a = None
            if tribunal != "STJ" and random.random() < 0.30:
                resultado_2a = _escolher_resultado_2a(PERFIL_STJ_PADRAO)

            decisao = Decisao(
                processo_numero=numero_processo,
                tribunal=tribunal,
                magistrado_id=magistrado.id,
                materia=materia,
                tipo=tipo,
                resultado=resultado,
                ementa=ementa,
                data_decisao=data_julg,
            )
            db_session.add(decisao)
            decisoes_criadas += 1
            por_tribunal[tribunal]["decisoes"] += 1

    # Commit de tudo
    await db_session.commit()

    resumo = {
        "magistrados_criados": magistrados_criados,
        "decisoes_criadas": decisoes_criadas,
        "por_tribunal": por_tribunal,
    }

    logger.info(
        "Seed MIJ concluído: %d magistrados, %d decisões",
        magistrados_criados,
        decisoes_criadas,
    )
    for trib, counts in por_tribunal.items():
        logger.info(
            "  %s: %d magistrados, %d decisões",
            trib,
            counts["magistrados"],
            counts["decisoes"],
        )

    return resumo
