/**
 * Controller for flok Stream
 *
 * @copyright  Nothing Interactive 2014
 * @module streamCtrl
 */
var flokActivityModule = angular.module('flokActivityModule');

flokActivityModule.constant('STREAM_DATE_FORMAT', 'MMM d @ HH:mm');

// TODO this might be better done in flokFilters, however the filters there are millisecond based.
flokActivityModule.filter('activityDuration', ['$filter', function($filter) {
    'use strict';

    return function(input) {
        if (!input) {
            return '';
        }

        // Check if the value is negative
        var negative = (input < 0);
        if (negative) {
            // Make it positive for the calculations below to work
            input *= -1;
        }

        var minutes = input % 60;
        var hours = Math.floor(input / 60);

        // TODO translate
        var string = negative ? 'removed ' : 'added ';
        if (hours > 0) {
            string += hours + ' hours ';
            if (minutes > 0) {
                string += minutes + ' minutes';
            }
        }
        else {
            string += minutes + ' minutes';
        }

        return string;
    };
}]);

flokActivityModule.controller('StreamCtrl', function($scope, $routeParams, STREAM_DATE_FORMAT, eventProvider) {
    'use strict';

    eventProvider.retrieveEventsFor();

    $scope.dateFormat = STREAM_DATE_FORMAT;

    /**
     * The Events to be displayed on the stream, once per minute.
     *
     * @alias module:StreamCtrl
     * @type {events[]}
     */
    $scope.events = eventProvider.getEvents();

    // calls the stream every minute
    setInterval(function() {
        eventProvider.retrieveEventsFor();
        var newEvents = eventProvider.getEvents();

        // collects new events
        var eventsToAdd = [];
        for (var i = 0; i < newEvents.length; i++) {
            if (newEvents[i].timestamp <= $scope.events[0].timestamp) {
                eventsToAdd = newEvents.splice(0, i + 1);
                break;
            }
        }

        // add the new events to the current flow
        // Note: for now, the flow always displays the last 20 events thanks to "limitTo:20" in the ng-repeat
        if (eventsToAdd.length > 0) {
            $scope.events = eventsToAdd.concat($scope.events);
        }
    }, 15000);
});
