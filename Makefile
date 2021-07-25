PNPM ?= pnpm
PYTHON ?= python3
PIP ?= pip3

install:
	cd api/ && $(PIP) install -r requirements.txt
	cd app/ && $(PNPM) install

migrate:
	cd api/ && $(PYTHON) manage.py makemigrations
	cd api/ && $(PYTHON) manage.py migrate

dev-ui:
	cd app/ && $(PNPM) run start

dev-server: migrate
	cd api/ && $(PYTHON) manage.py runserver &

dev: dev-server dev-ui 
	@echo 'Starting dev servers'
