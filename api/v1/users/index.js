(function() {
    'use strict';

    var express = require('express'),
        app = module.exports = express();

    // User
    /**
     * @api {post} /users Create User
     *
     * @apiName CreateUser
     * @apiGroup User
     *
     * @apiSuccess (200) {String} success contains the success description
     *
     * @apiError (400) {String} error contains the error description
     *
     * @apiParam {String} email unique email address
     * @apiParam {String} password the users password
     */
    app.post('/api/v1/users/', function(req, res) {
        var user = new User({
            email: email,
            password: password
        });

        User.register(new User({
            email: req.body.email
        }), req.body.password, function(err, doc) {
            if (err) {
                res.status = 400;
                res.json({error: err});
            } else {
                res.status = 200;
                res.json({success: "registered user"});
            }
        });
    });

    /**
     * Update User
     */
    app.put('/api/v1/users/:userId', function(req, res) {
        // TODO
    });

    /**
     * Lookup User
     */
    app.get('/api/v1/users/:userId', function(req, res) {
        // TODO
    });

    /**
     * Delete User
     */
    app.delete('/api/v1/users/:userId', function(req, res) {
        // TODO
    });

    // Tokens
    /**
     * @api {post} /users/:id/authenticate Create Token for a User
     *
     * @apiName CreateUserToken
     * @apiGroup User
     *
     * @apiError (500) error error while generating token
     * @apiError (401) error unauthorized
     *
     * @apiSuccess (200) token the requested token
     *
     * @apiParam {String} email for the user
     */
    app.post('/api/v1/users/:userId/authenticate', passport.authenticate('local', {session: false}), function(req, res) {
        if (req.user) {
            User.createToken(req.user.email, function(err, token) {
                if (err) {
                    res.status = 500;
                    res.json({error: err});
                } else {
                    res.status = 200;
                    res.json({token: token});
                }
            });
        } else {
            res.status = 401;
            res.json({error: "unauthorized"});
        }
    });

    // Drops
    /**
     * List drops of a User
     */
    app.get('/api/v1/users/:userId/drops', function(req, res) {
        // TODO
    });

    /**
     * Get details for a drop of a User
     */
    app.get('/api/v1/users/:userId/drops/:dropId', function(req, res) {
        // TODO
    });

    /**
     * Create new drop of a User
     */
    app.post('/api/v1/users/:userId/drops/:dropId', function(req, res) {
        // TODO
    });

    /**
     * Delete drop of a User
     */
    app.delete('/api/v1/users/:userId/drops/:dropId', function(req, res) {
        // TODO
    });
})();
