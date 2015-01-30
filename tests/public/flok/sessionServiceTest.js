/**
 * sessionService tests
 * @copyright  Nothing Interactive 2015
 * @author     Tobias Leugger <vibes@nothing.ch>
 *
 */
/*global describe, beforeEach, it, assert */
describe('sessionService', function() {
    'use strict';

    var sessionService;

    beforeEach(function() {
        angular.mock.module('flokModule');

        angular.mock.inject(function(_sessionService_) {
            sessionService = _sessionService_;
        });
    });

    it('service loaded', function() {
        assert.typeOf(sessionService, 'object', 'sessionService is an object');
    });
});
