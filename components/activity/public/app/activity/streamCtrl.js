/**
 * Controller for flok Stream
 *
 * @copyright  Nothing Interactive 2014
 * @exports flokActivityModule/streamCtrl
 */
angular.module('flokActivityModule').controller('StreamCtrl', ['$scope', 'STREAM_DATE_FORMAT', 'eventService',
    function($scope, STREAM_DATE_FORMAT, eventService) {
        'use strict';

        eventService.retrieveEvents();

        $scope.dateFormat = STREAM_DATE_FORMAT;

        var eventCollection = eventService.getEvents();

        /**
         * The Events to be displayed on the stream.
         *
         * @alias module:StreamCtrl
         * @type {Event[]}
         */
        $scope.events = eventCollection.events;


        /**
         * The Sticky Events to be displayed on the stream.
         *
         * @alias module:StreamCtrl
         * @type {Event[]}
         */
        $scope.stickies = eventCollection.stickies;



        // Update the stream every 15 seconds
        setInterval(function() {
            // Retrieve new events. It will updated the array we already have a reference to
            eventService.retrieveEvents();
        }, 15000);

        // Initially, do not go into full screen
        $scope.isFullscreen = false;

        /**
         * Put the activity stream in full screen
         *
         */
        $scope.toggleFullScreen = function() {
            $scope.isFullscreen = !$scope.isFullscreen;
        };
    }
]);
