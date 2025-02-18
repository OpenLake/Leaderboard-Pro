PNPM ?= pnpm
PYTHON ?= python3
PIP ?= pip3
MAKE ?= make

install:
	cd api/ && $(PIP) install -r requirements.txt
	cd app/ && $(PNPM) i

migrate:
	cd api/ && $(PYTHON) manage.py makemigrations
	cd api/ && $(PYTHON) manage.py migrate

dev-ui:
	cd app/ && $(PNPM) run start

dev-server:
	cd api/ && $(PYTHON) manage.py runserver &

celery-1:
	cd api/ && celery -A leaderboard worker --loglevel=info

celery-2:
	cd api/ && celery -A leaderboard beat -l info

dev:
	@echo 'Starting dev servers'
	$(MAKE) migrate
	$(MAKE) dev-ui &
	$(MAKE) dev-server &
	$(MAKE) celery-1 &
	$(MAKE) celery-2
