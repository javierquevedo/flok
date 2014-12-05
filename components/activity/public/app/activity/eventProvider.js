angular.module('flokActivityModule').factory('eventProvider',
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
             * @exports flokActivityModule/eventProvider
             */
            var EventProvider = function() {
            };

            EventProvider.prototype.retrieveEventsFor = function() {
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

            /**
             * The provided Tasks
             * @returns {Event[]}
             */
            EventProvider.prototype.getEvents = function() {
                return events;
            };

            return new EventProvider();

        }
    ]
);

