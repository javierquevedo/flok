(function(ENABLED_FLOK_COMPONENTS) {
    'use strict';

    // Define the module dependencies
    var flokDependencies = [
        // Angular Core Components:
        'ngSanitize', 'ngMessages',
        // External Components:
        'pascalprecht.translate', 'ui.bootstrap', 'ui.utils', 'ui.router', 'FBAngular', 'angular-loading-bar',
        // Nothing components
        'nothing.alertModule',
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
    angular.module('flokModule', flokDependencies);

    /**
     * Configure the core modules and their dependencies
     * piwik
     * angular-translate
     */
    angular.module('flokModule').config(['$urlRouterProvider', '$stateProvider', '$httpProvider', '$translateProvider',
        '$locationProvider',
        'alertServiceProvider', 'cfpLoadingBarProvider',
        'defaultComponent', 'piwikProvider', 'piwikConfig', 'menuServiceProvider',
        function($urlRouterProvider, $stateProvider, $httpProvider, $translateProvider, $locationProvider,
            alertServiceProvider, cfpLoadingBarProvider,
            defaultComponent, piwikProvider, piwikConfig, menuServiceProvider) {

            // We want nice URLs without hashes
            $locationProvider.html5Mode(true);

            // No enabled modules:
            if (ENABLED_FLOK_COMPONENTS.length === 0) {
                // Configure Routes
                $stateProvider.state('errorNoModules', {
                    url: '/',
                    templateUrl: 'app/flok/errorNoModules.tpl.html'
                });

                // For any unmatched url, redirect to /
                $urlRouterProvider.otherwise('/');
            }
            else {
                // Configure core Routes
                $stateProvider
                    .state('login', {
                        url: '/login',
                        templateUrl: 'app/user/login.tpl.html'
                    })
                    .state('logout', {
                        url: '/logout',
                        templateUrl: 'app/user/logout.tpl.html'
                    })
                ;

                // For any unmatched url, redirect to default main component
                $urlRouterProvider.otherwise('/' + defaultComponent);
            }

            // Logout menu item
            menuServiceProvider.addMenuItem(
                {
                    state: 'logout',
                    name: 'flok.logout.title',
                    icon: 'signout'
                }
            );

            // Turn off the loading bar spinner
            cfpLoadingBarProvider.includeSpinner = false;
            // Loading bar will only show if it takes at least this many ms (default is 100ms)
            cfpLoadingBarProvider.latencyThreshold = 10;

            // Configure angular translate
            $translateProvider.useStaticFilesLoader({
                prefix: 'locale/',
                suffix: '.json'
            });
            $translateProvider.preferredLanguage('en');

            // Configure alerts to use a custom template:
            alertServiceProvider.setTemplateUrl('app/flok/AlertDisplay.tpl.html');

            // Configure Piwik
            piwikProvider.enableTracking(piwikConfig.enable);
            piwikProvider.setPiwikDomain(piwikConfig.url);
            piwikProvider.setSiteId(piwikConfig.siteId);

            // Interceptor setup (see interceptors.js)
            $httpProvider.interceptors.push('httpErrorCodeInterceptor');
        }
    ]);

})(window.ENABLED_FLOK_COMPONENTS);
