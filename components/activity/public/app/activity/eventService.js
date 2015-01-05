angular.module('flokActivityModule').factory('eventService',
    ['$timeout', '$rootScope', 'streamBackendStorageService', 'Event',
        function($timeout, $rootScope, streamBackendStorageService, Event) {
            'use strict';

            /**
             * Stream event provider. Retrieves events from the DB
             *
             * @copyright  Nothing Interactive 2014
             * @constructor
             * @exports flokActivityModule/eventService
             */
            var EventService = function() {
                /**
                 * Events storage.
                 * The array reference should never be overwritten since the controllers
                 * should be able to bind to it directly.
                 * @type {Event[]}
                 * @private
                 */
                this._events = [];
            };

            /**
             * Retrieves events from the backend and stores them in the provider instance
             */
            EventService.prototype.retrieveEvents = function() {
                // Request new events
                var that = this;
                return streamBackendStorageService.getStream()
                    .success(function(eventData) {
                        var addAll = (that._events.length === 0);
                        var previousNewestTimestamp;
                        if (!addAll) {
                            previousNewestTimestamp = that._events[0].timestamp;
                        }

                        // Go backwards through the received events to start with the oldest
                        for (var i = eventData.length - 1; i >= 0; i--) {
                            var event = new Event(eventData[i]);

                            // Only add it if it's newer than the previous events
                            // TODO: this should be done with the id of the event to prevent duplicates
                            if (addAll || event.timestamp > previousNewestTimestamp) {
                                that._events.unshift(event);
                            }
                        }
                    });
            };

            /**
             * The events of the activity stream. The returned array will be updated
             * when retrieveEvents is called
             * @returns {Event[]}
             */
            EventService.prototype.getEvents = function() {
                return this._events;
            };

            return new EventService();
        }
    ]
);

