angular.module('flokActivityModule').factory('streamBackendStorageService', ['$http', 'backendUrl',
    function($http, backendUrl) {
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
            return $http.get(backendUrl + '/activity');
        };

        return new StreamBackendStorageService();
    }
]);
