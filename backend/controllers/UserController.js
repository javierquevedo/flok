/**
 * User controller
 *
 * @copyright  Nothing Interactive 2014
 * @author     Tobias Leugger <vibes@nothing.ch>
 */
'use strict';

var _ = require('lodash');
var User = require('../models/UserModel');

exports.register = function(req, res, next) {
    // Pick the posted data
    var userData = _.pick(req.body, 'email', 'password');
    var user = new User(userData);

    // Make sure a password is specified. E-Mail is validated by the model, password not,
    // because we will support other auth methods than password
    if (!user.password) {
        return next(new Error('Missing password to register new user.'));
    }

    user.save(function(err) {
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
