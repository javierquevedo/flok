/**
 * Helpers for testing e2e with mocha and superagent
 * based on vegaunaut test helpers
 * @copyright  Nothing Interactive 2014
 * @author     Patrick Fiaux <nodz@nothing.ch>
 */
'use strict';
/* global describe, after, before */
var _ = require('lodash');


// Get the app
var mongoose = require('mongoose');
var app = require('../../app');
var config = require('../../backend/Config');
var port = 3000;
// Get the backend url from config
exports.baseURL = config.backendUrl;

// SuperAgent
var request = require('superagent');

/**
 * Wrapper around superagent's request, that adds authorization headers.
 * Params can be:
 * request('GET', '/users').end(callback)
 * request('/users').end(callback)
 * request('/users', callback)
 * @param {string} [method]
 * @param {string} url
 * @returns {*}
 */
exports.request = function(method, url) {
    // callback
    var callback;
    if ('function' === typeof url) {
        callback = url;
        url = method;
        method = 'GET';
    }
    // URL only
    if (1 === arguments.length) {
        url = method;
        method = 'GET';
    }
    // TODO is this needed?
    // Here, the actual defaults are set
    var r = request(method, url)
        .set('Authorization', 'VeganautBearer ' + exports.sessionId);
    if (callback) {
        return r.end(callback);
    }
    else {
        return r;
    }
};

/**
 * describe is our wrapper around jasmine/mocha's describe. It runs a server, sets up fixtures, etc.
 * @param {string} what The item that's being described
 * @param {object} options An optional hash that can be used to choose the fixtures, the logged-in user, etc.
 * @param {function} how A function that contains the description
 */
exports.describe = function(what, options, how) {
    // TODO: should have a way for the caller to be able to access the fixtures (to retrieve ids and such)
    if (typeof(how) === 'undefined') {
        how = options;
        options = {};
    }

    // Add default options
    // TODO options are unused
    _.defaults(options, {
        fixtures: 'basic',
        user: 'foo@bar.baz'
    });

    var wrapper = function() {
        // Start a server and initialize fixtures
        var server;
        before(function(done) {
            mongoose.connect(config.db, function(err) {
                if (err) {
                    console.log(err);
                }
                server = app.listen(port, function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
                // Could setup fixtures here if needed
                done();
            });
        });
        // Run the user-provided tests
        how();
        // Tear down the server
        after(function(done) {
            server.close(function(err) {
                if (err) {
                    console.log(err);
                }
                mongoose.disconnect(function(err) {
                    if (err) {
                        console.log(err);
                    }
                    done();
                });
            });
        });
    };
    describe(what, wrapper);
};
