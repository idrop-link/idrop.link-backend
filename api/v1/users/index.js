(function() {
    'use strict';

    var express = require('express'),
        app = module.exports = express(),
        passport = require('passport'),
        path = require('path');

    var User = require(path.join(__dirname, '../../..', '/models/user'));

    // User
    /**
     * @api {post} /users Create User
     *
     * @apiName CreateUser
     * @apiGroup User
     *
     * @apiSuccess (201) {String} success contains the success description
     *
     * @apiError (400) {String} message contains the error description
     *
     * @apiParam {String} email unique email address
     * @apiParam {String} password the users password
     */
    app.post('/api/v1/users/', function(req, res) {
        if (req.body.email === undefined && req.body.password === undefined) {
            return res
                .status(400)
                .json({
                    message: 'missing parameters'
                });
        }

        User.register(new User({
            email: req.body.email,
            password: req.body.password
        }), req.body.password, function(err, doc) {
            if (err) {
                return res
                    .status(400)
                    .json(err);
            } else {
                return res
                    .status(201)
                    .json({
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
	 * @apiError (400) {String} message bad request (missing token probably)
     */
    app.get('/api/v1/users/:userId', function(req, res) {
		if (!req.headers.authorization) {
			return res
				.status(401)
				.json({
					message: 'token missing'
				});
		}

        // validate token
        var incomingToken = User.decodeJwt(req.headers.authorization);

        if (incomingToken && incomingToken.email) {
            User.findById(req.params.userId, function(err, doc) {
                if (err) {
                    return res
                        .status(500)
                        .json(err);
                }

                if (!doc) {
                    return res
                        .status(404)
                        .json({
                            message: 'no such user'
                        });
                } else {
                    if (doc.email !== incomingToken.email) {
                        return res
                            .status(401)
                            .json({
                                message: 'unauthorized'
                            });
                    } else {
                        return res
                            .status(200)
                            .json({
                                _id: doc._id,
                                email: doc.email,
                                creation_date: doc.creation_date
                            });
                    }
                }
            });
        } else {
            return res
                .status(400)
                .json({
                    message: 'bad request'
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
                    return res
                        .status(500)
                        .json(err);
                }

                if (!doc) {
                    return res
                        .status(404)
                        .json({
                            message: err
                        });
                } else {
                    if (doc.email != incomingToken.email) {
                        return res
                            .status(401)
                            .json({
                                message: 'unauthorized'
                            });
                    } else {
                        doc.remove(function(err, doc) {
                            if (err) {
                                return res
                                    .status(500)
                                    .json(err);
                            } else {
                                return res
                                    .status(200)
                                    .json({
                                        message: 'removed user'
                                    });
                            }
                        });
                    }
                }
            });
        } else {
            return res
                .status(401)
                .json({
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
	 * @apiError (400) message bad request
     *
     * @apiSuccess (200) token the requested token
     *
     * @apiParam {String} email for the user
     * @apiParam {String} email unique email address
     */
    app.post('/api/v1/users/:userId/authenticate', passport.authenticate('local', {
        session: false
    }), function(req, res) {
        if (req.user) {
            User.findById(req.params.userId, function(err, doc) {
                if (err) {
                    return res
                        .status(500)
                        .json({
                            message: err
                        });
                }

                if (doc === null) {
                    return res
                        .status(404)
                        .json({
                            message: 'no such user'
                        });
                }

                if (doc.email != req.body.email) {
                    return res
                        .status(401)
                        .json({
                            message: 'unauthorized'
                        });
                }

                doc.invalidateTokens();
                var token = doc.createToken();

                doc.save(function(err, doc) {
                    if (err) {
                        return res
                            .status(500)
                            .json({
                                message: err
                            });
                    }

                    return res
                        .status(200)
                        .json({
                            token: token
                        });
                    });
            });
        } else {
            return res
                .status(400)
                .json({
                    message: 'bad request'
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
