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
    angular.module('flokModule').factory('userService', ['users', function(users) {
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
                // TODO might need to change the page if we rely on the user for that page
                /// $route.reload();
                currentUser = newUser;
                localStorage.setItem(STORAGE_ID, newUser);
            },

            getUsersList: function() {
                return availableUsers;
            }
        };

        if (angular.isUndefined(currentUser)) {
            // TODO if no user force selection
            userService.changeUser(availableUsers[0]);
        }

        return userService;
    }]);
})();
