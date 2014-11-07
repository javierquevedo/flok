/**
 * Controller for flok Todo
 * @module TimeCtrl
 */
angular.module('flokModule').controller('UserCtrl', ['$scope', 'userService', function($scope, userService) {
    'use strict';

    $scope.users = userService.getUsersList();

    $scope.currentUser = userService.getCurrentUser();


    /**
     * Change the current user. Save to local storage
     * @param newUser
     */
    $scope.changeUser = function(newUser) {
        userService.changeUser(newUser);
        $scope.currentUser = newUser;
    };

}]);
