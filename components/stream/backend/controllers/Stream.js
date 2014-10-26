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

    // TODO events should come from the database not dummy data.
    var stream = [
        {
            timestamp: '2014-10-26T13:09:59.079Z',
            provider: 'trac',
            link: 'http://thecodinglove.com/post/100817136612/when-i-accidentally-click-rebuild-on-a-big-project',
            title: 'She must have hidden the plans in the escape pod.',
            author: {name: 'Nodz'},
            duration: 15
        },
        {
            timestamp: '2014-10-26T13:09:59.079Z',
            provider: 'trac',
            title: 'Well, take care of yourself, Han.',
            author: {name: 'Nodz'},
            duration: 20
        },
        {
            timestamp: '2014-10-26T13:09:59.079Z',
            provider: 'trac',
            title: 'Escape is not his plan. I must face him, alone.',
            author: {name: 'Nodz'},
            duration: 45
        },
        {
            timestamp: '2014-10-26T13:09:59.079Z',
            provider: 'trac',
            title: 'I want to come with you to Alderaan. There\'s nothing for me here now. ',
            message: {
                format: 'html',
                content: '<h2>The Day The Earth Stood Stupid</h2><p>They\'re like sex, except I\'m having them! Guards! Bring me the forms I need to fill out to have her taken away! Are you crazy? I can\'t swallow that. OK, this has gotta stop. I\'m going to remind Fry of his humanity the way only a woman can. Daddy Bender, we\'re hungry. But I\'ve never been to the moon!</p>'
            },
            link: 'http://chrisvalleskey.com/fillerama/',
            author: {name: 'Nodz'},
            duration: 120
        },
        {
            timestamp: '2014-10-26T13:09:59.079Z',
            provider: 'trac',
            message: {
                format: 'html',
                content: 'Send a detachment down to retrieve them, and see to it personally, Commander.'
            },
            author: {name: 'Nodz'},
            duration: 90
        }
    ];

    // Then send the stream
    res.send(stream);

};

// Handle post request
exports.post = function(req, res, next) {
    // TODO setup the auth as a middleware
    // Get the auth header
    var authHeader = req.get('Authorization');

    // TODO keys should be stored in the config
    /*
     * We'll need to implement a config provider so that components can access the config
     * Then we can add:
     * stream: {
     *   apiKeys: []
     * },
     * to the main config and load it here.
     * Also when we do that we'll need to change the key!
     */
    var authorizedKeys = ['Uishosiekohzaekoohucoboh5Eoqu9ootaefof0y'];

    if (authHeader) {
        var parts = authHeader.split(' ');
        // Verify the identifier and the key
        if (parts.length === 2 && parts[0] === 'FlokApiKey' && authorizedKeys.indexOf(parts[1]) >= 0) {

            // process request
            var submittedData = req.body;

            // If we don't have the right version or the event's aren't an array
            // TODO we should probably check by semver here, also version could be coming from config rather than
            // hardcoded.
            if (submittedData.version !== '0.0.3') {
                next(new Error('Unsupported format version: ' + submittedData.version));
            } else if (_.isArray(submittedData.events)) {
                next(new Error('events is not an array'));
            }

            // Executed when all updates have been made
            var done = _.after(submittedData.length, function() {
                res.send({status: 'OK'});
            });

            // Iterate over all the time data and save it
            _.each(submittedData, function(eventData) {

                /*
                 * Look up by provider if we already have an event with that id, this is to avoid inserting duplicates
                 */
                Event.count({ provider: eventData.provider, sourceId: eventData.sourceId}, function(err,count) {
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

                        // Pick the right data from the request
                        eventData = _.pick(eventData,
                            'timestamp',
                            'provider',
                            'sourceId',
                            'link',
                            'title',
                            'message',
                            'author',
                            'duration'
                        );

                        // Write it to the Time object
                        _.assign(event, eventData);

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
        }
    }
}
