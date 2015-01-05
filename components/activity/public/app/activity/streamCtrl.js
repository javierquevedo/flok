/**
 * Controller for flok Stream
 *
 * @copyright  Nothing Interactive 2014
 * @exports flokActivityModule/streamCtrl
 */
angular.module('flokActivityModule').controller('StreamCtrl', function($scope, $routeParams, STREAM_DATE_FORMAT, eventService) {
    'use strict';

    eventService.retrieveEvents();

    $scope.dateFormat = STREAM_DATE_FORMAT;

    /**
     * The Events to be displayed on the stream, once per minute.
     *
     * @alias module:StreamCtrl
     * @type {events[]}
     */
    $scope.events = eventService.getEvents();

    // Update the stream every 15 seconds
    setInterval(function() {
        // Retrieve new events. It will updated the array we already have a reference to
        eventService.retrieveEvents();
    }, 15000);
});
