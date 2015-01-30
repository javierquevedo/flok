/**
 * Session Storage Model for express / passport
 * Inspired by:
 * https://github.com/dreyacosta/mongoose-store/blob/master/lib/model-session.coffee
 * @copyright  Nothing Interactive 2015
 * @author     Patrick Fiaux <nodz@nothing.ch>
 */
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(ttl) {
    var sessionStoreSchema;
    sessionStoreSchema = new Schema({
        sid: String,
        session: {},
        expires: {
            type: Date,
            index: true
        },
        createdAt: {
            type: Date,
            expires: ttl
        }
    });
    return mongoose.model('SessionStore', sessionStoreSchema);
};
