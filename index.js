(function() {
    var express = require('express'),
        mongoose = require('mongoose'),
        path = require('path'),
        fs = require('fs');

    var config = require('./config');

    var app = exports.app = express();

    var bodyParser = require('body-parser'),
        multer = require('multer'),
        morgan = require('morgan');

    var passport = require('passport'),
        User = require('./models/user');

    var api = require('./api'),
        frontend = require('./frontend');

    /* set up CORS header */
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    if (config.logging.do_log) {
        if (config.logging.access_log_path !== "") {
            var accessLogStream = fs.createWriteStream(path.join(__dirname, config.logging.access_log_path), {flags: 'a'});
            app.use(morgan('combined', {stream: accessLogStream}));
        } else {
            app.use(morgan('combined'));
        }
    }

    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    app.use(multer({
        dest: './uploads/'
    }));

    /* set up passport strategy */
    passport.use(User.createStrategy());

    app.use(api);
    app.use(frontend);

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

    app.listen(config.api.port);
    console.log('Listening at localhost:' + config.api.port);
})();
