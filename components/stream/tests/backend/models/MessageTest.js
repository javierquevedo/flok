/**
 * Tests for Message.js model
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
require('../../../backend/models/Message.js');
var Message = mongoose.model('Message');

describe('Flok Component Message', function() {

    before(function () {
        // Connect to mongoose before the tests
        mongoose.connect(config.test.db);
    });

    it('Message objects can be created', function() {
        assert.isFunction(Message,'Message should be a function');
        var testMessage = new Message();
        assert.isObject(testMessage,'Expected new Message() to create object');
    });

    it('converts toJSON', function() {
        var testMessage = new Message();

        var json = testMessage.toJSON();

        assert.isObject(json,'Expecting a JSON object');
        // TODO test the properties of the aboject according to schema
        // for this we could write a jsonSchema and parse it through a validator to save time.

        // for now test that it has the require properties:
        assert.property(json,'timestamp','timestamp is a required property');
        assert.property(json,'type','type is a required property');
        assert.property(json,'author','author is a required property');
    });

    after(function (done) {
        // Close connection after all tests
        mongoose.connection.close(function () {
            done();
        });
    });
});