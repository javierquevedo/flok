/* exported flokModule */
(function() {
    'use strict';

    /**
     * The nothingFlok utility module. This module has no functionality, it
     * simply defines all the dependencies and configures Angular.
     *
     * @exports flokModule
     */
    var flokModule = angular.module('flokModule',
        ['ui.bootstrap', 'ui.utils', 'flokFilters', 'flokDirectives', 'piwikAnalyticsModule', 'localization'],
        function($routeProvider, localizeProvider, localePathConst) {
            $routeProvider
                .when('/time', {
                    templateUrl: 'tpl/time/time.tpl.html',
                    controller: 'TimeCtrl',
                    controllerAs: 'time'
                })
                .when('/time/trash', {
                    templateUrl: 'tpl/time/time.tpl.html',
                    controller: 'TimeCtrl',
                    controllerAs: 'time'
                })
                .otherwise({
                    redirectTo: '/time'
                })
            ;

            // Configure localization
            localizeProvider.setResourcePath(localePathConst);
        }
    );

    /**
     * Main controller of the project
     * @module AppCtrl
     */
    flokModule.controller('AppCtrl', function($scope, $location) {
        // Make the location available in the scope
        /**
         * Angular $location service
         * @alias module:AppCtrl
         */
        $scope.location = $location;

        // Set the content to loaded when the localization says it's done
        $scope.$on('localizeResourcesUpdates', function() {
            $scope.contentLoaded = true;
        });

        // Id under which the app lock is stored in the local storage
        var APP_LOCK_ID = 'nothingFlokLock';

        /**
         * Resets the app lock (to allow the application to be open only once in
         * one browser)
         * @alias module:AppCtrl
         * @param {boolean} [reload=false] Whether to reload the whole app after
         */
        $scope.resetLock = function(reload) {
            localStorage.setItem(APP_LOCK_ID, '0');
            if (reload === true) {
                window.location.reload();
            }
        };

        // Check if the application is already loaded in another browser window
        if (localStorage.getItem(APP_LOCK_ID) === '1') {
            // Stop right now, application is already open.
            $scope.locked = true;
            return;
        }

        // Lock the application now
        localStorage.setItem(APP_LOCK_ID, '1');
        window.onbeforeunload = function() {
            // Unlock when closing the app
            $scope.resetLock();
        };
    });


    window.flokModule = flokModule;
})();
