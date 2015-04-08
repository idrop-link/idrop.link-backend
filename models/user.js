/**
 * Defines the User database object
 *
 * @author Christian Schulze
 */
(function() {
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        passportLocalMongoose = require('passport-local-mongoose'),
        jwt = require('jwt-simple'),
        path = require('path'),
        bcrypt= require('bcrypt');

    var tokenSecret = require(path.join(__dirname, '../', '/config/secrets')).tokenSecret;

    var TokenSchema = require('./token').TokenSchema,
        Token = require('./token').Token;

    var UserSchema = new Schema({
        creation_date: {
            type: Date,
            default: Date.now
        },
        password: {
            type: String,
            required: true
        },
        tokens: [TokenSchema]
    });

    UserSchema.plugin(passportLocalMongoose, {
        usernameField: 'email',
        usernameUnique: true
    });

    // hashing and salting the password before saving
    UserSchema.pre('save', function(callback) {
        var user = this;

        // no need to salt the password again
        if (!user.isModified('password'))
            return callback();

        bcrypt.genSalt(10, function(err, salt) {
            if (err)
                return callback(err);

            // hash the password and save it back to the db
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err)
                    return callback(err);

                user.password = hash;
                callback();
            });
        });
    });

    /* JTW static methods */
    UserSchema.statics.encodeJwt = function(data) {
        return jtw.encode(data, tokenSecret);
    };

    UserSchema.statics.encodeJwt = function(data) {
        return jwt.decode(data, tokenSecret);
    };

    /**
     * Verify password of the user
     *
     * @param password {String}     password of the user
     * @param callback {Function}   to call when finished
     */
    UserSchema.methods.verifyPassword = function(password, callback) {
        bcrypt.compare(password, this.password, function(err, matches) {
            if (err)
                return callback(err);

            // returning to callback with err = null and whether or not
            // the passwords are matching
            callback(null, matches);
        });
    };

    /**
     * Invalidate all tokens of the user to guarantee uniqueness of a token.
     */
    UserSchema.methods.invalidateTokens = function() {
        for (var i = 0; i < this.tokens.length; i++) {
            this.tokens[i].invalidate();
        }
    };

    UserSchema.methods.createToken = function() {
        var token = this.constructor.encodeJwt(this.email);

        this.token = new Token({
            token: token
        });

        return token;
    };

    var User = mongoose.model('User', UserSchema);
    module.exports = User;
})();
