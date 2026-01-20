FROM python:3.12.11-alpine

WORKDIR /backend

COPY api/ .

RUN apk add --no-cache postgresql-client \
 && pip install --no-cache-dir -r requirements.txt

COPY api/.env.backend .env

EXPOSE 8000

# Entrypoint
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
