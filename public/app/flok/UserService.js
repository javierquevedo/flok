/**
 *
 * @copyright  Nothing Interactive 2014
 * @author     Patrick Fiaux <nodz@nothing.ch>
 *
 */
(function() {
    'use strict';

    /**
     * Provides the user session functionality
     *
     * @module userService
     */
    angular.module('flokModule').factory('userService', ['$route', 'users', function($route, users) {
        /**
         * Key used in the local storage
         * @type {string}
         * @private
         */
        var STORAGE_ID = 'nothingFlokUserStorage-1';

        var availableUsers = users;

        var currentUser = localStorage.getItem(STORAGE_ID);

        var userService = {
            getCurrentUser: function() {
                return currentUser;
            },

            changeUser: function(newUser) {
                // TODO we need to implement events to have a better way than reloading the page
                $route.reload();
                currentUser = newUser;
                localStorage.setItem(STORAGE_ID, newUser);
            },

            getUsersList: function() {
                return availableUsers;
            }
        };

        if (angular.isUndefined(currentUser)) {
            // TODO if no user force selection, first user
            userService.changeUser(availableUsers[0]);
        }

        return userService;
    }]);
})();
