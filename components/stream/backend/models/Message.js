/**
 * MessageSchema
 *
 * Version 0.0.2
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

var types = 'plain'.split(' ');

var MessageSchema = new Schema({
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: types, default: 'plain' } ,
    title: String,
    message: {
        content: String,
        format: String
    },
    author: {
        name: String
    },
    duration: Number
});

MessageSchema.methods.toJSON = function () {
    return _.pick(this,
        'timestamp',
        'type',
        'title',
        'message',
        'author',
        'duration'
    );
};

mongoose.model('Message', MessageSchema);
