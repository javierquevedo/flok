/**
 * A backend service provider for the time component. Allows interaction with the backend
 * without knowing about the details
 *
 * Main methods provided:
 *
 *
 * @copyright  Nothing Interactive 2014
 * @author     Patrick Fiaux <nodz@nothing.ch>
 * @author     Marc Gruber <rune@nothing.ch>
 * @author     Tobias Leugger <vibes@nothing.ch>
 *
 */
(function() {
    'use strict';

    /**
     * Interface with the backend
     *
     * @module backendStorageService
     */
    angular.module('flokTimeModule').provider('backendStorageService', function() {
        var $http;
        var $rootScope;
        var backendUrl;

        // TODO: wrap all $http requests in a function to set the backend status correctly

        var getTime = function(user) {
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

        var putTime = function(user, data) {
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

        /**
         * Returns this service
         */
        this.$get = ['$http', '$rootScope', 'backendUrl', function(_$http_, _$rootScope_, _backendUrl_) {
            $http = _$http_;
            $rootScope = _$rootScope_;
            backendUrl = _backendUrl_;

            return {
                getTime: getTime,
                putTime: putTime
            };
        }];
    });
})();
