/**
 * Our Stream Controller
 *
 * @copyright  Nothing Interactive 2014
 */
'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');

require('../models/Event');

var Event = mongoose.model('Event');

// Handle get request
exports.get = function(req, res, next) {

    // Load the latest 20 events
    Event.find(
        {}, // No conditions
        null, // All fields
        {
            limit: 20,
            sort:{timestamp: -1} // Sort timestamp by desc
        },
        function(err, events) {
            if (err) {
                return next(err);
            }

            var stream = _.toArray(events);

            // Then send the stream
            res.send(stream);
        }
    );
};

// Handle post request
exports.post = function(req, res, next) {
    // Validate request
    var submittedData = req.body;

    // If we don't have the right version or the stream isn't an array
    // TODO we should probably check by semver here
    // also version could be coming from config rather than hardcoded.
    if (submittedData.version !== '0.0.3') {
        next(new Error('Unsupported format version: ' + submittedData.version));
    }
    else if (!_.isArray(submittedData.events)) {
        next(new Error('events is not an array'));
    }

    // Executed when all updates have been made
    var done = _.after(submittedData.events.length, function() {
        res.send({status: 'OK'});
    });

    // Iterate over all the time data and save it
    _.each(submittedData.events, function(eventData) {
        /*
         * Look up by provider if we already have an event with that id, this is to avoid inserting duplicates
         */
        Event.count({provider: eventData.provider, sourceId: eventData.sourceId}, function(err, count) {
            if (err) {
                return next(err);
            }
            // We found one so we skip this entry
            else if (count > 0) {
                done();
            }
            // We don't have this one yet so we add it:
            else {
                // If we don't already have it parse the new one
                // Create a Event object
                var event = new Event();

                // Pick the right data from the request and write it to the event
                _.assign(event, _.pick(eventData,
                    'timestamp',
                    'provider',
                    'sourceId',
                    'link',
                    'title',
                    'message',
                    'author',
                    'duration'
                ));

                // Save it
                event.save(function(err) {
                    if (err) {
                        return next(err);
                    }
                    done();
                });
            }
        });
    });
};
