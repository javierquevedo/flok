/**
 * eventServiceTest tests
 * @author     Javier Quevedo <jquevedo@gmail.com>
 */

 describe('eventService', function() {
    'use strict';
    var eventService, $httpBackend;

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

    beforeEach(angular.mock.inject(function(_$httpBackend_, _eventService_) {
        eventService = _eventService_;
        $httpBackend = _$httpBackend_;
    }));

    it('loads the service', function() {
        assert.typeOf(eventService, 'object', 'eventService is an object');
    });

    it('can retrieve events', function(){
        assert.typeOf(eventService.retrieveEvents, 'function', 'eventService has retrieveEvents method');
        var calledSuccess = false;

        // Fixture of the expected data to be provided by the eventService
        var expectedData = [
            {
                events: [],
                stickies: [{
                link : false,
                title : 'My Sticky Event Title',
                message : 'Description of sticky event',
                duration : 0,
                sticky : true
                }]
            }
        ];

        var req = eventService.retrieveEvents();
        $httpBackend.expectGET('/activity')
            .respond(expectedData);

        req.success(function(data){
            calledSuccess = true;
            assert.deepEqual(data, expectedData, 'Obtained unexpected data');
        });

        $httpBackend.flush();

        // Check that we obtained an angular $http service object
        assert.typeOf(req.then, 'function');
        assert.typeOf(req.success, 'function');
        assert.typeOf(req.error, 'function');
        assert.isTrue(calledSuccess, 'success method was called succesfully');
    });

    it('can select sticky', function(){
        assert.typeOf(eventService.selectSticky, 'function', "eventService has selectSticky method");
    });

    it('can provide events', function(){
        var eventCollection = eventService.getEvents();
        assert.typeOf(eventCollection, 'object', 'event collection obtained');
        assert.typeOf(eventCollection.stickies, 'array', 'event collection has sticky events');
        assert.lengthOf(eventCollection.stickies, 0, 'array of sticky events should be empty');
        assert.typeOf(eventCollection.events, 'array', 'event collection has events');
        assert.lengthOf(eventCollection.events, 0, 'array of events should be empty');
    });

});