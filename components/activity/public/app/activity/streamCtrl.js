/**
 * Controller for flok Stream
 *
 * @copyright  Nothing Interactive 2014
 * @exports flokActivityModule/streamCtrl
 */
angular.module('flokActivityModule').controller('StreamCtrl', function($scope, $routeParams, STREAM_DATE_FORMAT, eventService) {
    'use strict';

    eventService.retrieveEventsFor();

    $scope.dateFormat = STREAM_DATE_FORMAT;

    /**
     * The Events to be displayed on the stream, once per minute.
     *
     * @alias module:StreamCtrl
     * @type {events[]}
     */
    $scope.events = eventService.getEvents();

    // calls the stream every minute
    setInterval(function() {
        eventService.retrieveEventsFor();
        var newEvents = eventService.getEvents();

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
