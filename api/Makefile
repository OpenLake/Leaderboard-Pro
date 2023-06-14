PYTHON ?= python3
PIP ?= pip3

migrate:
	$(PYTHON) manage.py makemigrations
	$(PYTHON) manage.py migrate

dev-server:
	$(PYTHON) manage.py runserver &

celery-1:
	celery -A leaderboard worker --loglevel=info

celery-2:
	celery -A leaderboard beat -l info

dev:
	@echo 'Starting dev servers'
	$(MAKE) migrate
	$(MAKE) dev-server &
	$(MAKE) celery-1 &
	$(MAKE) celery-2
