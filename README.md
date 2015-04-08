# idrop.link-backend ![strider build badge](http://ci.andinfinity.de/andinfinity/idrop.link-backend/badge?branch=master) ![david dependency badge](https://david-dm.org/andinfinity/idrop.link-backend.svg)
idrop.link - self hosted personal screenshot and file cloud to share with your friends, colleagues and family

## Development
Before touching anything, run `npm install --development` in the root directory of the project. You should have grunt have a look over your files while developing: `grunt watch`. Before commiting it is **mandatory** to run `grunt beautify`.
For everything you add, please provide tests. (See `Makefile` and `./test`) If you have problems check if your mongodb copy runs under the default host, otherwise provide it like this:
```
env $MONGODB_URI='localhost:27017/idroplink' make test
```

The API documentation is available [here](http://andinfinity.github.io/idrop.link-backend/).

### Running the app
When everything is set up, run the app like this (you don't have to specify `$MONGODB_URI` if it runs at the standard host):

```
env $MONGODB_URI='localhost:27017/idroplink' node index
```

## Production
It is currently not advised to run this project in production mode.
