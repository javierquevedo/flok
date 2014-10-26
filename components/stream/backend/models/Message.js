/**
 * MessageSchema
 *
 * Version 0.0.3
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

var types = 'trac'.split(' ');

var formats = 'html'.split(' ');

var MessageSchema = new Schema({
    timestamp: { type: Date, default: Date.now },
    provider: { type: String, enum: types, default: 'trac' } ,
    sourceId: String, // Hash of the item from source provider, to avoid duplicates
    link: String,
    title: String,
    message: {
        content: String,
        format: { type: String, enum: formats, default: 'html' }
    },
    author: {
        name: String
    },
    duration: Number
});

MessageSchema.methods.toJSON = function () {
    return _.pick(this,
        'timestamp',
        'provider',
        'link',
        'title',
        'message',
        'author',
        'duration'
    );
};

mongoose.model('Message', MessageSchema);
