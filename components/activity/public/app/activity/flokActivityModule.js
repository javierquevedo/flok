/**
 * Activity module, can show a stream of events.
 * @copyright  Nothing Interactive 2014
 * @type {module}
 * @exports flokActivityModule
 */
angular.module('flokActivityModule', [
    // Angular Core Components:
    'ngSanitize', 'ngMessages',
    // External Components:
    'pascalprecht.translate', 'ui.bootstrap','ui.utils', 'ui.router',
    // flok Components:
    'onRootScope', 'flokFilters', 'flokDirectives', 'flokMenuModule'
]);

/**
 * Stream output format for activity datetime.
 * @constant flokActivityModule/streamCtrl
 */
angular.module('flokActivityModule').constant('STREAM_DATE_FORMAT', 'MMM d @ HH:mm');

/**
 * Activity Module configuration
 */
angular.module('flokActivityModule').config(['$stateProvider', 'menuServiceProvider', function($stateProvider, menuServiceProvider) {
    'use strict';

    // Register the route
    $stateProvider
        .state('activity', {
            url: '/activity',
            templateUrl: 'app/activity/stream.tpl.html',
            controller: 'StreamCtrl',
            controllerAs: 'stream'
        })
    ;

    // Register the menu item
    menuServiceProvider.addMenuItem(
        {
            state: 'activity',
            name: 'flok.activity.title',
            icon: 'user'
        }
    );
}]);

