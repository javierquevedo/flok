(function() {
    'use strict';

    /**
     * Piwik Analytics Module: collect tracked events and push them into Piwik
     * @exports piwikAnalyticsModule
     * @private
     */
    var piwikAnalyticsModule = {
        /**
         * Collect and print events in Piwik
         * @return {object} services which takes note from the events and push them in piwik
         * @example
         * // eventProvider goes through received data and makes it readable by outputting only wanted info:
         * "edit task was triggered by a click, on a BUTTON"
         */
        eventProvider: function() {
            var services = {
                tracker: function(action, eventData, $window) {
                    if (eventData) {
                        // check whether it is keyboard or mouse event
                        // exception : if type = click and clientX & clientY === 0, than it was not a click, but the button was triggered by "enter"
                        var isMouse = (eventData.type === 'click');
                        var falseClick = (isMouse && eventData.clientX === 0 && eventData.clientY === 0);

                        var EventDescription = $window.document.title + ' / ' + action +
                            ' / ' + (falseClick ? 'keydown' : eventData.type) + ( isMouse ? (falseClick ? ' / Enter' : '') : ' / ' + eventData.key + '') +
                            //' / ' + eventData.originalTarget.nodeName + /* nodeName, not used for the moment */
                            ( isMouse && !falseClick ? ' / x:' + eventData.clientX + ', y:' + eventData.clientY : '');

                        $window._paq = $window._paq || [];
                        $window._paq.push(['trackPageView', EventDescription]);
                    }
                }
            };
            return services;
        },


        /**
         * Tracks events tagged in the view.
         * @param {string} action defined in the html file
         * @param {object} eventData is the Event object, it gives all the data linked to the event
         * @example
         * // in html, use ng-click to send your action to js. Add the track tag to it, with 2 arguments:
         * // i) the action (e.g. edit/abort task)
         * // ii) $event (basically tracks anything related to the related event)
         *  &lt;button ng-click="task.anyFunc() | track:'action':$event"&gt;
         */
        track: function(action, eventData, $window) {
            this.eventProvider().tracker(action, eventData, $window);
        }
    };

    // Register as Angular module
    angular.module('piwikAnalyticsModule', [])
        .provider('eventProvider', function() {
            this.$get = function() {
                return piwikAnalyticsModule.eventProvider;
            };
        })
        .filter('track', function($window) {
            return function(input, action, eventData) {
                piwikAnalyticsModule.track(action, eventData, $window);
            };
        })
    ;
})();
