(function() {
    'use strict';

    var express = require('express'),
        app = module.exports = express(),
        users = require('./users');

    /**
     * @api {get} / API entry point of first api version
     * @apiName GetRootFirstVersion
     * @apiGroup APIv1
     *
     * @apiSuccess (200) 200 OK
     *
     * @apiSuccessExample {json} Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "_links":{
     *              "self":{
     *                  "href":"/api/v1"
     *              },
     *              "users":{
     *                  "href":"/api/v1/users"
     *               }
     *          }
     *      }
     */
    app.get('/api/v1/', function(req, res) {
        res.status = 200;
        res.send({
            '_links': {
                'self': {
                    'href': '/api/v1'
                },
                'users': {
                    'href': '/api/v1/users'
                }
            }
        });
    });

    app.use(users);
})();
