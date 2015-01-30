/**
 * TimeCtrl tests
 */
/*global describe, beforeEach, it, assert */
describe('TimeCtrl', function() {
    'use strict';

    var $scope;
    var Task;

    // Before each, load the angular module
    beforeEach(function() {
        angular.mock.module('flokModule', 'flokTimeModule');
    });

    // Inject the TimeCtrl
    beforeEach(angular.mock.inject(function(_$rootScope_, _$controller_, _Task_) {
        Task = _Task_;
        $scope = _$rootScope_.$new();
        _$controller_('TimeCtrl', {$scope: $scope});
    }));

    it('initialises correctly', function() {
        assert.typeOf($scope.tasks, 'array', 'tasks is an array');
        assert.lengthOf($scope.tasks, 0, 'tasks is empty');

        assert.equal($scope.newTaskName, '', 'new task name is empty');

        assert.isFunction($scope.createNewTask, 'has createNewTask function');
        assert.isFunction($scope.deleteCompleted, 'has deleteCompleted function');
        assert.isFunction($scope.continueTask, 'has continueTask function');

        // TODO: these tests should go in a new it() call, but it doesn't work, see below

        var newTaskName = 'New Task';
        $scope.newTaskName = newTaskName;
        $scope.createNewTask();

        assert.equal($scope.newTaskName, '', 'new task name was reset');
        assert.lengthOf($scope.tasks, 1, 'task was added');

        var addedTask = $scope.tasks[0];
        assert.instanceOf(addedTask, Task, 'Task instance was created');
        assert.equal(addedTask.name, newTaskName, 'name was set correctly');
        assert.isTrue(addedTask.isActive(), 'new task is active');

        // TODO: complete tests
    });

//    it('can add new task', function () {
//        TODO: somehow the $scope is undefined here...
//    });

});
