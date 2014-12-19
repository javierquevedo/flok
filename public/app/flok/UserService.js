angular.module('flokModule').factory('userService', ['$route', '$window', 'users', function($route, $window, users) {
    'use strict';

    /**
     * Provides the user session functionality
     * @copyright  Nothing Interactive 2014
     * @author     Patrick Fiaux <nodz@nothing.ch>
     * @constructor
     * @exports flokModule/userService
     */
    var UserService = function() {
    };

    /**
     * Key used in the local storage
     * @type {string}
     * @private
     */
    var STORAGE_ID = 'nothingFlokUserStorage-1';

    var availableUsers = users;

    var currentUser = $window.localStorage.getItem(STORAGE_ID);

    UserService.prototype.getCurrentUser = function() {
        return currentUser;
    };

    UserService.prototype.changeUser = function(newUser) {
        // TODO we need to implement events to have a better way than reloading the page
        $route.reload();
        currentUser = newUser;
        $window.localStorage.setItem(STORAGE_ID, newUser);
    };

    UserService.prototype.getUsersList = function() {
        return availableUsers;
    };

    var userService = new UserService();

    if (angular.isUndefined(currentUser)) {
        // TODO if no user force selection, first user
        userService.changeUser(availableUsers[0]);
    }

    return userService;
}]);
