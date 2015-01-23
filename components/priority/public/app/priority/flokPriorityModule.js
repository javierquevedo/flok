(function() {
    'use strict';

    /**
     * The flokPriorityModule is a flok component to organise your task list.
     * @type {module}
     */
    var flokPriorityModule = angular.module('flokPriorityModule', [
        // Angular Core Components:
        'ngSanitize', 'ngMessages',
        // External Components:
        'pascalprecht.translate', 'ui.bootstrap', 'ui.sortable', 'ui.utils', 'ui.router',
        // flok Components:
        'onRootScope',
        'flokFilters', 'flokDirectives', 'flokMenuModule'
    ]);

    flokPriorityModule.config(['$stateProvider', 'menuServiceProvider', function($stateProvider, menuServiceProvider) {

        $stateProvider.state('priority', {
            url: '/priority',
            templateUrl: 'app/priority/priority.tpl.html'
        });

        menuServiceProvider.addMenuItem(
            {
                state: 'priority',
                name: 'flok.priority.title',
                icon: 'list'
            }
        );
    }]);
})();
