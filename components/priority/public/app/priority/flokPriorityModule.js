(function() {
    'use strict';

    /**
     * The flokPriorityModule is a flok component to organise your task list.
     * @type {module}
     */
    var flokPriorityModule = angular.module('flokPriorityModule', [
        'ngRoute',
        'ui.bootstrap', 'ui.utils', 'ui.sortable', 'pascalprecht.translate', 'onRootScope',
        'flokFilters', 'flokDirectives', 'flokMenuModule'
    ]);

    flokPriorityModule.config(['$routeProvider', 'menuServiceProvider', function($routeProvider, menuServiceProvider) {
        $routeProvider
            .when('/priority', {
                templateUrl: 'app/priority/priority.tpl.html'
            })
        ;

        menuServiceProvider.addMenuItem(
            {
                url: '/priority',
                name: 'flok.priority.title',
                icon: 'list'
            }
        );
    }]);
})();
