/**
 * Stream event provider. Retrieves events from the DB
 *
 * @copyright  Nothing Interactive 2014
 */
angular.module('flokStreamModule').provider('eventProvider', function() {
    'use strict';


    var streamBackendStorageService;

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

    var retrieveEventsFor = function() {
        _initialising = true;
        events = [];
        // Retrieve the stored tasks
        streamBackendStorageService.getStream()
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


    this.$get = ['$timeout', '$rootScope', 'streamBackendStorageService', function($timeout, _$rootScope_, _backendStorageService_) {

        streamBackendStorageService = _backendStorageService_;
        $rootScope = _$rootScope_;

        /**
         * Services that retrieves events from db
         * @module taskProvider
         */
        var exports = {
            retrieveEventsFor: retrieveEventsFor,

            /**
             * The provided Tasks
             * @type {Event[]}
             */
            getEvents: function() {
                return events;
            }
        };

        return exports;
    }];
});

