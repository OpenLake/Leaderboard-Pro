#!/bin/sh

echo "Waiting for PostgreSQL..."

while ! pg_isready -h db -U leaderboardpro; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - running migrations"

python manage.py migrate
python manage.py runserver 0.0.0.0:8000
