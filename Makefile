GIT_REVISION ?= $(shell git rev-parse --short HEAD)
GIT_TAG ?= $(shell git describe --tags --abbrev=0 | sed -e s/v//g)

DOCKERHUB_USERNAME ?= ks6088ts
DOCKER ?= docker
DOCKER_IMAGE_NAME ?= azure-openai-playground
DOCKER_COMMAND ?=
DOCKER_TAG_NAME ?= $(DOCKERHUB_USERNAME)/$(DOCKER_IMAGE_NAME):$(GIT_TAG)

API_KEY ?=
API_URL ?= "https://YOUR_AZURE_OPENAI_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT/chat/completions?api-version=2023-03-15-preview"

PLATFORM ?= linux/amd64

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
.DEFAULT_GOAL := help

.PHONY: install-deps-dev
install-deps-dev: ## install dependencies for development
	yarn install

.PHONY: server
server: ## server
	yarn dev

.PHONY: docker-build
docker-build: ## docker build
	$(DOCKER) build --platform=$(PLATFORM) -t $(DOCKER_TAG_NAME) .

.PHONY: docker-run
docker-run: ## docker run
	$(DOCKER) run --platform=$(PLATFORM) --rm \
		-p "3000:3000" \
		--env "API_KEY=$(API_KEY)" \
		--env "API_URL=$(API_URL)" \
		$(DOCKER_TAG_NAME)

.PHONY: docker-push
docker-push: ## docker push
	$(DOCKER) push $(DOCKER_TAG_NAME)
