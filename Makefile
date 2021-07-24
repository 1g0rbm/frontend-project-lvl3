check: lint

install:
	npm ci

lint:
	npx eslint .
lint-fix:
	npx eslint . --fix

build:
	npm run build
dev:
	npm run dev
watch:
	npm run watch
start:
	npm run start