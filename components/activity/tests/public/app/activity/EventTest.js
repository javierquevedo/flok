/**
 * eventServiceTest tests
 * @author     Javier Quevedo <jquevedo@gmail.com>
 */

 describe('Event Class.', function(){
    'user strict';

    var Event;

    beforeEach(function(){
        angular.mock.module('flokModule', 'flokActivityModule');
        angular.mock.inject(function(_$rootScope_, _Event_){
            Event = _Event_;
        });
    });

    describe('Event Constructor', function(){
        it('Creates default event if no args', function(){
            var anEvent = new Event();
            assert.typeOf(anEvent, 'object', "Not obtained an object");
            assert.equal(anEvent.title, '', 'Should have empty title');
            assert.equal(anEvent.message, '', 'Should have empty message');
            assert.equal(anEvent.duration, 0, 'Duration should be 0');
            assert.equal(anEvent.sticky, false, 'Event should not be sticky');
        });

        it('Creates Event from JSON', function(){
            var eventJson = {
                link: false,
                title: 'A Title',
                message: 'A Message',
                duration: 100,
                sticky: true
            };

            var anEvent = new Event(eventJson);
            assert.typeOf(anEvent, 'object', "Not obtained an object");
            assert.equal(anEvent.title, eventJson.title, 'Should not have empty title');
            assert.equal(anEvent.message, eventJson.message, 'Should not have empty message');
            assert.equal(anEvent.duration, eventJson.duration, 'Duration should be 100');
            assert.equal(anEvent.sticky, eventJson.sticky, 'Event should be sticky');
        });

        // TODO: Test filters (getFormattedDuration and getFormattedTimestamp)
    });
 });