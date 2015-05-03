(function() {
    'use strict';

    var express = require('express'),
        app = module.exports = express(),
        passport = require('passport'),
        path = require('path'),
        fs = require('fs');

    var STATIC_DATA_PATH = path.join('/static_data'),
        STATIC_DATA_PATH_ABS = path.join(__dirname, '../../..', STATIC_DATA_PATH),
        TEMP_UPLOAD_PATH = path.join(__dirname, '../../..', '/uploads');

    var User = require(path.join(__dirname, '../../..', '/models/user')),
        Drop = require(path.join(__dirname, '../../..', '/models/drop')).Drop;

    if (!fs.existsSync(STATIC_DATA_PATH_ABS))
        fs.mkdirSync(STATIC_DATA_PATH_ABS);

    if (!fs.existsSync(TEMP_UPLOAD_PATH))
        fs.mkdirSync(TEMP_UPLOAD_PATH);

    // Reusable apidoc errors
    // CLIENT ERRORS
    /**
     * @apiDefine BadRequestError
     * @apiError (400) Bad Request Error: Either malformed or missing
     *				   parameters
     */
    var badRequestMessage = 'Bad Request Error: Either malformed or missing ';
    badRequestMessage += 'parameters';

    /**
     * @apiDefine TokenError
     * @apiError (401) Authorization Token Error: Missing, invalid or
     *				   expired token passed
     */
    var tokenErrorMessage = 'Authorization Token Error: Missing, invalid or ';
    tokenErrorMessage += 'expired token passed';

    /**
     * @apiDefine UnauthorizedError
     * @apiError (401) Unauthorized: You are not authorized to access this
     *                 resource
     */
    var unauthorizedErrorMessage = 'Unauthorized: You are not authorized ';
    unauthorizedErrorMessage += 'to access this resource';

    /**
     * @apiDefine UserNotFoundError
     * @apiError (404) User Not Found
     */
    var userNotFoundErrorMessage = 'User Not Found';

    /**
     * @apiDefine DropNotFoundError
     * @apiError (404) Drop Not Found
     */
    var dropNotFoundErrorMessage = 'Drop Not Found';

    // SERVER ERRORS
    /**
     * @apiDefine InternalServerError
     * @apiError (500) Internal Server Error
     */
    var internalServerErrorMessage = 'Interal Server Error';

    /*
     * When using this function, use the following apidoc calls:
     *
     * @apiParam {String} Token The authorization token
     *
     * @apiUse TokenError
     * @apiUse UnauthorizedError
     * @apiUse InternalServerError
     * @apiUse UserNotFoundError
     * @apiUse BadRequestError
     */
    function executeOnAuthenticatedRequest(req, res, callback) {
        if (!req.headers.authorization) {
            return res
                .status(401)
                .json({
                    message: tokenErrorMessage
                });
        }

        // validate token
        var incomingToken = User.decodeJwt(req.headers.authorization);

        if (incomingToken && incomingToken.email) {
            User.findById(req.params.userId, function(err, doc) {
                if (err) {
                    console.log(err);
                    return res
                        .status(500)
                        .json({
                            message: internalServerErrorMessage
                        });
                }

                if (!doc) {
                    return res
                        .status(404)
                        .json({
                            message: userNotFoundErrorMessage
                        });
                } else {
                    if (doc.email !== incomingToken.email) {
                        return res
                            .status(401)
                            .json({
                                message: unauthorizedErrorMessage
                            });
                    } else {
                        if (doc.validateToken(req.headers.authorization)) {
                            // start actual execution
                            callback(doc);
                        } else {
                            // token expired or is invalid
                            return res
                                .status(401)
                                .json({
                                    message: tokenErrorMessage
                                });
                        }
                    }
                }
            });
        } else {
            return res
                .status(400)
                .json({
                    message: badRequestMessage
                });
        }
    }

    // User
    /**
     * @api {post} /users Create User
     *
     * @apiName CreateUser
     * @apiGroup User
     *
     * @apiSuccess (201) {String} _id the users id
     *
     * @apiParam {String} email unique email address
     * @apiParam {String} password the users password
	 *
	 * @apiError (400) email already in use
     *
     * @apiUse BadRequestError
     * @apiUse InternalServerError
     */
    app.post('/api/v1/users/', function(req, res) {
        if (req.body.email === undefined || req.body.password === undefined) {
            return res
                .status(400)
                .json({
                    message: badRequestMessage
                });
        }

        User.findOne({
            email: req.body.email
        }, function(err, doc) {
            if (doc) {
                return res
                    .status(400)
                    .json({
                        message: 'email already in use'
                    });
            } else {
                User.register(new User({
                    email: req.body.email,
                    password: req.body.password
                }), req.body.password, function(err, doc) {
                    if (err) {
                        console.error(err);
                        return res
                            .status(500)
                            .json(internalServerErrorMessage);
                    } else {
                        return res
                            .status(201)
                            .json({
                                message: 'registered user',
                                _id: doc._id
                            });
                    }
                });
            }
        });
    });

    /**
     * @api {put} /users/:id Update User
     *
     * @apiName UpdateUser
     * @apiGroup User
     *
     * @apiParam {String} Token The authorization token
     *
     * @apiSuccess (200) {String} message successfully updated user'
     *
     * @apiUse TokenError
     * @apiUse UnauthorizedError
     * @apiUse InternalServerError
     * @apiUse UserNotFoundError
     * @apiUse BadRequestError
     */
    app.put('/api/v1/users/:userId', function(req, res) {
        // TODO
        executeOnAuthenticatedRequest(req, res, function(doc) {
            doc.update(req.body, function(err, doc) {
                if (err) {
                    console.error(err);
                    return res
                        .status(500)
                        .json({
                            message: internalServerErrorMessage
                        });
                }

                return res
                    .status(200)
                    .json({
                        message: 'successfully updated user'
                    });
            });
        });
    });

    /**
     * @api {get} /users/:id Lookup User
     *
     * @apiName GetUser
     * @apiGroup User
     *
     * @apiParam {String} Token The authorization token
     *
     * @apiSuccess (200) {String} _id id of the user
     * @apiSuccess (200) {String} email of the user
     * @apiSuccess (200) {String} creation_date when the user was created
     *
     * @apiUse TokenError
     * @apiUse UnauthorizedError
     * @apiUse InternalServerError
     * @apiUse UserNotFoundError
     * @apiUse BadRequestError
     */
    app.get('/api/v1/users/:userId', function(req, res) {
        executeOnAuthenticatedRequest(req, res, function(doc) {
            return res
                .status(200)
                .json({
                    _id: doc._id,
                    email: doc.email,
                    creation_date: doc.creation_date
                });
        });
    });

    /**
     * @api {delete} /users/:id Delete User
     *
     * @apiName DeleteUser
     * @apiGroup User
     *
     * @apiParam {String} Token The authorization token
     *
     * @apiSuccess (200) {String} message removed user
     *
     * @apiUse TokenError
     * @apiUse UnauthorizedError
     * @apiUse InternalServerError
     * @apiUse UserNotFoundError
     * @apiUse BadRequestError
     */
    app.delete('/api/v1/users/:userId', function(req, res) {
        executeOnAuthenticatedRequest(req, res, function(doc) {
            doc.remove(function(err, doc) {
                if (err) {
                    console.error(err);
                    return res
                        .status(500)
                        .json(internalServerErrorMessage);
                } else {
                    return res
                        .status(200)
                        .json({
                            message: 'removed user'
                        });
                }
            });
        });
    });

    /**
     * @api {get} /users/:email/idformail Get User ID by email
     *
     * @apiName GetUserMailByID
     * @apiGroup User
     *
     * @apiSuccess (201) {String} _id the users id
     *
     * @apiParam {String} email unique email address
     * @apiParam {String} password the users password
     *
     * @apiUse UserNotFoundError
     * @apiUse BadRequestError
     * @apiUse InternalServerError
     */
    app.get('/api/v1/users/:email/idformail', passport.authenticate('local', {
        session: false
    }), function(req, res) {
        if (req.user) {
            User.findOne({
                email: req.params.email
            }, function(err, doc) {
                if (err) {
                    console.error(err);
                    return res
                        .status(500)
                        .json({
                            message: internalServerErrorMessage
                        });
                }

                if (doc === null) {
                    return res
                        .status(404)
                        .json({
                            message: userNotFoundErrorMessage
                        });
                }

                return res
                    .status(200)
                    .json({
                        _id: doc._id
                    });
            });
        } else {
            return res
                .status(400)
                .json({
                    message: badRequestMessage
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
     * @apiParam {String} email unique email address
     * @apiParam {String} password the users password
     *
     * @apiUse InternalServerError
     * @apiUse UserNotFoundError
     * @apiUse UnauthorizedError
     * @apiUse BadRequestError
     */
    app.post('/api/v1/users/:userId/authenticate', passport.authenticate('local', {
        session: false
    }), function(req, res) {
        if (req.user) {
            User.findById(req.params.userId, function(err, doc) {
                if (err) {
                    console.error(err);
                    return res
                        .status(500)
                        .json({
                            message: internalServerErrorMessage
                        });
                }

                if (doc === null) {
                    return res
                        .status(404)
                        .json({
                            message: userNotFoundErrorMessage
                        });
                }

                if (doc.email != req.body.email) {
                    return res
                        .status(401)
                        .json({
                            message: unauthorizedErrorMessage
                        });
                }

                doc.invalidateTokens();
                var token = doc.createToken();

                doc.save(function(err, doc) {
                    if (err) {
                        console.log(err);
                        return res
                            .status(500)
                            .json({
                                message: internalServerErrorMessage
                            });
                    }

                    return res
                        .status(201)
                        .json({
                            token: token
                        });
                });
            });
        } else {
            return res
                .status(400)
                .json({
                    message: badRequestMessage
                });
        }
    });

    /**
     * @api {post} /users/:id/deauthenticate Log out
     *
     * @apiName DeauthenticateUser
     * @apiGroup User
     *
     * @apiParam {String} Token The authorization token
     *
     * @apiSuccess (200) message success
     *
     * @apiUse TokenError
     * @apiUse UnauthorizedError
     * @apiUse InternalServerError
     * @apiUse UserNotFoundError
     * @apiUse BadRequestError
     */
    app.post('/api/v1/users/:userId/deauthenticate', function(req, res) {
        executeOnAuthenticatedRequest(req, res, function(doc) {
            // TODO: deauthentication

            doc.save(function(err, doc) {
                if (err) {
                    console.error(err);
                    return res
                        .status(500)
                        .json({
                            message: internalServerErrorMessage
                        });
                }

                return res
                    .status(200)
                    .json({
                        message: 'success'
                    });
            });
        });
    });

    // Drops
    /**
     * List drops of a User
     */
    app.get('/api/v1/users/:userId/drops', function(req, res) {
        // TODO
    });

    /**
     * @api {get} /users/:id/drops/:id Get details for a drop of a User
     *
     * @apiName GetDrop
     * @apiGroup Drop
     *
     * @apiParam {String} Token The authorization token
     *
     * @apiSuccess (200) _id the drop id
     * @apiSuccess (200) name the original file name
     * @apiSuccess (200) url the file url
     *
     * @apiUse TokenError
     * @apiUse UnauthorizedError
     * @apiUse InternalServerError
     * @apiUse UserNotFoundError
     * @apiUse BadRequestError
     * @apiUse DropNotFoundError
     */
    app.get('/api/v1/users/:userId/drops/:dropId', function(req, res) {
        executeOnAuthenticatedRequest(req, res, function(doc) {
            var drop = doc.drops.id(req.params.dropId);

            if (!drop) {
                return res
                    .status(404)
                    .json({
                        message: dropNotFoundErrorMessage
                    });
            }

            return res
                .status(200)
                .json({
                    _id: drop._id,
                    name: drop.name,
                    url: drop.url
                });
        });
    });

    /**
     *  @api {post} /users/:userId/drops' Initialize drop transaction
     *
     * @apiName InitializeDrop
     * @apiGroup Drop
     * @apiDescription First step of drop upload: register coming drop and receive
     *                 eventual URL for the drop to be accessed.
     *
     * @apiParam {String} Token The authorization token
     *
     * @apiSuccess (200) _id the drop id
     * @apiSuccess (200) name the original file name
     * @apiSuccess (200) url the file url
     *
     * @apiUse TokenError
     * @apiUse UnauthorizedError
     * @apiUse InternalServerError
     * @apiUse UserNotFoundError
     * @apiUse BadRequestError
     */
    app.post('/api/v1/users/:userId/drops', function(req, res) {
        executeOnAuthenticatedRequest(req, res, function(doc) {
            var drop = doc.drops.create({});
            doc.drops.push(drop);

            drop.url = 'http://idrop.link/d/' + drop.shortId;

            doc.save(function(err) {
                if (err) {
                    console.error(err);
                    return res
                        .status(500)
                        .json({
                            message: internalServerErrorMessage
                        });
                } else {
                    return res
                        .status(201)
                        .json({
                            _id: drop._id,
                            url: drop.url,
                            name: drop.name
                        });
                }
            });
        });
    });

    /**
     * @api {post} /users/:id/drops/:id Upload file to initialized drop
     *
     * @apiGroup Drop
     * @apiName UploadDrop
     * @apiDescription Eventual upload of the drop. See
     *                 InitializeDrop for the first step.
     *
     * @apiParam {String} Token The authorization token
     * @apiParam {File} data the file to be uploaded
     *
     * @apiSuccess (200) message success
     *
     * @apiError (400) Uninitialized drop
     * @apiError (409) Conflict: Drop already uploaded
     *
     * @apiUse BadRequestError
     * @apiUse InternalServerError
     * @apiUse TokenError
     * @apiUse UnauthorizedError
     * @apiUse UserNotFoundError
     * @apiUse DropNotFoundError
     */
    app.post('/api/v1/users/:userId/drops/:dropId', function(req, res) {
        executeOnAuthenticatedRequest(req, res, function(doc) {
            var drop = doc.drops.id(req.params.dropId);

            // the drop needs to be registered first
            if (!drop) {
                return res
                    .status(400)
                    .json({
                        message: 'Uninitialized drop'
                    });
            }

            // the drop was sent with wrong field name or none at all
            if (!req.files.data || !req.files.data.path) {
                return res
                    .status(400)
                    .json({
                        message: badRequestMessage
                    });
            }

            if (drop.name !== undefined) {
                return res
                    .status(409)
                    .json({
                        message: 'Conflict: Drop already uploaded'
                    });
            }

            // move drop to final destination
            var fileEnding = req.files.data.name.split('.').pop(),
                fileName = req.files.data.path.split('/').pop();

            console.log(fileName);

            var targetDir = path.join(STATIC_DATA_PATH, '/' + doc._id),
                targetDirAbs = path.join(STATIC_DATA_PATH_ABS, '/' + doc._id),
                targetPath = path.join(targetDir, '/' + fileName),
                targetPathAbs = path.join(targetDirAbs, '/' + fileName),
                tempPath = path.join(__dirname, '../../..', req.files.data.path);

            console.log(targetDirAbs);
            console.log(targetPathAbs);

            if (!fs.existsSync(targetDirAbs))
                fs.mkdirSync(targetDirAbs);

            // set file name
            drop.name = req.files.data.originalname;
            drop.path = targetPath;
            drop.type = fileEnding;

            // move file to destination
            fs.rename(tempPath, targetPathAbs, function(err) {
                if (err) {
                    console.error(err);
                    return res
                        .status(500)
                        .json({
                            message: internalServerErrorMessage
                        });
                }

                doc.save(function(err, doc) {
                    if (err) {
                        console.error(err);
                        return res
                            .status(500)
                            .json({
                                message: internalServerErrorMessage
                            });
                    }

                    return res
                        .status(200)
                        .json({
                            message: 'success'
                        });
                });
            });
        });
    });

    /**
     * @api {delete} /users/:id/drops/:id Delete drop of a User
     *
     * @apiName DeleteDrop
     * @apiGroup Drop
     * @apiDescription Delete the drop
     *
     * @apiParam {String} Token The authorization token
     *
     * @apiSuccess (200) {String} message success
     *
     * @apiUse BadRequestError
     * @apiUse InternalServerError
     * @apiUse TokenError
     * @apiUse UnauthorizedError
     * @apiUse UserNotFoundError
     */
    app.delete('/api/v1/users/:userId/drops/:dropId', function(req, res) {
        executeOnAuthenticatedRequest(req, res, function(doc) {
            var drop = doc.drops.id(req.params.dropId);

            if (!drop) {
                return res
                    .status(404)
                    .json({
                        message: dropNotFoundErrorMessage
                    });
            }

            // delete the physical file and then the mongodb document
            fs.unlink(drop.path, function(err) {
                if (err) {
                    console.error('Unable to delete file: ' + drop.path + '\n');
                }

                drop.remove();

                doc.save(function(err) {
                    if (err) {
                        console.error(err);
                        return res
                            .status(500)
                            .json({
                                message: internalServerErrorMessage
                            });
                    } else {
                        return res
                            .status(200)
                            .json({
                                message: 'success'
                            });
                    }
                });
            });
        });
    });
})();
