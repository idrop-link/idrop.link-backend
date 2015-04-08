(function() {
    'use strict';

    var request = require('supertest'),
        express = require('express'),
        assert = require('chai').assert;

    var testUser = {
        email: 'test@example.com',
        password: 'foo'
    };

    var app = require('../').app;

    describe('Create User: POST /users', function() {
        it('should create a user', function(done) {
            request(app)
                .post('/api/v1/users')
                .expect(201)
                .send(testUser)
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it('should have an existing user with this email', function(done) {
            request(app)
                .post('/api/v1/users')
                .expect(400)
                .send(testUser)
                .end(function(err, res) {
                    if (err) done(err);

                    if (res.name == 'ValidationError') {
                        done();
                    } else {
                        done(new Error('Two users with the same email are not supposed to exist!'));
                    }
                });
        });
    });
})();
