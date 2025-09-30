FROM python:3.12.11-alpine

WORKDIR /backend
COPY api .
COPY api/.env.backend .env

RUN pip install -r requirements.txt
EXPOSE 8000

ENTRYPOINT [ "sh","-c", "python manage.py migrate;python manage.py runserver 0.0.0.0:8000;" ]


