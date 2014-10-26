/**
 * Stream event provider. Retrieves events from the DB
 *
 * @copyright  Nothing Interactive 2014
 */
angular.module('flokStreamModule').provider('eventProvider', function() {
    'use strict';


    var backendStorageService;

    var STORAGE_ID = 'nothingFlokEventStorage-1';

    /**
     * events storage
     * @type {Event[]}
     * @private
     */
    var events = [];
    var $rootScope;
    var _initialising = true;
    var _currentUser = '';
    var _lastPlannedDataToPersistToBackend = '';

    var getStorageId = function() {
        return STORAGE_ID + '-' + _currentUser;
    };

    var stringifyEvents = function(events) {
        return JSON.stringify(events, Event.INCLUDE_IN_JSON);
    };

    var retrieveEventsFor = function(user) {
        _initialising = true;
        _currentUser = user;
        events = [];
        // Retrieve the stored tasks
        backendStorageService.getStream(_currentUser)
            .success(function(data) {
                for (var i = 0; i < data.length; i++) {

                    events.push(Event.createFromJSON(data[i]));
                }
                _lastPlannedDataToPersistToBackend = stringifyEvents(events);
                _initialising = false;
            })
            .error(function() {
                var storedEvents = JSON.parse(localStorage.getItem(getStorageId()) || '[]');
                for (var i = 0; i < storedEvents.length; i++) {
                    events.push(Event.createFromJSON(storedEvents[i]));
                }
                _initialising = false;
            })
        ;
    };


    this.$get = ['$timeout', '$rootScope', 'backendStorageService', function($timeout, _$rootScope_, _backendStorageService_)  {

        backendStorageService = _backendStorageService_;
        $rootScope = _$rootScope_;

        /**
         * Services that retrieves events from db
         * @module taskProvider
         */
        var exports = {
            retrieveEventsFor: retrieveEventsFor,

            /**
             * The provided Tasks
             * @type {Task[]}
             */
            getEvents: function() {
                return events;
            }
        };

        return exports;
    }];
});

