(function() {
    'use strict';

    var express = require('express'),
        app = module.exports = express(),
        tokens = require('./tokens'),
        drops = require('./drops');

    // User
    /**
     * Create User
     */
    app.post('/api/v1/users/', function(req, res) {
        // TODO
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
     * Authenticate User
     */
    app.post('/api/v1/users/userId/authenticate', function(req, res) {
        // TODO
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
