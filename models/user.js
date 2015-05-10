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
        bcrypt = require('bcrypt');

    var TokenSchema = require('./token').TokenSchema,
        Token = require('./token').Token;

    var DropSchema = require('./drop').DropSchema,
        Drop = require('./drop').Drop;

    var UserSchema = new Schema({
        creation_date: {
            type: Date,
            default: Date.now
        },
        password: {
            type: String,
            required: true
        },
        tokens: [TokenSchema],
        drops: [DropSchema]
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

    /* JWT static methods */
    UserSchema.statics.encodeJwt = function(data, secret) {
        return jwt.encode(data, secret);
    };

    UserSchema.statics.decodeJwt = function(data, secret) {
        return jwt.decode(data, secret);
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

    UserSchema.methods.validateToken = function(token) {
        var validTokens = [];

        for (var i = 0; i < this.tokens.length; i++) {
            if (this.tokens[i].token == token) {
                return !this.tokens[i].isExpired();
            }
        }

        // token not found
        return false;
    };

    UserSchema.methods.invalidateToken = function(token) {
        if (this.constructor.validateToken(token)) {
            for (var i = 0; i < this.tokens.length; i++) {
                if (this.tokens[i].token == token) {
                    this.tokens[i].invalidate();
                    return true;
                }
            }

            // token not found
            return false;
        } else {
            // already is invalid
            return true;
        }
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
        var token = new Token({});

        token.token = this.constructor.encodeJwt({
            email: this.email
        }, token.tokenSecret);

        this.tokens.push(token);

        return token.token;
    };

    var User = mongoose.model('User', UserSchema);
    module.exports = User;
})();
