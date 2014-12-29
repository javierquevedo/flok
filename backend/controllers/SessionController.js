/**
 * Session controller
 *
 * @copyright  Nothing Interactive 2014
 * @author     Tobias Leugger <vibes@nothing.ch>
 */
'use strict';

var passport = require('passport');

/**
 * Middleware that returns a 401 access denied for all URLs
 * except the given ones if there is no logged in user.
 * @param {string[]} publicUrls
 * @returns {Function}
 */
exports.restrict = function(publicUrls) {
    return function restrict(req, res, next) {
        // TODO: also allow URLs with / at the end?
        if (publicUrls.indexOf(req.url) === -1 &&
            typeof req.user === 'undefined')
        {
            return res.status(401).send({
                error: 'Access denied!'
            });
        }
        next();
    };
};

/**
 * Login: Authenticates the user and creates a session if successful
 * @param req
 * @param res
 * @param next
 */
exports.createSession = function(req, res, next) {
    // Authenticate the user
    passport.authenticate('local', function(err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            // No user -> wrong credentials
            res.status(400);
            return next(new Error('Wrong credentials'));
        }

        // Login (= create session)
        req.login(user, function(err) {
            if (err) {
                return next(err);
            }
            // TODO: what to return?
            return res.send({});
        });
    })(req, res, next);
};

/**
 * Logout: deletes an active session
 * @param req
 * @param res
 * @returns {*}
 */
exports.deleteSession = function(req, res) {
    req.logout();
    // TODO: what to return?
    return res.send({});
};
