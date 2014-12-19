/**
 * @copyright  Nothing Interactive 2014
 * @author     Tobias Leugger <vibes@nothing.ch>
 */
angular.module('flokModule').factory('sessionService', [
    '$http', '$rootScope', 'backendUrl',
    function($http, $rootScope, backendUrl) {
        'use strict';

        /**
         * Interface with the backend API for session handling
         * @class
         * @exports flokActivityModule/SessionService
         */
        var SessionService = function() {
        };

        /**
         * Registers a user with the given email and password
         * @param {string} email
         * @param {string} password
         * @returns {HttpPromise}
         */
        SessionService.prototype.register = function(email, password) {
            return $http.post(backendUrl + '/flok/register', {
                email: email,
                password: password
            });
        };

        /**
         * Tries to login as the given email
         * @param {string} email
         * @param {string} password
         * @returns {HttpPromise}
         */
        SessionService.prototype.login = function(email, password) {
            return $http.post(backendUrl + '/flok/session', {
                email: email,
                password: password
            });
        };

        /**
         * Logs the user out
         * @returns {HttpPromise}
         */
        SessionService.prototype.logout = function() {
            return $http.delete(backendUrl + '/flok/session');
        };

        return new SessionService();
    }
]);
