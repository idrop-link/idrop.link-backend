(function() {
    var express = require('express'),
        mongoose = require('mongoose');

    var app = exports.app = express();

    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy,
        User = require('models/user');

    var api = require('./api'),

    /* set up CORS header */
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    /* set up authentification */
    passport.use(new LocalStrategy(function(email, password, done)
        User.findOne({
            email: email
        }, function(err, doc) {
            if (err)
                return done(err);

            if (!user) {
                return done(null, false, {
                    message: 'No such User.'
                });
            }

            return done(null, doc);
        });
    ));

    app.use(api);

    /* serve documentation as static content */
    app.use('/doc', express.static(__dirname + '/doc'));


    /* Mongoose */
    /* Establish database connection: either use the specified `DB_URI=ADDRESS_TO_MONGODB`
    via the environment, or fall back to the default path */
    var database = process.env.MONGODB_URI || 'localhost:27017/idroplink';
    mongoose.connect(database);

    mongoose.connection.on('connected', function() {
        console.log('Mongoose connected to database');
    });

    mongoose.connection.on('error', function(err) {
        console.log(err);
    });

    mongoose.connection.on('disconnected', function() {
        console.log('Mongoose disconnected');
    });

    /* Mongoose disconnection on app termination */
    process.on('SIGINT', function() {
        mongoose.connection.close(function() {
            console.log('Mongoose is disconnecting due to app termination');
            process.exit(0);
        });
    });

    app.listen(7667);
})();
