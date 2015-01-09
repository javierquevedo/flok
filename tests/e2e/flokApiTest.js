/**
 * Testing for the flok core api (e2e)
 * @copyright  Nothing Interactive 2015
 * @author     Patrick Fiaux <nodz@nothing.ch>
 */
/* globals describe, it, afterEach, beforeEach, after, before */
'use strict';

var h = require('./helper.js');

// Imports
var chai = require('chai');
var assert = chai.assert;

h.describe('Flok API.', function() {
    it('API is available', function(done) {
        h.request('GET', h.baseURL).end(function(res) {
            assert.equal(res.statusCode, 200, 'The response should be 200 OK');
            done();
        });
    });
});
