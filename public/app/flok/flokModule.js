(function(ENABLED_FLOK_COMPONENTS) {
    'use strict';

    // Define the module dependencies
    var flokDependencies = [
        // Angular Core Components:
        'ngSanitize', 'ngMessages', 'ngRoute', // TODO remove route
        // External Components:
        'pascalprecht.translate', 'ui.bootstrap', 'ui.utils', 'ui.router',
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
    angular.module('flokModule').config(['$routeProvider', '$httpProvider', '$translateProvider',
        'defaultComponent', 'piwikProvider', 'piwikConfig', 'menuServiceProvider',
        function($routeProvider, $httpProvider, $translateProvider, defaultComponent, piwikProvider, piwikConfig, menuServiceProvider) {

            // We want nice URLs without hashes
            //$locationProvider.html5Mode(true);

            // For any unmatched url, redirect to /
            //$urlRouterProvider.otherwise('/404');

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

                // Set up global states
                $stateProvider
                    .state('home', {
                        url: '/',
                        ncyBreadcrumb: {
                            label: 'home.index'
                        },
                        templateUrl: 'angular/cockpit/startPage/startPage.tpl.html'
                    })
                    .state('404', {
                        url: '/404',
                        templateUrl: 'angular/cockpit/errors/404.tpl.html'
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

})(window.ENABLED_FLOK_COMPONENTS);
