'use strict';
/**
 * taskProvider tests
 */
/*global describe, beforeEach, it, assert */

describe('taskProvider', function() {
    var taskProvider;

    // before each
    beforeEach(function() {
        angular.mock.module('flokModule');
    });

    beforeEach(angular.mock.inject(function($rootScope, $injector) {
        taskProvider = $injector.get('taskProvider');
    }));

    it('has tasks', function() {
        var tasks = taskProvider.getTasks();
        assert.typeOf(tasks, 'array', 'tasks is an array');
        assert.lengthOf(tasks, 0, 'tasks is empty');
    });

    var taskName = 'task1';
    it('can add task', function() {
        var tasks = taskProvider.getTasks();
        taskProvider.addTask(taskName);
        assert.lengthOf(tasks, 1, 'task was added');
        assert.equal(tasks[0], taskName, 'correct tasks was stored');
    });

    it('can remove task', function() {
        taskProvider.deleteTask(taskName);
        assert.lengthOf(taskProvider.getTasks(), 0, 'task was removed');
    });

    // TODO: complete tests
});
