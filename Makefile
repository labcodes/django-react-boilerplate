.DEFAULT_GOAL := help

help: ## show help message
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[$$()% a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)


.PHONY: build_frontend run_frontend run_django run install_dependencies setup_node_environment

build_frontend: ## build frontend application
	npm run build

run_frontend: ## run frontend application
	npm start

run_django: ## run backend application
	python manage.py runserver

run_cypress:
	./node_modules/.bin/cypress open

run: ## run both backend and frontend applications
	make -j2 run_django run_frontend

run_e2e:
	make -j3 run_django run_frontend run_cypress

install_dependencies: ## install both backend and frontend dependencies
	make setup_node_environment
	poetry install
	npm i

setup_node_environment: ## setup node environment
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
	export NVM_DIR=$$HOME/.nvm; . ~/.nvm/nvm.sh ; nvm install

test: ## run the tests
	pytest

cov: ## run the tests, and open coverage report in your favorite browser
	pytest && python -m webbrowser -t htmlcov/index.html
