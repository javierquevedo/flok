angular.module('flokModule').factory('httpErrorCodeInterceptor', [
    '$q', '$location', '$rootScope', '$translate',
    function($q, $location, $rootScope, $translate) {
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

            // Try to read out the error sent by the backend
            var error = (rejection.data && rejection.data.error) ||
                $translate.instant('flok.error.default');
            return $q.reject(error);
        };

        return new HttpRequestInterceptor();
    }
]);
