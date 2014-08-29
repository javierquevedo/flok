(function() {
    'use strict';

    /**
     * The flokTimeModule is a flok component that helps you track what you work on.
     * @type {module}
     */
    var flokTimeModule = angular.module('flokTimeModule', [
        'ngRoute', 'ui.bootstrap', 'ui.utils',
        'localization', 'onRootScope',
        'flokFilters', 'flokDirectives', 'flokMenuModule'
    ]);

    flokTimeModule.config(['$routeProvider', 'menuServiceProvider', function($routeProvider, menuServiceProvider) {
        $routeProvider
            .when('/time/:user', {
                templateUrl: 'app/time/time.tpl.html',
                controller: 'TimeCtrl',
                controllerAs: 'time'
            })
            .when('/time/trash/:user', {
                templateUrl: 'app/time/time.tpl.html',
                controller: 'TimeCtrl',
                controllerAs: 'time'
            })
        ;

        menuServiceProvider.addMenuItem(
            {
                url: '/time/User',
                name: 'Time',
                icon: 'tasks'
            }
        );
    }]);
})();
