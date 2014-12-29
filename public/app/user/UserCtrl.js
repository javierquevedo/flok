/**
 * Controller that logs the user out when loaded
 * @author     Tobias Leugger <vibes@nothing.ch>
 * @author     Patrick Fiaux <nodz@nothing.ch>
 * @module UserCtrl
 */
angular.module('flokModule').controller('UserCtrl', [
    '$scope', 'sessionService',
    function($scope, sessionService) {
        'use strict';

        // Get and expose the current user
        $scope.user = undefined;
        sessionService.getUser()
            .then(function(user) {
                $scope.user = user;
            })
        ;
    }
]);
