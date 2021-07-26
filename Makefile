check: lint style-lint

install:
	npm ci

lint:
	npx eslint .
lint-fix:
	npx eslint . --fix
style-lint:
	npx stylelint "./src/styles/*.scss"

build:
	npm run build
dev:
	npm run dev
watch:
	npm run watch
start:
	npm run start