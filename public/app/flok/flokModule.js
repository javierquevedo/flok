/* exported flokModule */
(function(ENABLED_FLOK_COMPONENTS) {
    'use strict';

    // Define the module dependencies
    var flokDependencies = [
        'ngRoute', 'ui.bootstrap', 'ui.utils', 'localization', 'onRootScope',
        'flokFilters', 'flokDirectives', 'angularPiwik', 'flokMenuModule'
    ];

    // Add the enabled components' module
    for (var i = 0; i < ENABLED_FLOK_COMPONENTS.length; i++) {
        var comp = ENABLED_FLOK_COMPONENTS[i];

        // Upper case first letter
        comp = comp.charAt(0).toUpperCase() + comp.substr(1);
        flokDependencies.push('flok' + comp + 'Module');
    }

    /**
     * The nothingFlok utility module. This module has no functionality, it
     * simply defines all the dependencies and configures Angular.
     *
     * @exports flokModule
     */
    var flokModule = angular.module('flokModule', flokDependencies,
        function($routeProvider, localizeProvider, localePathConst) {
            $routeProvider
                .when('/', {
                    templateUrl: 'app/flok/home.tpl.html'
                })
                .otherwise({
                    redirectTo: '/'
                })
            ;

            // Configure localization
            localizeProvider.setResourcePath(localePathConst);
        }
    );

    // Configure piwik
    flokModule.config(function(piwikProvider, piwikConfig) {
        piwikProvider.enableTracking(piwikConfig.enable);
        piwikProvider.setPiwikDomain(piwikConfig.url);
        piwikProvider.setSiteId(piwikConfig.siteId);
    });

    /**
     * Main controller of the project
     * @module AppCtrl
     */
    flokModule.controller('AppCtrl', ['$scope', '$location', 'menuService', function($scope, $location, menuService) {
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

        // Bind to the status of the backend
        $scope.backendStatus = '';
        $scope.$onRootScope('flok.backend.status', function(event, newStatus) {
            $scope.backendStatus = newStatus;
        });

        $scope.menuItems = menuService.getMenuItems();
    }]);

    window.flokModule = flokModule;
})(window.ENABLED_FLOK_COMPONENTS);
