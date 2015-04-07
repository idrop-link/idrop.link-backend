(function() {
    'use strict';

    var mongoose = require('mongoos'),
        Schema = mongoose.Schema;

    var TokenSchema = new Schema({
        token: String,
        creation_date: {
            type: Date,
            default: Date.now
        }
    });

    var Token = mongoose.model('Token', TokenSchema);
    module.exports = Token;
})();
