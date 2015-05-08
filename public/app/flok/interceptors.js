angular.module('flokModule').factory('httpErrorCodeInterceptor', [
    '$q', '$location', '$rootScope',
    function($q, $location, $rootScope) {
        'use strict';

        /**
         * Interceptors for handling errors on ajax requests at a low level automatically.
         * @ngdoc filter
         * @constructor
         * @exports flokModule/HttpRequestInterceptor
         */
        var HttpRequestInterceptor = function() {
        };

        /**
         * Error handler
         * @param rejection
         * @returns {*}
         */
        HttpRequestInterceptor.prototype.responseError = function(rejection) {
            // unauthorized, time or never authorized
            if (rejection.status === 401) {
                $rootScope.$emit('flok.backend.unauthorized');
            }
            // Redirect to 404 page when a request 404s
            else if (rejection.status === 404) {
                $location.path('/404');
            }

            // TODO can we add an error message here?
            return $q.reject(rejection);
        };

        return new HttpRequestInterceptor();
    }
]);
