angular.module('flokTimeModule').factory('backendStorageService', ['$http', '$rootScope', 'backendUrl',
    function($http, $rootScope, backendUrl) {
        'use strict';

        /**
         * Interface with the backend API for time
         * A backend service provider for the time component. Allows interaction with the backend
         * without knowing about the details
         *
         * @copyright  Nothing Interactive 2014
         * @author     Patrick Fiaux <nodz@nothing.ch>
         * @author     Marc Gruber <rune@nothing.ch>
         * @author     Tobias Leugger <vibes@nothing.ch>
         * @exports flokTimeModule/backendStorageService
         */
        var BackendStorageService = function() {
        };

        /**
         * Get the time items from the backend
         * @param user
         * @returns {*}
         */
        BackendStorageService.prototype.getTime = function(user) {
            $rootScope.$emit('flok.backend.status', 'requesting');
            return $http.get(backendUrl + '/time/' + user)
                .success(function() {
                    $rootScope.$emit('flok.backend.status', 'success');
                })
                .error(function() {
                    $rootScope.$emit('flok.backend.status', 'error');
                })
                ;
        };

        /**
         * Push the time items to the backend
         * @param user
         * @param data
         * @returns {*}
         */
        BackendStorageService.prototype.putTime = function(user, data) {
            $rootScope.$emit('flok.backend.status', 'requesting');
            return $http.put(backendUrl + '/time/' + user, data)
                .success(function() {
                    $rootScope.$emit('flok.backend.status', 'success');
                })
                .error(function() {
                    $rootScope.$emit('flok.backend.status', 'error');
                })
                ;
        };

        return new BackendStorageService();
    }
]);
