/**
 * The flokTimeModule is a flok component that helps you track what you work on.
 * @type {module}
 */
angular.module('flokTimeModule', [
    'ngRoute',
    'ui.bootstrap', 'ui.utils', 'pascalprecht.translate', 'onRootScope',
    'flokModule', 'flokFilters', 'flokDirectives', 'flokMenuModule'
]);

/*
 * Configure the task module by registering the route and menu.
 */
angular.module('flokTimeModule').config(['$routeProvider', 'menuServiceProvider', function($routeProvider, menuServiceProvider) {
    'use strict';

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
            name: 'flok.time.title',
            icon: 'tasks'
        }
    );
}]);
