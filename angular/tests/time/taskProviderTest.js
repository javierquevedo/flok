'use strict';
/**
 * taskProvider tests
 */
/* global suite, setup, test, assert */
suite('taskProvider', function() {
    var taskProvider;

    // before each
    setup(function() {
        angular.mock.module('flokModule');
    });

    setup(angular.mock.inject(function($rootScope, $injector) {
        taskProvider = $injector.get('taskProvider');
    }));

    test('has tasks', function() {
        var tasks = taskProvider.tasks;
        assert.typeOf(tasks, 'array', 'tasks is an array');
        assert.lengthOf(tasks, 0, 'tasks is empty');
    });

    var taskName = 'task1';
    test('can add task', function() {
        var tasks = taskProvider.tasks;
        taskProvider.addTask(taskName);
        assert.lengthOf(tasks, 1, 'task was added');
        assert.equal(tasks[0], taskName, 'correct tasks was stored');
    });

    test('can remove task', function() {
        taskProvider.deleteTask(taskName);
        assert.lengthOf(taskProvider.tasks, 0, 'task was removed');
    });

    // TODO: complete tests
});
