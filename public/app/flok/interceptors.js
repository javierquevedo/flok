angular.module('flokModule').factory('httpErrorCodeInterceptor', ['$q', '$location',
    function($q, $location) {
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
                console.log('woot');
                
                // TODO show alert message
                $location.path('/login');
                return $q.reject(rejection);
            }
            // Redirect to 404 page when a request 404s
            else if (rejection.status === 404) {
                $location.path('/404');
                return $q.reject(rejection);
            }
            // all others, pass the error on
            return rejection;
        };


        return new HttpRequestInterceptor();
    }
]);
