(function() {
    'use strict';

    var express = require('express'),
        exphbs = require('express-handlebars'),
        path = require('path');

    var app = module.exports = express(),
		session = require('express-session'),
        cookieParser = require('cookie-parser');

    var passport = require('passport');

    var config = require('../config');

    var MongoStore = require('connect-mongo')(session);

    var User = require('../models/user');

    var database = process.env.MONGODB_URI || 'mongodb://localhost:27017/idroplink';

    var sessionOpts = {
        saveUninitialized: true, // saved new sessions
        resave: false, // do not automatically write to the session store
        store: new MongoStore({
            url: database
        }),
        secret: config.secrets.sessions,
        cookie : { httpOnly: true, maxAge: 2419200000 } // configure when sessions expires
    };


    // set up sessions
    app.use(cookieParser(config.secrets.sessions));
    app.use(session(sessionOpts));

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
            site: 'launch',
            userId: req.session.userId
        });
    });

    app.get('/signup', function(req, res, next) {
        res.render('signup', {
            title: 'idrop.link - sig nup',
            site: 'signup',
            userId: req.session.userId
        });
    });

    app.get('/signin', function(req, res, next) {
        if (!req.session.userId) {
            res.render('signin', {
                title: 'idrop.link - sign in',
                site: 'signin'
            });
        } else {
            res.redirect('/u/' + req.session.userId);
        }
    });

    app.post('/signin',
        passport.authenticate('local', {
            session: false
        }), function(req, res, next) {
            User.findOne({
                email: req.body.email
            }, function(err, doc) {
                if (err) {
                    return res
                        .status(500)
                        .json({
                            message: 'Something bad happened. We are sorry. Please try again later.'
                        });
                }

                if (!doc) {
                    return res
                        .status(404)
                        .json({
                            message: 'No such user with this mail.'
                        });
                }

                req.session.userId = doc._id;

                return res
                    .status(200)
                    .json({
                        _id: doc._id
                    });
            });
    });

    app.get('/signout', function(req, res, next) {
        req.logout();
        req.session.userId = null;

        res.redirect('/');
    });

    app.get('/welcome', function(req, res, next) {
        var toast = null;

        if (req.query.referal == 'signup') {
            var toast = 'Your account was successfully created. Kick off your idrop.link experience by downloading our app for your mac.';
        }

        res.render('welcome', {
            toast: toast,
            title: 'idrop.link - Welcome aboard!',
            site: 'welcome',
            userId: req.session.userId
        });
    });

    app.get('/d/:shortId', function(req, res, next) {
        User.findOne({
                'drops.shortId': req.params.shortId
            },
            {
                'drops.$': 1
            }, function(err, doc) {
                if (err)
                    return next(err);

                if (!doc)
                    return next();

                doc.views = doc.views ? doc.views + 1 : 1;

                doc.save(function(err, _doc) {
                    if (err) {
                        console.err('doc cannot be saved: ' + doc._id);
                    }

                    var _type = doc.drops[0].type.toLowerCase();

                    var isImage = (_type == "jpg"
                        || _type == "jpeg"
                        || _type == "png"
                        || _type == "svg"
                        || _type == "gif") ? true : false;

                    res.render('drop', {
                        path: doc.drops[0].path,
                        is_image: isImage,
                        site: 'drop',
                        title: doc.drops[0].name,
                        userId: req.session.userId
                    });
                });
            });
    });

    app.get('/u/', function(req, res, next) {
        res.redirect('/');
    });

    app.get('/u/:userId', function(req, res, next) {
        if (!req.session.userId || (req.session.userId != req.params.userId)) {
            return res.redirect('/');
        }

        User.findById(req.params.userId, function(err, doc) {
            if (err)
                return next(err);

            if (!doc)
                return next();

            res.render('drops', {
                    drops: doc.drops,
                    site: 'drops',
                    title: doc.email + ' drops.',
                    userId: req.session.userId
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
                error_num: 404,
                userId: req.session.userId
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
            error_num: 500,
            userId: req.session.userId ? req.session : None
        });
    });
})();
