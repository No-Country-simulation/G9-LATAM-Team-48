FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
# Artefactos: trio v3 y/o model.joblib (local build o descarga MODEL_V3_* al arrancar)
COPY models ./models

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=5 \
  CMD python -c "import os,urllib.request; p=os.environ.get('PORT','8000'); urllib.request.urlopen(f'http://127.0.0.1:{p}/health')"

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
