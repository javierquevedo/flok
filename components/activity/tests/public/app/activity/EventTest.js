/**
 * EventTest tests
 * @author     Javier Quevedo <jquevedo@gmail.com>
 */

 describe('Event Class.', function() {
    'user strict';

    var Event;
    const eventJson = {
            link: false,
            title: 'A Title',
            message: 'A Message',
            duration: 100,
            sticky: true
        };

    /**
     * Test Suite Setup
     */
    beforeEach(function() {

        angular.mock.module('flokModule', 'flokActivityModule');

        /**
         * Inject the Event class
         */
        angular.mock.inject(function(_Event_) {
            Event = _Event_;
        });
    });

    describe('Event Constructor', function() {

        /**
         * Checks if an event can be created without arguments, expecting
         * a default event
         */
        it('Creates default event if no args', function() {
            var anEvent = new Event();
            assert.typeOf(anEvent, 'object', "Not obtained an object");
            assert.equal(anEvent.title, '', 'Should have empty title');
            assert.equal(anEvent.message, '', 'Should have empty message');
            assert.equal(anEvent.duration, 0, 'Duration should be 0');
            assert.equal(anEvent.sticky, false, 'Event should not be sticky');
        });

        /**
         * Checks if an event can be created from JSON data with the expected results
         */
        it('Creates Event from JSON', function() {
            var anEvent = new Event(eventJson);
            assert.typeOf(anEvent, 'object', "Not obtained an object");
            assert.equal(anEvent.title, eventJson.title, 'Should not have empty title');
            assert.equal(anEvent.message, eventJson.message, 'Should not have empty message');
            assert.equal(anEvent.duration, eventJson.duration, 'Duration should be 100');
            assert.equal(anEvent.sticky, eventJson.sticky, 'Event should be sticky');
        });
    });
 });