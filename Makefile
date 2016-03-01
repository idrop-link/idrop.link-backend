test:
	env PORT="7697" @NODE_ENV=test ./node_modules/.bin/mocha --reporter spec test/*.js

.PHONY: test
