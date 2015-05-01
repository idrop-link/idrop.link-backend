(function() {
    'use strict';

    var request = require('supertest'),
        express = require('express'),
        should = require('chai').should,
        expect = require('chai').expect,
        assert = require('chai').assert;

    var testUser = {
        email: 'test@example.com',
        password: 'foo'
    };

    var app = require('../').app;

    var token = null;
    var userId = null;
    var dropId = null;

    describe('Create User: POST /users', function() {
        it('should not create a user', function(done) {
            request(app)
                .post('/api/v1/users')
                .expect(400)
                .send({})
                .end(function(err, res) {
                    if (err) done(err);
                    else done(err);
                });
        });

        it('should not create a user', function(done) {
            request(app)
                .post('/api/v1/users')
                .expect(400)
                .send({
                    email: testUser.email
                })
                .end(function(err, res) {
                    if (err) done(err);
                    else done(err);
                });
        });

        it('should not create a user', function(done) {
            request(app)
                .post('/api/v1/users')
                .expect(400)
                .send({
                    password: testUser.password
                })
                .end(function(err, res) {
                    if (err) done(err);
                    else done(err);
                });
        });

        it('should create a user', function(done) {
            request(app)
                .post('/api/v1/users')
                .expect(201)
                .send(testUser)
                .end(function(err, res) {
                    if (err) done(err);
                    else {
                        userId = res.body._id;

						expect(userId).not.to.equal(null);
                        done();
                    }
                });
        });

        it('should have returned an _id', function() {
            expect(userId).to.be.a('string');
            expect(userId).to.have.length(24);
        });

        it('should have an existing user with this email', function(done) {
            request(app)
                .post('/api/v1/users')
                .expect(400)
                .send(testUser)
                .end(function(err, res) {
                    if (err) done(err);
					else done();
                });
        });
    });

    describe('GET /users/:email/idformail', function() {
        it('should return id', function(done) {
            request(app)
                .get('/api/v1/users/' + testUser.email + '/idformail')
                .expect(200)
                .send(testUser)
                .end(function(err, res) {
                    if (err) done(err);
                    else {
                        expect(res.body._id).not.to.equal(null);
                        done();
                    }
                });
        });
    });

    describe('POST /users/:id/authenticate', function() {
        it('should not find user', function(done) {
            request(app)
                .post('/api/v1/users/000000000000000000000000/authenticate')
                .expect(404)
                .send(testUser)
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it('should return BadRequest', function(done) {
            request(app)
                .post('/api/v1/users/' + userId + '/authenticate')
                .expect(400)
                .end(function(err, res) {
                    if (err) done(err);
                    done();
                });
        });

        it('should return BadRequest', function(done) {
            request(app)
                .post('/api/v1/users/' + userId + '/authenticate')
                .expect(400)
                .send({
                    email: 'foo@bar',
                    pasword: testUser.password
                })
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        // FIXME: add tests for incomplete requests
        it('should return token', function(done) {
            request(app)
                .post('/api/v1/users/' + userId + '/authenticate')
                .expect(201)
                .send(testUser)
                .end(function(err, res) {
                    if (err) done(err);
                    else {
                        var tok = res.body.token;

                        expect(tok).not.to.equal(null);
                        token = tok;

                        done();
                    }
                });
        });
    });
    /*
        describe('POST: /users/:id/deauthenticate', function() {
            it('should invalidate tokens', function(done) {
                request(app)
                    .post('/api/v1/users/' + userId + '/deauthenticate')
                    .expect(200)
                    .set('Authorization', token)
                    .end(function(err, res) {
                        if (err) done(err);
                        else done();
                    });
            });

            it('should reject authed request with invalid token', function(done) {
                request(app)
                    .get('/api/v1/users/' + userId)
                    .expect(401)
                    .set('Authorization', token)
                    .end(function(err, res) {
                        if (err) done(err);
                        else done();
                    });
            });

            it('should return token', function(done) {
                request(app)
                    .post('/api/v1/users/' + userId + '/authenticate')
                    .expect(200)
                    .send(testUser)
                    .end(function(err, res) {
                        if (err) done(err);
                        else {
                            var tok = res.body.token;

                            expect(tok).not.to.equal(null);
                            token = tok;

                            done();
                        }
                    });
            });
        });
    */
    // FIXME: get profiles of other users (email not matching)
    describe('GET /users/:id', function() {
        it('should return unauthorized warning', function(done) {
            request(app)
                .get('/api/v1/users/' + userId)
                .expect(401)
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it('should get the user profile', function(done) {
            request(app)
                .get('/api/v1/users/' + userId)
                .expect(200)
                .set('Authorization', token)
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });

    // TODO: PUT User

    // Drops
    describe('POST /users/:id/drops', function() {
		it('should return unauthorized warning', function(done) {
            request(app)
                .post('/api/v1/users/' + userId + '/drops/')
                .expect(401)
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it('should initialize drop', function(done) {
            request(app)
                .post('/api/v1/users/' + userId + '/drops')
                .expect(201)
                .set('Authorization', token)
                .end(function(err, res) {
                    if (err) done(err);
                    else {
                        dropId = res.body._id;
                        expect(dropId).not.to.equal(null);
                        done();
                    }
                });
        });
    });

    describe('POST /users/:id/drops(:id)', function() {
		it('should return unauthorized warning', function(done) {
            request(app)
                .post('/api/v1/users/' + userId + '/drops/' + dropId)
                .expect(401)
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

		it('should reject request without file', function(done) {
            request(app)
                .post('/api/v1/users/' + userId + '/drops/' + dropId)
                .set('Authorization', token)
                .expect(400)
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it('should upload file to drop', function(done) {
            request(app)
                .post('/api/v1/users/' + userId + '/drops/' + dropId)
                .set('Authorization', token)
				.attach('data', 'index.js')
                .expect(200)
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it('should reject already uploaded drop id', function(done) {
            request(app)
                .post('/api/v1/users/' + userId + '/drops/' + dropId)
                .set('Authorization', token)
				.attach('data', 'index.js')
                .expect(409)
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });

    describe('GET /users/:id/drops/:id', function() {
		it('should return unauthorized warning', function(done) {
            request(app)
                .get('/api/v1/users/' + userId + '/drops/' + dropId)
                .expect(401)
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it('should return drop', function(done) {
            request(app)
                .get('/api/v1/users/' + userId + '/drops/' + dropId)
                .set('Authorization', token)
                .expect(200)
                .end(function(err, res) {
                    if (err) done(err);
                    else {
                        expect(res.body._id).to.equal(dropId);
                        done();
                    }
                });
        });
    });

    describe('DELETE /users/:id/drops/:id', function() {
		it('should return unauthorized warning', function(done) {
            request(app)
                .delete('/api/v1/users/' + userId + '/drops/' + dropId)
                .expect(401)
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it('should delete drop', function(done) {
            request(app)
                .delete('/api/v1/users/' + userId + '/drops/' + dropId)
                .set('Authorization', token)
                .expect(200)
                .end(function(err) {
                    if (err) done(err);
                    else done();
                });
        });

        it('should not find deleted drop', function() {
            request(app)
                .get('/api/v1/users/' + userId + '/drops/' + dropId)
                .set('Authorization', token)
                .expect(404)
                .end(function(err) {
                    if (err) done(err);
                    else done();
                });
        });
    });

    describe('DELETE /users/:id', function() {
        it('should not delete user', function(done) {
            request(app)
                .delete('/api/v1/users/' + userId)
                .expect(401)
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it('should delete user', function(done) {
            request(app)
                .delete('/api/v1/users/' + userId)
                .expect(200)
                .set('Authorization', token)
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });
})();
