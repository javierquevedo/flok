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
    var stream = [];

    // Then send the stream
    res.send(stream);

};