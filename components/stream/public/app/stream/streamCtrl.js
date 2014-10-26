/**
 * Controller for flok Stream
 *
 * @copyright  Nothing Interactive 2014
 * @module TimeCtrl
 */
angular.module('flokStreamModule').controller('StreamCtrl', function($scope) { // $timeout, $routeParams
    'use strict';

    /**
     * The Events to be displayed on the stream
     *
     * @alias module:StreamCtrl
     * @type {events[]}
     */
    //$scope.events = eventsProvider.getEvents();

    /**
     * Example of recevied event
     *
     * @type {{timestamp: string, type: string, source: string, title: string, message: {content: string, format: string}, author: {name: string}, duration: number}}
     */
    $scope.singleEventExample = {
        timestamp: '2014-10-26T17:00',
        type: 'STRING',
        source: 'https://flok.preview.ch/trac',
        title: 'Singel Event Example',
        message: {
            content: 'Lorem Ipsum <p>Taddaa</p>',
            format: 'HTML'
        },
        author: {
            name: 'Marcel Duchamp'
        },
        duration: 35
    };

});
