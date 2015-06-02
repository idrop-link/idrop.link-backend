(function() {
    'use strict';

    var express = require('express'),
        exphbs = require('express-handlebars'),
        path = require('path');

    var app = module.exports = express();

    var User = require('../models/user');

        /* Handlebars Layouts */
    var hbs = exphbs.create({
        defaultLayout: 'main',
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials',
        helpers: {
            "is_eq": function(a, b, opts) {
                return a == b ? opts.fn(this) : opts.inverse(this);
            }
        }
    });

    app.engine('handlebars', hbs.engine);
    app.set('view engine', 'handlebars');
    app.set('views', __dirname + '/views');

    /* serve documentation as static content */
    app.use('/doc', express.static(path.join(__dirname + '../doc')));

    /* static stuff like css, js with static middleware */
    app.use('/public', express.static(__dirname + '/public'));
    app.use('/bower_components', express.static(__dirname + '/bower_components'));

    /* serve files as static content */
    app.use('/static_data', express.static(path.join(__dirname, '../static_data')));

    /* serve documentation as static content */
    app.use('/doc', express.static(__dirname + '/doc'));

    app.get('/', function(req, res, next) {
        res.render('launch', {
            title: 'idrop.link - coming soon',
            site: 'launch'
        });
    });

    app.get('/signup', function(req, res, next) {
        res.render('signup', {
            title: 'idrop.link - signup',
            site: 'signup'
        });
    });

    app.get('/welcome', function(req, res, next) {
        var toast = null;

        if (req.query.referal == 'signup') {
            var toast = 'Your account was successfully created. Kick off your idrop.link experience by downloading our app for your mac.';
        }

        res.render('welcome', {
            toast: toast,
            title: 'idrop.link - Welcome aboard!',
            site: 'welcome'
        });
    });

    app.get('/d/:shortId', function(req, res, next) {
        User.findOne({'drops.shortId': req.params.shortId},
            {'drops.$': 1}, function(err, doc) {
                if (err)
                    return next(err);

                if (!doc)
                    return next();

                doc.views = doc.views ? doc.views + 1 : 1;

                doc.save(function(err, _doc) {
                    if (err) {
                        console.err('doc cannot be saved: ' + doc._id);
                    }

                    var isImage = (doc.drops[0].type == "jpg"
                        || doc.drops[0].type == "jpeg"
                        || doc.drops[0].type == "png"
                        || doc.drops[0].type == "gif") ? true : false;

                    res.render('drop', {
                        path: doc.drops[0].path,
                        is_image: isImage,
                        site: 'drop',
                        title: doc.drops[0].name
                    });
                });
            });
    });

    // error handling
    app.use(function(req, res, next) {
        res.status(404);

        // respond with html page
        if (req.accepts('html')) {
            res.render('error', {
                site: 'error',
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
