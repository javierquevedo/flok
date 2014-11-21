/**
 * TODO
 *
 */
(function() {
    'use strict';

    /**
     * Interface with the backend
     *
     * @module backendStorageService
     */
    angular.module('flokActivityModule').provider('streamBackendStorageService', function() {
        var $http;
        var $rootScope;
        var backendUrl;

        var getStream = function() {
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

        /**
         * Returns this service
         */
        this.$get = ['$http', '$rootScope', 'backendUrl', function(_$http_, _$rootScope_, _backendUrl_) {
            $http = _$http_;
            $rootScope = _$rootScope_;
            backendUrl = _backendUrl_;

            return {
                getStream: getStream
            };
        }];
    });
})();
