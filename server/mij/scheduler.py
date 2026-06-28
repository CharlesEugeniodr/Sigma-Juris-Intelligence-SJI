import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from server.mij.scrapers.datajud import DataJudScraper
from server.mij.scrapers.tjmg import TJMGScraper
from server.mij.scrapers.stj import STJScraper
from server.database import async_session

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()

async def run_all_scrapers():
    logger.info("Iniciando execução agendada dos scrapers (Prova de Conceito)...")
    
    try:
        datajud = DataJudScraper(tribunal="tjmg")
        tjmg = TJMGScraper()
        stj = STJScraper()
        
        logger.info("Executando DataJudScraper (TJMG) para 'improbidade'...")
        datajud_res = await datajud.fetch_decisoes(materia="improbidade", size=5)
        logger.info(f"DataJud retornou {len(datajud_res)} resultados.")
        
        logger.info("Executando TJMGScraper para 'improbidade'...")
        tjmg_res = await tjmg.buscar_jurisprudencia(termo="improbidade", resultados_por_pagina=5)
        logger.info(f"TJMG retornou {len(tjmg_res)} resultados.")
        
        logger.info("Executando STJScraper para 'improbidade'...")
        stj_res = await stj.buscar_jurisprudencia(termo="improbidade")
        logger.info(f"STJ retornou {len(stj_res)} resultados.")
        
        logger.info("Execução agendada dos scrapers concluída com sucesso!")
        
    except Exception as e:
        logger.error(f"Erro ao executar scrapers agendados: {e}", exc_info=True)

# Add the scheduled job
scheduler.add_job(run_all_scrapers, 'cron', hour=2, minute=0, id="daily_scraper")
