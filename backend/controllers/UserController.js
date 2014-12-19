/**
 * User controller
 *
 * @copyright  Nothing Interactive 2014
 * @author     Tobias Leugger <vibes@nothing.ch>
 */
'use strict';

var _ = require('lodash');
var async = require('async');
var User = require('../models/UserModel');

/**
 * Registers a new user with the email (username) and password
 * taken from the request body.
 * @param req
 * @param res
 * @param next
 */
exports.register = function(req, res, next) {
    // Pick the posted data
    var userData = _.pick(req.body, 'email');
    var password = req.body.password;

    var user = new User(userData);
    async.series([
        function(cb) {
            user.setPassword(password, cb);
        },
        user.save.bind(user)
    ], function(err) {
        if (err) {
            // Send a 400 status if the email address is already used
            if (err.name === 'MongoError' && err.code === 11000) {
                res.status(400);
            }
            return next(err);
        }

        return res.status(201).send(user);
    });
};
