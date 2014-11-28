/**
 * Controller for flok Stream
 *
 * @copyright  Nothing Interactive 2014
 * @module streamCtrl
 */
var flokActivityModule = angular.module('flokActivityModule');

flokActivityModule.constant('STREAM_DATE_FORMAT', 'MMM d @ HH:mm');

// TODO this might be better done in flokFilters, however the filters there are millisecond based.
flokActivityModule.filter('activityDuration', function() {
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
            string += hours + ' hours ' + minutes + ' minutes';
        }
        else {
            string += minutes + ' minutes';
        }

        return string;
    };
});

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
        $scope.events = eventProvider.getEvents();
    }, 60000);
});
