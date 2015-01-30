/**
 * Session Storage for express / passport
 * Inspired by:
 * https://github.com/dreyacosta/mongoose-store/blob/master/lib/mongoose-store.coffee
 * https://github.com/expressjs/session#session-store-implementation
 * @copyright  Nothing Interactive 2015
 * @author     Patrick Fiaux <nodz@nothing.ch>
 */
'use strict';

var mongoose = require('mongoose');
var session = require('express-session');
var util = require('util');

// TODO does the ttl really need to be passed in this way?
var SessionStoreModel = require('../models/SessionStoreModel')(60000);

/**
 * Initialize `SessionStore`.
 * Required options:
 * - url : mongo db connection url
 * @param options
 * @constructor
 */
var SessionStore = module.exports = function SessionStore(options) {
    this.options = options !== null ? options : {};
    if (mongoose.connection.readyState === 0) {
        mongoose.connect(this.options.url);
    }
};

/**
 * Inherit from `session.Store.prototype` and thus `EventEmitter.prototype`.
 */
util.inherits(SessionStore, session.Store);

/**
 * Implements the required .get(sid, callback) for Session Store
 * @param sid
 * @param callback
 * @returns {*|Query}
 */
SessionStore.prototype.get = function(sid, callback) {
    var query;
    query = {
        sid: sid
    };
    return SessionStoreModel.findOne(query, (function(_this) {
        return function(err, data) {
            var cookie;
            if (err || !data) {
                return callback(err);
            }
            cookie = data.session.cookie;
            if ((cookie.expires !== null) && new Date() > cookie.expires) {
                return _this.destroy(data.sid, callback);
            }
            return callback(null, data.session);
        };
    })(this));
};

/**
 * Implements the required .set(sid, session, callback) for Session Store
 *
 * @param sid
 * @param session
 * @param callback
 * @returns {*}
 */
SessionStore.prototype.set = function(sid, session, callback) {
    var cookie, data;
    if (!session) {
        this.destroy(sid, callback);
    }
    data = {
        sid: sid,
        session: session
    };
    if (cookie = session.cookie) {
        if (cookie._expires) {
            data.expires = cookie._expires;
        }
        if (cookie.expires) {
            data.expires = cookie.expires;
        }
    }
    if (this.options.ttl) {
        data.createdAt = new Date();
    }
    return SessionStoreModel.update({
        sid: sid
    }, data, {
        upsert: true
    }, callback);
};

/**
 * Implements the required .destroy(sid, callback) for Session Store
 * @param sid
 * @param callback
 * @returns {*}
 */
SessionStore.prototype.destroy = function(sid, callback) {
    return SessionStoreModel.remove({
        sid: sid
    }).exec(callback);
};

/*
 * TODO implement optional session store calls:
 * https://github.com/expressjs/session#session-store-implementation
 * Recommended methods include, but are not limited to:
 *  .touch(sid, session, callback)
 *  .length(callback)
 *  .clear(callback)
 */
