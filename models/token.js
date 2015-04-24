(function() {
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var TokenSchema = new Schema({
        token: {
            type: String,
            required: true
        },
        creation_date: {
            type: Date,
            default: Date.now
        },
        expiration_date: Date
    });

    /* methods */
    /**
     * Checks whether or not the token is expired or is valid.
     *
     * @return whether or not token is valid
     */
    TokenSchema.methods.isExpired = function() {
        var now = new Date();

        // FIXME: we can't compare dates this way
        if (this.expiration_date === undefined || this.expiration_date >= now.getTime()) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * Invalidates this very token.
     */
    TokenSchema.methods.invalidate = function() {
        var now = new Date();
        this.expiration_date = now.getTime();
    };

    var Token = mongoose.model('Token', TokenSchema);
    module.exports.Token = Token;
    module.exports.TokenSchema = TokenSchema;
})();
