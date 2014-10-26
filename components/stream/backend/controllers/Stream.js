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
    var stream = [
        {
            timestamp: '2014-10-26T13:09:59.079Z',
            provider: 'trac',
            link: 'http://thecodinglove.com/post/100817136612/when-i-accidentally-click-rebuild-on-a-big-project',
            title: 'She must have hidden the plans in the escape pod.',
            author: {user: 'Nodz'},
            duration: 15
        },
        {
            timestamp: '2014-10-26T13:09:59.079Z',
            provider: 'trac',
            title: 'Well, take care of yourself, Han.',
            author: {user: 'Nodz'},
            duration: 20
        },
        {
            timestamp: '2014-10-26T13:09:59.079Z',
            provider: 'trac',
            title: 'Escape is not his plan. I must face him, alone.',
            author: {user: 'Nodz'},
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
            author: {user: 'Nodz'},
            duration: 120
        },
        {
            timestamp: '2014-10-26T13:09:59.079Z',
            provider: 'trac',
            message: {
                format: 'html',
                content: 'Send a detachment down to retrieve them, and see to it personally, Commander.'
            },
            author: {user: 'Nodz'},
            duration: 90
        }
    ];

    // Then send the stream
    res.send(stream);

};