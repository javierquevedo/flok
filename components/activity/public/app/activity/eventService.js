angular.module('flokActivityModule').factory('eventService',
    ['$q', '$timeout', '$rootScope', 'streamBackendStorageService', 'Event',
        function($q, $timeout, $rootScope, streamBackendStorageService, Event) {
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

                /**
                 * Sticky Events storage.
                 * The array reference should never be overwritten since the controllers
                 * should be able to bind to it directly.
                 * @type {Event[]}
                 * @private
                 */
                this._stickies = [];

                /**
                 * Event collection storage.
                 * @type {{events: Event[], stickies: Event[]}}
                 * @private
                 */
                this._eventCollection = {
                    events: this._events,
                    stickies: this._stickies
               }
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
                        that.selectSticky();
                    });
            };

            /*
            * Stores in the provider instance of sticky events those sticky
            * events which should be displayed
            */
            EventService.prototype.selectSticky = function() {
                // TODO: Decide on a policy to determine which sticky elements should be displayed.
                // The current policy is to only select the latest sticky.
                // Remove all stickies from the current array
                this._stickies.length = 0;
                for (var i = 0; i < this._events.length; i++) {
                    var anEvent = this._events[i];
                    if (anEvent.sticky === true){
                        this._stickies.push(anEvent);
                        break;
                    }
                }
            }

            /**
             * The events of the activity stream. The returned array will be updated
             * when retrieveEvents is called
             * @returns {Event[]}
             */
            EventService.prototype.getEvents = function() {
                return this._eventCollection;
            };

            return new EventService();
        }
    ]
);

