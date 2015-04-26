(function() {
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var TokenSchema = new Schema({
        token: {
            type: String,
            required: true
        },
        issuance_date: {
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

        if (this.expiration_date === undefined || Date.parse(this.expiration_date) < now.getTime()) {
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
