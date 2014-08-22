(function() {
    'use strict';

    /**
     * The flokTodoModule is a flok component to organise your task list.
     * @type {module}
     */
    var flokTodoModule = angular.module('flokTodoModule',
        ['ngRoute', 'ui.bootstrap', 'ui.utils', 'flokFilters', 'flokDirectives', 'flokMenuModule', 'localization', 'onRootScope'],
        function($routeProvider) {
            $routeProvider
                .when('/todo', {
                    templateUrl: 'app/todo/todo.tpl.html'
                })
            ;
        }
    );

    flokTodoModule.config(['menuServiceProvider', function(menuServiceProvider) {
        menuServiceProvider.addMenuItem(
            {
                url: '/todo',
                name: 'Todo',
                icon: 'list'
            }
        );
    }]);
})();
