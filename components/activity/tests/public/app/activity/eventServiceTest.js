/**
 * eventServiceTest tests
 * @author  Javier Quevedo <jquevedo@gmail.com>
 */

 describe('eventService', function() {
    'use strict';
    var eventService, $httpBackend, Event;

    beforeEach(function() {
        angular.mock.module('flokModule', 'flokActivityModule',
            /*
             * We have to setup the translateProvider to use static strings otherwise
             * we get `Unexpected request: Get locale....js Errors.
             */
            function($translateProvider) {
                $translateProvider.translations('en', {});
            }
        );

        angular.mock.module(function($provide) {
            $provide.value('backendUrl', '');

        });
    });

    beforeEach(angular.mock.inject(function(_$httpBackend_, _eventService_, _Event_) {
        eventService = _eventService_;
        $httpBackend = _$httpBackend_;
        Event = _Event_;
    }));

    it('loads the service', function() {
        assert.typeOf(eventService, 'object', 'eventService is an object');
    });

    it('can retrieve events', function() {
        assert.typeOf(eventService.retrieveEvents, 'function', 'eventService has retrieveEvents method');
        var calledSuccess = false;

        // Fixture of the data to be provided to the StreamBackendStorageService
        var mockResponse = [
            {
               "timestamp":"2015-08-09T16:22:42.000Z",
                "provider":"twitter",
                "link":"https://gmail.com",
                "title":"tweet by Nobody",
                "sticky":true,
                "author":{"name":"Twitter"},
                "message":{"content":"<p>Mock message 1</p>","format":"html"}
            },
            {
                "timestamp":"2015-08-09T16:22:10.000Z",
                "provider":"twitter",
                "link":"https://twitter.com",
                "title":"tweet by Nobody",
                "sticky":true,
                "author":{"name":"Twitter"},
                "message":{"content":"<p>Mock message 2</p>","format":"html"}
            }
        ];

        $httpBackend.expectGET('/activity')
            .respond(mockResponse);

        // Expected events based on the mock data
        var event1 = new Event(mockResponse[0]);
        var event2 = new Event(mockResponse[1]);

        var eventCollection = eventService.getEvents();
        var req = eventService.retrieveEvents();

        req.success(function(data){
            calledSuccess = true;
            assert.deepEqual(data, mockResponse, 'Obtained unexpected data');

            assert.typeOf(eventCollection.events, 'array', 'Should return an array of events');
            assert.lengthOf(eventCollection.events, 2, 'There should be two events');
            assert.deepEqual(event1, eventCollection.events[0], 'Not the correct event');
            assert.deepEqual(event2, eventCollection.events[1], 'Not the correct event');

            assert.typeOf(eventCollection.stickies, 'array', 'Should return an array of sticky events');
            assert.lengthOf(eventCollection.stickies, 1, 'There should be one stickie event');
            assert.deepEqual(event1, eventCollection.stickies[0], 'Not the correct Sticky event');
        });

        $httpBackend.flush();
        // Check that we obtained an angular $http service object
        assert.typeOf(req.then, 'function');
        assert.typeOf(req.success, 'function');
        assert.typeOf(req.error, 'function');
        assert.isTrue(calledSuccess, 'success method was called succesfully');
    });

    it('can select sticky', function() {
        assert.typeOf(eventService.selectSticky, 'function', "eventService has selectSticky method");
    });

    it('can provide events', function() {
        var eventCollection = eventService.getEvents();
        assert.typeOf(eventCollection, 'object', 'event collection obtained');
        assert.typeOf(eventCollection.stickies, 'array', 'event collection has sticky events');
        assert.lengthOf(eventCollection.stickies, 0, 'array of sticky events should be empty');
        assert.typeOf(eventCollection.events, 'array', 'event collection has events');
        assert.lengthOf(eventCollection.events, 0, 'array of events should be empty');
    });

});