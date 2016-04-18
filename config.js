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

    // upload permitted or not? (all users)
    config.general.upload_permitted = true;

    // < 0 means unlimited (all users) / in megabyte
    config.general.upload_quota = -1;

    // all users
    config.general.signup_permitted = true;

    // all users / signup has to be permitted
    // "" means there is none
    config.general.signup_keyword = "";

    // all users
    config.general.login_permitted = true;

    // file saving plugin config
    config.plugins.save = 'filesystem'; // default: "filesystem"

    // session secret. CHANGE THIS!
    config.secrets.sessions = 'OITNT5246#MAS_@igjr39';

    module.exports = config;
})();
