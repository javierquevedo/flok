/**
 * Activity module, can show a stream of events.
 * @copyright  Nothing Interactive 2014
 * @type {module}
 * @exports flokActivityModule
 */
angular.module('flokActivityModule', [
    // Angular core dependencies:
    'ngRoute', 'ngSanitize',
    // 3rd Party Dependencies
    'ui.bootstrap', 'ui.utils', 'pascalprecht.translate', 'onRootScope',
    // Flok dependencies
    'flokFilters', 'flokDirectives', 'flokMenuModule'
]);

/**
 * Stream output format for activity datetime.
 * @constant flokActivityModule/streamCtrl
 */
angular.module('flokActivityModule').constant('STREAM_DATE_FORMAT', 'MMM d @ HH:mm');

/**
 * Activity Module configuration
 */
angular.module('flokActivityModule').config(['$routeProvider', 'menuServiceProvider', function($routeProvider, menuServiceProvider) {
    'use strict';

    // Register the route
    $routeProvider
        .when('/activity', {
            templateUrl: 'app/activity/stream.tpl.html',
            controller: 'StreamCtrl',
            controllerAs: 'stream'
        })
    ;

    // Register the menu item
    menuServiceProvider.addMenuItem(
        {
            url: '/activity',
            name: 'flok.activity.title',
            icon: 'user'
        }
    );
}]);

