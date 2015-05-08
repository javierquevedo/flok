/**
 * Twitter Stream Controller
 *
 * TODO list:
 * - Filter tweets based on config (ignore, ...)
 * - Shutdown function
 *
 * @copyright  Nothing Interactive 2015
 */
'use strict';

var http = require('http');
var Twit = require('twit');
var activeConfig = require('../../../../backend/Config.js');

/**
 * Takes a tweet object and returns an Event.
 * TODO should this use the activity Event model & use some to json method to serialize it. code reuse would be good.
 * TODO if we require classes from the activity components well need module dependencies and we'll need init checks that the module
 * is enabled
 * @param tweet
 * @returns {{}}
 */
var createEventFromTweet = function(tweet) {
    var tweetDate = new Date(Date.parse(tweet['created_at'].replace(/( \+)/, ' UTC$1')));

    var event = {
        timestamp: tweetDate.toISOString(),
        provider: 'twitter',
        sourceId: tweet['id_str'],
        link: 'https://twitter.com/' + tweet.user['screen_name'] + '/status/' + tweet['id_str'],
        title: 'tweeted',
        message: {
            content: '<p>' + tweet.text + '</p>',
            format: 'html'
        },
        author: {
            name: tweet.user.name
        }
    };

    return event;
};



/**
 * Handle a new tweet event from the stream, and post it to activities if needed.
 * @param tweet
 */
var handleTweet = function(tweet) {

    console.log('flok:twitter new tweet event: ', tweet);

    // TODO filter if event is displayed on activity or not.

    // Convert the tweet to an activity stream event
    var event = createEventFromTweet(tweet);

    //TODO extract this code to a function postEventToActivity. (note if not using http the wrapper might not event be needed).
    var data = {
        version: '0.0.3',
        events: [event]
    };

    var dataString = JSON.stringify(data);

    var headers = {
        'Authorization': 'FlokApiKey ' + activeConfig.twitter.flokApiKey,
        'Content-Type': 'application/json',
        'Content-Length': dataString.length
    };

    var options = {
        host: 'localhost',
        port: 3000,
        path: '/api/activity',
        method: 'POST',
        headers: headers
    };

    // Defining the http request properties
    var req = http.request(options, function(res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function(data) {
            responseString += data;
        });

        // TODO remove event unless needed
        res.on('end', function() {
            var resultObject = JSON.parse(responseString);
        });
    });

    req.on('error', function(err) {
        console.log('flok:twitter Twitter stream http request error: ' + err.code, err);
    });

    // Sending the tweets to the activity component
    req.write(dataString);
    req.end();
};

/**
 * Initializes the twitter stream connection and setup event handlers.
 *
 * Listen to new tweets of the Twitter account related to the keys and tokens specified in config.js
 *
 * TODO some event should handle the disconnection and attempt to reconnect.
 */
var start = function() {
    /*
     * We use the npm module Twit to connect to the twitter stream.
     * Here we setup the instance based on the config params.
     */
    var T = new Twit({
        'consumer_key': activeConfig.twitter.consumerKey,
        'consumer_secret': activeConfig.twitter.consumerSecret,
        'access_token': activeConfig.twitter.accessToken,
        'access_token_secret': activeConfig.twitter.accessTokenSecret
    });

    console.log('flok:twitter Listening for tweets from @NothingAgency.');

    // TODO document what this does
    var stream = T.stream('user', {});

    /*
     * Setup the event listeners on the stream:
     * For most of them simply log
     */
    stream.on('connect', function(/*request*/) {
        console.log('flok:twitter Connected to Twitter API');
    });

    stream.on('disconnect', function(message) {
        console.log('flok:twitter Disconnected from Twitter API. Message: ' + message);
    });

    stream.on('reconnect', function(request, response, connectInterval) {
        console.log('flok:twitter Trying to reconnect to Twitter API in ' + connectInterval + ' ms');
    });

    stream.on('error', function(error) {
        console.log('flok:twitter Error with the Twitter API: ' + error.message);
    });

    // Actions performed every time a new tweet is posted by the account.
    stream.on('tweet', handleTweet);
};

/**
 * Expose the init function for this module.
 */
exports.start = start;
