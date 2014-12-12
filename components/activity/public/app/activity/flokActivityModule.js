/**
 * Activity Module
 *
 * @copyright  Nothing Interactive 2014
 */
(function() {
    'use strict';

    /**
     * Activity module, can show a stream of events.
     * @type {module}
     */
    var flokActivityModule = angular.module('flokActivityModule', [
        // Angular core dependencies:
        'ngRoute', 'ngSanitize',
        // 3rd Party Dependencies
        'ui.bootstrap', 'ui.utils', 'pascalprecht.translate', 'onRootScope',
        // Flok dependencies
        'flokFilters', 'flokDirectives', 'flokMenuModule'
    ]);

    flokActivityModule.config(['$routeProvider', 'menuServiceProvider', function($routeProvider, menuServiceProvider) {
        $routeProvider
            .when('/activity', {
                templateUrl: 'app/activity/stream.tpl.html',
                controller: 'StreamCtrl',
                controllerAs: 'stream'
            })
        ;

        menuServiceProvider.addMenuItem(
            {
                url: '/activity',
                name: 'flok.activity.title',
                icon: 'user'
            }
        );
    }]);
})();

