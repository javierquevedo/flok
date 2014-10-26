/**
 * Controller for flok Stream
 *
 * @copyright  Nothing Interactive 2014
 * @module TimeCtrl
 */
angular.module('flokStreamModule').controller('StreamCtrl', function($scope, $routeParams, eventProvider) { // $timeout, $routeParams
    'use strict';

    $scope.user = $routeParams.user;

    eventProvider.retrieveEventsFor($scope.user);
    /**
     * The Events to be displayed on the stream
     *
     * @alias module:StreamCtrl
     * @type {events[]}
     */
    $scope.events = eventProvider.getEvents();
});
