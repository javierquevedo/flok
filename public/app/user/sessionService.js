/**
 * @copyright  Nothing Interactive 2014
 * @author     Tobias Leugger <vibes@nothing.ch>
 * @author     Patrick Fiaux <nodz@nothing.ch>
 */
angular.module('flokModule').factory('sessionService', [
    '$q', '$http', '$rootScope', '$location', 'backendUrl', 'User',
    function($q, $http, $rootScope, $location, backendUrl, User) {
        'use strict';

        /**
         * Interface with the backend API for session handling
         * @class
         * @exports flokActivityModule/SessionService
         */
        var SessionService = function() {
            this._hasValidSession = false;
            this._deferredUser = $q.defer();

            this._requestUser();

            // Treat unauthorized requests as logout
            var that = this;
            $rootScope.$on('flok.backend.unauthorized', function() {
                that._handleLogout();
            });
        };

        /**
         * Makes sure the client side is logged out by resetting
         * the session and the user and then redirecting to login.
         * Does not send any requests to the backend.
         * @private
         */
        SessionService.prototype._handleLogout = function() {
            // No more valid session
            this._hasValidSession = false;

            // Reset the user
            this._deferredUser = $q.defer();

            // Redirect to logout
            $location.path('/login');
        };

        /**
         * Requests the current user from the backend and
         * initialises the session if successful.
         * @returns {Promise}
         * @private
         */
        SessionService.prototype._requestUser = function() {
            var that = this;
            return $http.get(backendUrl + '/flok/user/me')
                .then(function(response) {
                    var user = new User(response.data);
                    that._hasValidSession = true;
                    that._deferredUser.resolve(user);
                })
                // Treat any error as a logout
                .catch(function() {
                    that._handleLogout();
                });
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
         * Tries to login with the given email and pw
         * @param {string} email
         * @param {string} password
         * @returns {HttpPromise}
         */
        SessionService.prototype.login = function(email, password) {
            var that = this;
            return $http.post(backendUrl + '/flok/session',
                {
                    email: email,
                    password: password
                })
                .then(function(response) {
                    that._hasValidSession = true;
                    that._requestUser();
                    return response;
                });
        };

        /**
         * Logs the user out
         * @returns {HttpPromise}
         */
        SessionService.prototype.logout = function() {
            var that = this;
            return $http.delete(backendUrl + '/flok/session')
                .finally(function() {
                    that._handleLogout();
                });
        };

        /**
         * Returns a promise that will resolve to the user data
         * @returns {Promise}
         */
        SessionService.prototype.getUser = function() {
            return this._deferredUser.promise;
        };

        /**
         * Returns whether there is currently a valid session
         * @returns {boolean}
         */
        SessionService.prototype.hasValidSession = function() {
            return this._hasValidSession;
        };

        return new SessionService();
    }
]);
