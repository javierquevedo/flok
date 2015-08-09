/**
 * eventServiceTest tests
 * @copyright  Nothing Interactive 2014
 * @author     Javier Quevedo <jquevedo@gmail.com>
 */

 describe('eventService', function() {
    'use strict';
    var eventService, $httpBackend;

  beforeEach(function() {
        angular.mock.module('flokModule', 'flokActivityModule');
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
    });

    it('can select sticky', function(){
        assert.typeOf(eventService.selectSticky, 'function', "eventService has selectSticky method");
    });

    it('can provide events', function(){
        var eventCollection = eventService.getEvents();
        assert.typeOf(eventCollection, 'object', 'event collection obtained');
        assert.typeOf(eventCollection.stickies, 'array', 'event collection has sticky events');
        assert.typeOf(eventCollection.events, 'array', 'event collection has events');
    });






});