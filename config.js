(function() {
    'use strict';

    // don't change these lines
    var config = {};

    config.api = {};
    config.general = {};
    config.logging = {};
    config.plugins = {};
    config.secrets = {};

    // change the settings below

    // # API
    config.api.port = 7667;

    // # Logging
    config.logging.do_log = true;

    // use "" as path to log to stdout
    config.logging.access_log_path = 'access.log';

    // BASE URL of your idrop.link backend instance
    config.general.base_url = 'http://idrop.link';

    // file saving plugin config
    config.plugins.save = 'filesystem'; // default: "filesystem"

    // session secret. CHANGE THIS!
    config.secrets.sessions = 'OITNT5246#MAS_@igjr39';

    module.exports = config;
})();
