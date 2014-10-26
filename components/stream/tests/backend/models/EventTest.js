/**
 * Tests for Event.js model
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
require('../../../backend/models/Event.js');
var Event = mongoose.model('Event');

describe('Flok Component Stream: Event Model', function() {

    before(function () {
        // Connect to mongoose before the tests
        mongoose.connect(config.test.db);
    });

    it('Event objects can be created', function() {
        assert.isFunction(Event,'Event should be a function');
        var testEvent = new Event();
        assert.isObject(testEvent,'Expected new Event() to create object');
    });

    it('converts toJSON', function() {
        var testEvent = new Event();

        var json = testEvent.toJSON();

        assert.isObject(json,'Expecting a JSON object');
        // TODO test the properties of the aboject according to schema
        // for this we could write a jsonSchema and parse it through a validator to save time.

        // for now test that it has the require properties:
        assert.property(json,'timestamp','timestamp is a required property');
        assert.property(json,'provider','provider is a required property');
        assert.property(json,'author','author is a required property');
    });

    after(function (done) {
        // Close connection after all tests
        mongoose.connection.close(function () {
            done();
        });
    });
});