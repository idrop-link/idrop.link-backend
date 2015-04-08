(function() {
    'use strict';

    var express = require('express'),
        app = module.exports = express(),
        passport = require('passport');

    // User
    /**
     * @api {post} /users Create User
     *
     * @apiName CreateUser
     * @apiGroup User
     *
     * @apiSuccess (200) {String} success contains the success description
     *
     * @apiError (400) {String} message contains the error description
     *
     * @apiParam {String} email unique email address
     * @apiParam {String} password the users password
     */
    app.post('/api/v1/users/', function(req, res) {
        User.register(new User({
            email: req.body.email
        }), req.body.password, function(err, doc) {
            if (err) {
                res.status = 400;
                res.json({
                    message: err
                });
            } else {
                res.status = 200;
                res.json({
                    message: 'registered user',
                    _id: doc._id
                });
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
     * @api {get} /users/:id Lookup User
     *
     * @apiName GetUser
     * @apiGroup User
     *
     * @apiSuccess (200) {String} _id id of the user
     * @apiSuccess (200) {String} email of the user
     * @apiSuccess (200) {String} creation_date when the user was created
     *
     * @apiError (500) {String} message something went wrong
     * @apiError (404) {String} message no such user
     * @apiError (401) {String} message unauthorized
     */
    app.get('/api/v1/users/:userId', function(req, res) {
        // validate token
        var incomingToken = User.decodeJwt(req.headers.token);

        if (incomingToken && incomingToken.email) {
            User.findById(req.params.userId, function(err, doc) {
                if (err) {
                    res.status = 500;
                    res.json({
                        message: err
                    });
                }

                if (!doc) {
                    res.status = 404;
                    res.json({
                        message: 'no such user'
                    });
                } else {
                    if (doc.email !== incomingToken.email) {
                        res.status = 401;
                        res.json({
                            messag: 'unauthorized'
                        });
                    } else {
                        res.status = 200;
                        res.json({
                            _id: doc._id,
                            email: doc.email,
                            creation_date: doc.creation_date
                        });
                    }
                }
            });
        } else {
            res.status = 401;
            res.json({
                message: 'unauthorized'
            });
        }
    });

    /**
     * @api {delete} /users/:id Delete User
     *
     * @apiName DeleteUser
     * @apiGroup User
     *
     * @apiError (500) message error while removing user
     * @apiError (404) message user with id not found
     * @apiError (401) message unauthorized
     * @apiError (400) message id and email do not match
     *
     * @apiSuccess (200) message removed user
     *
     */
    app.delete('/api/v1/users/:userId', passport.authenticate('local', {
        session: false
    }), function(req, res) {
        // validate token
        var incomingToken = User.decodeJwt(req.headers.token);

        if (incomingToken && incomingToken.email) {
            User.findById(req.body.userId, function(err, doc) {
                if (err) {
                    res.status = 400;
                    res.json({
                        message: err
                    });
                }

                if (!doc) {
                    res.status = 404;
                    res.json({
                        message: err
                    });
                } else {
                    if (doc.email != incomingToken.email) {
                        res.status = 401;
                        res.json({
                            message: 'unauthorized'
                        });
                    } else {
                        doc.remove(function(err, doc) {
                            if (err) {
                                res.status = 500;
                                res.json({
                                    message: err
                                });
                            } else {
                                res.status = 200;
                                res.json({
                                    message: 'removed user'
                                });
                            }
                        });
                    }
                }
            });
        } else {
            res.status = 401;
            res.json({
                message: 'unauthorized'
            });
        }
    });

    // Tokens
    /**
     * @api {post} /users/:id/authenticate Create Token for a User
     *
     * @apiName CreateUserToken
     * @apiGroup User
     *
     * @apiError (500) message error while generating token
     * @apiError (404) message no such user
     * @apiError (401) message unauthorized
     *
     * @apiSuccess (200) token the requested token
     *
     * @apiParam {String} email for the user
     */
    app.post('/api/v1/users/:userId/authenticate', passport.authenticate('local', {
        session: false
    }), function(req, res) {
        if (req.user) {
            User.findOne(req.user.email, function(err, doc) {
                if (err) {
                    res.status = 500;
                    res.json({
                        message: err
                    });
                }

                if (!doc) {
                    res.status = 404;
                    res.json({
                        message: "no such user"
                    });
                }

                doc.invalidateTokens();
                var token = doc.createToken();

                doc.save(function(err, doc) {
                    if (err) {
                        res.status = 500;
                        res.json({
                            message: err
                        });
                    }

                    res.status = 200;
                    res.json({
                        token: token
                    });
                });
            });
        } else {
            res.status = 401;
            res.json({
                message: "unauthorized"
            });
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
