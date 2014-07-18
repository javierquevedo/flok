/**
 * TimeSchema
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

var TimeSchema = new Schema({
    name: String,
    startTime: Date,
    endTime: Date,
    pastDuration: Number,
    totalManualChange: Number,
    completed: Boolean,
    owner: String
});

TimeSchema.methods.toJSON = function () {
    return _.pick(this,
        'name',
        'startTime',
        'endTime',
        'pastDuration',
        'totalManualChange',
        'completed',
        'owner'
    );
};

mongoose.model('Time', TimeSchema);
