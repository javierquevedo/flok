angular.module('flokActivityModule').factory('streamBackendStorageService', ['$http', '$rootScope', 'backendUrl',
    function($http, $rootScope, backendUrl) {
        'use strict';

        /**
         * Interface with the backend API for activity
         * @copyright  Nothing Interactive 2014
         * @class
         * @exports flokActivityModule/streamBackendStorageService
         */
        var StreamBackendStorageService = function() {
        };

        StreamBackendStorageService.prototype.getStream = function() {
            $rootScope.$emit('flok.backend.status', 'requesting');
            return $http.get(backendUrl + '/activity')
                .success(function() {
                    $rootScope.$emit('flok.backend.status', 'success');
                })
                .error(function() {
                    $rootScope.$emit('flok.backend.status', 'error');
                })
                ;
        };

        return new StreamBackendStorageService();
    }
]);
