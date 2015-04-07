(function() {
    var express = require('express'),
        mongoose = require('mongoose');

    var app = exports.app = express();

    var passport = require('passport'),
        User = require('models/user');

    var api = require('./api');

    /* set up CORS header */
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    /* set up passport strategy */
    passport.use(User.createStrategy());

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
