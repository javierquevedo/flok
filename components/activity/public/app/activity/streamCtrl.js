/**
 * Controller for flok Stream
 *
 * @copyright  Nothing Interactive 2014
 * @module TimeCtrl
 */
angular.module('flokActivityModule').controller('StreamCtrl', function($scope, $routeParams, eventProvider) {
    'use strict';

    eventProvider.retrieveEventsFor();

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
