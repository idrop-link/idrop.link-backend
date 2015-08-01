(function() {
	'use strict';

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

    // set up plugins object
    var plugins = {};

    if (config.plugins.save == 'aws' || process.env.ENFORCE_AWS == 'true') {
        plugins.saveFile = require('./plugins/aws');
    } else {
        // fallback and default
        plugins.saveFile = require('./plugins/filesystem');
    }

    var api = require('./api')(plugins),
        frontend = require('./frontend');

    /* set up CORS header */
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    if (config.logging.do_log) {
        if (config.logging.access_log_path !== '') {
            var accessLogStream = fs.createWriteStream(path.join(__dirname,
                    config.logging.access_log_path),
                    {
                        flags: 'a'
                    });
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
    var mongooseIsConnected = false;

    /* Establish database connection: either use the specified `DB_URI=ADDRESS_TO_MONGODB`
    via the environment, or fall back to the default path */
    var connectionFn = function() {
        var database = process.env.MONGODB_URI || 'localhost:27017/idroplink';
        mongoose.connect(database);
    };

    // connect
    connectionFn();

    mongoose.connection.on('connected', function() {
        console.log('Mongoose connected to database');
        mongooseIsConnected = true;
    });

    mongoose.connection.on('error', function(err) {
        console.error(err);

        // closing via driver
        mongoose.connection.db.close();

        // retry connection until succeeding
        connectionFn();
    });

    mongoose.connection.on('disconnected', function() {
        console.log('Mongoose disconnected');
        mongooseIsConnected = false;
    });

    var handleDisconnect = function() {
        console.log('attempting graceful shutdown.');

        if (mongooseIsConnected) {
            mongoose.connection.close(function() {
                console.log('Mongoose is disconnecting due to app termination');
                process.exit(0);
            });
        } else {
            process.exit(0);
        }
    };

    /* Mongoose disconnection on app termination */
    process.on('SIGINT', handleDisconnect);
    process.on('SIGTERM', handleDisconnect);

    var port = process.env.PORT || config.api.port;
    app.listen(port);
    console.log('Listening at localhost:' + port);
})();
