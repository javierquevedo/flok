/**
 * Our Stream Controller
 *
 * @copyright  Nothing Interactive 2014
 */
'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');

// Handle get request
exports.get = function(req, res, next) {


    // TODO get messages from configured url...

    res.send([]);

    // Get all entries from current user
    Time.find({owner: user}).sort({startTime: 'desc'}).exec(function (err, times) {
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