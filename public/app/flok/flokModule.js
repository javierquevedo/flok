/* exported flokModule */
(function(ENABLED_FLOK_COMPONENTS) {
    'use strict';

    // Define the module dependencies
    var flokDependencies = [
        // Angular Core Components:
        'ngRoute',
        // External Components:
        'pascalprecht.translate', 'ui.bootstrap', 'ui.utils',
        // flok Components:
        'onRootScope', 'flokFilters', 'flokDirectives', 'angularPiwik', 'flokMenuModule'
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
    var flokModule = angular.module('flokModule', flokDependencies);

    /**
     * Configure the core modules and their dependencies
     * piwik
     * angular-translate
     */
    flokModule.config(['$routeProvider', '$httpProvider', '$translateProvider',
        'defaultComponent', 'piwikProvider', 'piwikConfig', 'menuServiceProvider',
        function($routeProvider, $httpProvider, $translateProvider, defaultComponent, piwikProvider, piwikConfig, menuServiceProvider) {
            // No enabled modules:
            if (ENABLED_FLOK_COMPONENTS.length === 0) {
                // Configure Routes
                $routeProvider
                    .when('/', {
                        templateUrl: 'app/flok/errorNoModules.tpl.html'
                    })
                    .otherwise({
                        redirectTo: '/'
                    })
                ;
            }
            else {
                // Configure Routes
                $routeProvider
                    .when('/login', {
                        templateUrl: 'app/user/login.tpl.html'
                    })
                    .when('/logout', {
                        templateUrl: 'app/user/logout.tpl.html'
                    })
                    .otherwise({
                        redirectTo: '/' + defaultComponent
                    })
                ;
            }

            // Logout menu item
            menuServiceProvider.addMenuItem(
                {
                    url: '/logout',
                    name: 'flok.logout.title',
                    icon: 'signout'
                }
            );

            // Configure angular translate
            $translateProvider.useStaticFilesLoader({
                prefix: 'locale/',
                suffix: '.json'
            });
            $translateProvider.preferredLanguage('en');

            // Configure Piwik
            piwikProvider.enableTracking(piwikConfig.enable);
            piwikProvider.setPiwikDomain(piwikConfig.url);
            piwikProvider.setSiteId(piwikConfig.siteId);

            // Interceptor setup (see interceptors.js)
            $httpProvider.interceptors.push('httpErrorCodeInterceptor');
        }
    ]);

    /**
     * Main controller of the project
     * TODO: move to a separate file
     * @module AppCtrl
     */
    flokModule.controller('AppCtrl', [
        '$scope', 'menuService', 'sessionService',
        function($scope, menuService, sessionService) {
            $scope.contentLoaded = true;
            // Set the content to loaded when the localization says it's done
            // TODO $translateLoadingSuccess isn't called but content is translated
            //$scope.$on('$translateLoadingSuccess', function() {
            //    $scope.contentLoaded = true;
            //});

            // Bind to the status of the backend
            $scope.backendStatus = '';
            $scope.$onRootScope('flok.backend.status', function(event, newStatus) {
                $scope.backendStatus = newStatus;
            });

            // Expose whether we have a valid session
            $scope.hasValidSession = sessionService.hasValidSession.bind(sessionService);

            $scope.menuItems = menuService.getMenuItems();
        }
    ]);

    window.flokModule = flokModule;
})(window.ENABLED_FLOK_COMPONENTS);
