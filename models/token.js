(function() {
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var TokenSchema = new Schema({
        token: String,
        creation_date: {
            type: Date,
            default: Date.now
        },
        expiration_date: Date,
        invalidation_date: Date
    });

    /* methods */
    /**
     * Checks whether or not the token is expired or is valid.
     *
     * @return whether or not token is valid
     */
    TokenSchema.methods.isExpired = function() {
        var now = new Date();

        if (this.expiration_date === null)
            return false;

        if (this.expiration_date >= now.getTime())
            return true;
        else
            return false;
    };

    /**
     * Invalidates this very token.
     */
    TokenSchema.methods.invalidate = function() {
        this.invalidation_date = Date().getTime();
    };

    var Token = mongoose.model('Token', TokenSchema);
    module.exports.Token = Token;
    module.exports.TokenSchema = TokenSchema;
})();
