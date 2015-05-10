(function() {
    'use strict';

    // don't change these lines
    var config = {};

    config.api = {};
    config.logging = {};

    // change the settings below

    // # API
    config.api.port = 7667;

    // # Logging
    config.logging.do_log = true;

    // use "" as path to log to stdout
    config.logging.access_log_path = "access.log";

    module.exports = config;
})();
