(function() {
    'use strict';

    /**
     * The flokTodoModule is a flok component to organise your task list.
     * @type {module}
     */
    var flokTodoModule = angular.module('flokTodoModule', [
        'ngRoute', 'ui.bootstrap', 'ui.utils', 'ui.sortable',
        'localization', 'onRootScope',
        'flokFilters', 'flokDirectives', 'flokMenuModule'
    ]);

    flokTodoModule.config(['$routeProvider', 'menuServiceProvider', function($routeProvider, menuServiceProvider) {
        $routeProvider
            .when('/todo', {
                templateUrl: 'app/todo/todo.tpl.html'
            })
        ;

        menuServiceProvider.addMenuItem(
            {
                url: '/todo',
                name: 'Todo',
                icon: 'list'
            }
        );
    }]);
})();
