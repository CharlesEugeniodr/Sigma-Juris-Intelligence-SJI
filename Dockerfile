# Usa uma imagem leve do Python 3.13
FROM python:3.13-slim

WORKDIR /app

# Instala as dependências do backend
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código do backend
COPY server/ ./server/

# Copia o código do frontend para que possa ser servido (se necessário pelo FastAPI)
COPY app/ ./app/
# (Opcional) Copia o script de build do frontend e executa
COPY scripts/ ./scripts/
RUN node scripts/build.js || echo "Node não instalado na imagem python, pular build JS"

# Expõe a porta 5000
EXPOSE 5000

# Comando para rodar a aplicação
CMD ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "5000"]
