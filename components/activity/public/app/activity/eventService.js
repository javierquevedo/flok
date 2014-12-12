angular.module('flokActivityModule').factory('eventService',
    ['$timeout', '$rootScope', 'streamBackendStorageService', 'Event',
        function($timeout, $rootScope, streamBackendStorageService, Event) {
            'use strict';

            var STORAGE_ID = 'nothingFlokEventStorage-1';

            /**
             * events storage
             * @type {Event[]}
             * @private
             */
            var events = [];
            var _initialising = true;
            var _currentUser = '';
            var _lastPlannedDataToPersistToBackend = '';

            var getStorageId = function() {
                return STORAGE_ID + '-' + _currentUser;
            };

            var stringifyEvents = function(events) {
                return JSON.stringify(events, Event.INCLUDE_IN_JSON);
            };

            /**
             * Stream event provider. Retrieves events from the DB
             *
             * @copyright  Nothing Interactive 2014
             * @constructor
             * @exports flokActivityModule/eventService
             */
            var EventService = function() {
            };

            /**
             * Retrieves events from the backend and stores them in the provider instance
             */
            EventService.prototype.retrieveEventsFor = function() {
                _initialising = true;
                events = [];
                // Retrieve the stored tasks
                streamBackendStorageService.getStream()
                    .success(function(data) {
                        for (var i = 0; i < data.length; i++) {

                            events.push(new Event(data[i]));
                        }
                        _lastPlannedDataToPersistToBackend = stringifyEvents(events);
                        _initialising = false;
                    })
                    .error(function() {
                        var storedEvents = JSON.parse(localStorage.getItem(getStorageId()) || '[]');
                        for (var i = 0; i < storedEvents.length; i++) {
                            events.push(new Event(storedEvents[i]));
                        }
                        _initialising = false;
                    })
                ;
            };

            /**
             * The provided Tasks
             * @returns {Event[]}
             */
            EventService.prototype.getEvents = function() {
                return events;
            };

            return new EventService();

        }
    ]
);

