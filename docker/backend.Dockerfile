FROM python:3.12.11-alpine

WORKDIR /backend

COPY api/requirements.txt .

RUN apk add --no-cache postgresql-client \
    && pip install --no-cache-dir -r requirements.txt

COPY api/ .

COPY api/.env.backend .env

EXPOSE 8000

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
