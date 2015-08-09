/**
 * EventSchema
 *
 * Version 0.0.3
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

// TODO event types shouldn't be hardcoded here. There should be defaults and config ones
var types = 'inside twitter'.split(' ');

var formats = 'html'.split(' ');

var EventSchema = new Schema({
    timestamp: { type: Date, default: Date.now },
    provider: { type: String, enum: types },
    sourceId: String, // Hash of the item from source provider, to avoid duplicates
    link: String,
    title: String,
    message: {
        content: String,
        format: { type: String, enum: formats }
    },
    author: {
        name: String
    },
    duration: Number,
    sticky: Boolean // Determines if an event is sticky
});


EventSchema.methods.toJSON = function () {
    // Pick the simple properties
    var json = _.pick(this,
        'timestamp',
        'provider',
        'link',
        'title',
        'duration',
        'sticky'
    );

    // Explicitly add the nested objects, otherwise they are not correctly converted to json
    json.author = _.pick(this.author, 'name');
    json.message = _.pick(this.message, 'content', 'format');
    return json;
};

mongoose.model('Event', EventSchema);
