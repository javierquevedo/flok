/**
 * Access controller: Handles creation and deletion of sessions
 * as well as checking access restrictions to all requests.
 *
 * @copyright  Nothing Interactive 2014
 * @author     Tobias Leugger <vibes@nothing.ch>
 */
'use strict';

var util = require('util');
var passport = require('passport');

/**
 * Middleware that returns a 401 access denied if the request is not authorised.
 * A request can be allowed if either the URL is public, there is a valid user
 * session or an API key was provided that has access to the given URL.
 *
 * @param {{}} [publicUrls={}] Map of URLs to list of methods that are public
 * @param {{}} [apiKeys={}] Map of API keys to map of URLs to list of allowed methods
 *      for that key and url.
 * @returns {Function}
 */
exports.restrict = function(publicUrls, apiKeys) {
    publicUrls = publicUrls || {};
    apiKeys = apiKeys || {};
    return function restrict(req, res, next) {
        // Get the URL of the request and remove trailing slash
        var url = req.url;
        var method = req.method;
        if (url[url.length - 1] === '/') {
            url = url.substr(0, url.length - 1);
        }

        // By default assume the request is not allowed
        var authorised = false;

        if (typeof req.user !== 'undefined') {
            // There is a valid logged in user
            authorised = true;
        }
        else if (util.isArray(publicUrls[url]) && publicUrls[url].indexOf(method) >= 0) {
            // The URL and method is public, everyone has access
            authorised = true;
        }
        else {
            // Check if an API key was provided in the Authorization header
            var authHeader = req.get('Authorization');
            if (authHeader) {
                // The auth header should be of the form 'FlokApiKey {actualKeyHere}'
                var parts = authHeader.split(' ');

                // Verify the identifier and the key
                if (parts.length === 2 &&
                    parts[0] === 'FlokApiKey' &&
                    typeof apiKeys[parts[1]] !== 'undefined')
                {
                    // Check which methods are allowed for that URL for that key
                    var allowedMethods = apiKeys[parts[1]][url];
                    if (util.isArray(allowedMethods) && allowedMethods.indexOf(method) >= 0) {
                        authorised = true;
                    }
                }
            }
        }

        // If we're not authorised, send a 401
        if (!authorised) {
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
