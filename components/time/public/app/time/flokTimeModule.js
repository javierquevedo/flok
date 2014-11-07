(function() {
    'use strict';

    /**
     * The flokTimeModule is a flok component that helps you track what you work on.
     * @type {module}
     */
    var flokTimeModule = angular.module('flokTimeModule', [
        'ngRoute',
        'ui.bootstrap', 'ui.utils', 'pascalprecht.translate', 'onRootScope',
        'flokModule', 'flokFilters', 'flokDirectives', 'flokMenuModule'
    ]);

    flokTimeModule.config(['$routeProvider', 'menuServiceProvider', function($routeProvider, menuServiceProvider) {
        $routeProvider
            .when('/time', {
                templateUrl: 'app/time/time.tpl.html',
                controller: 'TimeCtrl',
                controllerAs: 'time'
            })
        ;

        menuServiceProvider.addMenuItem(
            {
                url: '/time',
                name: 'Time',
                icon: 'tasks'
            }
        );
    }]);
})();
