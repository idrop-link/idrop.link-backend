(function() {
    'use strict';

    var express = require('express'),
        exphbs = require('express-handlebars'),
        path = require('path');

    var app = module.exports = express();

        /* Handlebars Layouts */
    var hbs = exphbs.create({
        defaultLayout: 'main',
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials'
    });

    app.engine('handlebars', hbs.engine);
    app.set('view engine', 'handlebars');
    app.set('views', __dirname + '/views');

    /* static stuff like css, js with static middleware */
    app.use('/public', express.static(__dirname + '/public'));
    app.use('/bower_components', express.static(__dirname + '/bower_components'));

    /* serve documentation as static content */
    app.use('/doc', express.static(__dirname + '/doc'));

    app.get('/', function(req, res, next) {
        res.render('launch', {
            title: 'idrop.link - coming soon',
            site: 'launch'
        });
    });

    // error handling
    app.use(function(req, res, next) {
        res.status(404);

        // respond with html page
        if (req.accepts('html')) {
            res.render('error', {
                title: "404 - Not found",
                error: "Not found: '" + req.url + "'.",
                error_num: 404
            });
            return;
        }

        // default to plain-text. send()
        res.type('txt').send('Not found: ' + req.url);
    });

    app.use(function(err, req, res, next) {
        // we may use properties of the error object
        // here and next(err) appropriately, or if
        // we possibly recovered from the error, simply next().
        res.status(err.status || 500);
        res.render('error', {
            error: err,
            error_num: 500
        });
    });
})();
