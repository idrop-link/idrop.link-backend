/**
 * Defines the User database object
 *
 * @author Christian Schulze
 */
(function() {
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var UserSchema = new Schema({
        creation_date: {
            type: Date,
            default: Date.now
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        registrationDate: Date,
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

    // add a method to the model to verify the password
    UserSchema.methods.verifyPassword = function(password, callback) {
        bcrypt.compare(password, this.password, function(err, matches) {
            if (err)
                return callback(err);

            // returning to callback with err = null and whether or not
            // the passwords are matching
            callback(null, matches);
        });
    };

    var User = mongoose.model('User', UserSchema);
    module.exports = User;
})();
