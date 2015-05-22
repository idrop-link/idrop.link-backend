# idrop.link-backend ![strider build badge](http://ci.andinfinity.de/andinfinity/idrop.link-backend/badge?branch=master) ![david dependency badge](https://david-dm.org/andinfinity/idrop.link-backend.svg)
idrop.link - self hosted personal screenshot and file cloud to share with your friends, colleagues and family.

This app is meant to be hosted by yourself. So you stay in control of your data and security. To host the backend (the part of the app which stores and servers your drops in the internet) you need a webserver that supports at least `Nodejs` and `MongoDB`. (If you are unsure, check out [uberspace.de](http://uberspace.de).) idrop.link can also be hosted on heroku. For details check out [this guide](https://github.com/andinfinity/idrop.link-backend/wiki/Running-idrop.link-on-Heroku).

idrop.link also supports several ways to store your files:
    * plain filesystem (adviced if hosted on traditional server/webspace)
    * Amazon Web Services S3 content delivery network (mandatory if hosted on heroku)

## Development
Before touching anything, run `npm install --development` in the root directory of the project. You should have grunt have a look over your files while developing: `grunt watch`. Before commiting it is **mandatory** to run `grunt beautify`.
For everything you add, please provide tests. (See `Makefile` and `./test`) If you have problems check if your mongodb copy runs under the default host, otherwise provide it like this:
```
env $MONGODB_URI='localhost:27017/idroplink' make test
```

The API documentation is available [here](http://andinfinity.github.io/idrop.link-backend/).

## Production
It is currently not advised to run this project in production mode.

### Installation
Please see below for a detailed installation guide depending on your setup:
* [idrop.link a regular web server](https://github.com/andinfinity/idrop.link-backend/wiki/Running-idrop.link-on-a-web-server)
* [idrop.link on heroku](https://github.com/andinfinity/idrop.link-backend/wiki/Running-idrop.link-on-Heroku)
