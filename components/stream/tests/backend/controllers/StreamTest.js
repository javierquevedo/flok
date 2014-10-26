/**
 * Tests for Stream.js controller
 *
 * @copyright  Nothing Interactive 2014
 */
/* globals describe, it, afterEach, beforeEach, after, before */
'use strict';

// Imports
var chai = require('chai');
var mongoose = require('mongoose');
var assert = chai.assert;

// Load the main config so we can figure out the test db
var config = require('../../../../../config/config.js');

// Class / Object we want to test
var Stream = require('../../../backend/controllers/Stream.js');

describe('Flok Component Stream: Stream Controller', function() {

    before(function () {
        // Connect to mongoose before the tests
        mongoose.connect(config.test.db);
    });

    it('has functions for the defined routes', function() {
        assert.isFunction(Stream.get,'Stream should have a get function');
        assert.isFunction(Stream.post,'Stream should have a post function');
    });

    it.skip('returns current time entries', function() {
        // TODO we'll have to insert dummy data before we can test this once dummy data is removed from Stream.
    });

    after(function (done) {
        // Close connection after all tests
        mongoose.connection.close(function () {
            done();
        });
    });
});