'use strict';
/**
 * taskService tests
 */
/*global describe, beforeEach, it, assert */

describe('taskService', function() {
    var taskService;

    // before each
    beforeEach(function() {
        angular.mock.module('flokModule');
    });

    beforeEach(angular.mock.inject(function($rootScope, $injector) {
        taskService = $injector.get('taskService');
    }));

    it('has tasks', function() {
        var tasks = taskService.getTasks();
        assert.typeOf(tasks, 'array', 'tasks is an array');
        assert.lengthOf(tasks, 0, 'tasks is empty');
    });

    var taskName = 'task1';
    it('can add task', function() {
        var tasks = taskService.getTasks();
        taskService.addTask(taskName);
        assert.lengthOf(tasks, 1, 'task was added');
        assert.equal(tasks[0], taskName, 'correct tasks was stored');
    });

    it('can remove task', function() {
        taskService.deleteTask(taskName);
        assert.lengthOf(taskService.getTasks(), 0, 'task was removed');
    });

    // TODO: complete tests
});
