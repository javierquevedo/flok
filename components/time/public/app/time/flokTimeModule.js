/**
 * The flokTimeModule is a flok component that helps you track what you work on.
 * @type {module}
 */
angular.module('flokTimeModule', [
    // Angular Core Components:
    'ngSanitize', 'ngMessages',
    // External Components:
    'pascalprecht.translate', 'ui.bootstrap','ui.utils', 'ui.router',
    // flok Components:
    'onRootScope', 'flokFilters', 'flokDirectives', 'flokMenuModule'
]);

/*
 * Configure the task module by registering the route and menu.
 */
angular.module('flokTimeModule').config(['$stateProvider', 'menuServiceProvider', function($stateProvider, menuServiceProvider) {
    'use strict';

    // Register the route
    $stateProvider
        .state('time', {
            url: '/time',
            templateUrl: 'app/time/time.tpl.html',
            controller: 'TimeCtrl',
            controllerAs: 'time'
        })
    ;

    menuServiceProvider.addMenuItem(
        {
            state: 'time',
            name: 'flok.time.title',
            icon: 'tasks'
        }
    );
}]);
