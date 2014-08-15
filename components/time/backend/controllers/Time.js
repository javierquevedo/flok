/**
 * Our Time Controller
 */
'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');

require('../models/Time');
var Time = mongoose.model('Time');

// Handle get request
exports.get = function(req, res, next) {
    var user =  req.params.user;

    // Get all entries from current user
    Time.find({owner: user}, function (err, times) {
        if (err) {
            return next(err);
        }

        var formattedTimes = _.map(times, function(time) {
            return time.toJSON();
        });

        // Send the formatted time of this user
        res.send(formattedTimes);
    });

};

// Handle put requests
exports.put = function(req, res, next) {
    var user =  req.params.user;
    var submittedData = req.body;

    // Executed when all updates have been made
    var done = _.after(submittedData.length, function() {
        res.send({status: 'OK'});
    });

    // Remove all existing times of this user
    Time.remove({owner: user}, function (err) {
        if (err) {
            return next(err);
        }

        // Iterate over all the time data and save it
        _.each(submittedData, function(timeData) {
            // Create a Time object
            var time = new Time();

            // Pick the right data from the request
            timeData = _.pick(timeData,
                'name',
                'startTime',
                'endTime',
                'pastDuration',
                'totalManualChange',
                'completed'
            );

            // Add the provided user as owner
            timeData.owner = user;

            // Write it to the Time object
            _.assign(time, timeData);

            // Save it
            time.save(function(err) {
                if (err) {
                    return next(err);
                }
                done();
            });
        });
    });
};
