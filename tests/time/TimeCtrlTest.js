'use strict';
/**
 * TimeCtrl tests
 */
/*global suite, setup, test, assert */
/*global angular, Task */
suite('TimeCtrl', function() {
    var $scope;

    // Before each, load the angular module
    setup(function() {
        angular.mock.module('flokModule');
    });

    // Inject the TimeCtrl
    setup(angular.mock.inject(function($rootScope, $controller) {
        $scope = $rootScope.$new();
        $controller('TimeCtrl', {$scope: $scope});
    }));

    test('initialises correctly', function() {
        assert.typeOf($scope.tasks, 'array', 'tasks is an array');
        assert.lengthOf($scope.tasks, 0, 'tasks is empty');

        assert.equal($scope.newTaskName, '', 'new task name is empty');

        assert.isFunction($scope.createNewTask, 'has createNewTask function');
        assert.isFunction($scope.deleteTask, 'has deleteTask function');
        assert.isFunction($scope.archiveTask, 'has archiveTask function');
        assert.isFunction($scope.unArchiveTask, 'has unArchiveTask function');
        assert.isFunction($scope.clearArchive, 'has clearArchive function');
        assert.isFunction($scope.continueTask, 'has continueTask function');

        // TODO: these tests should go in a new test() call, but it doesn't work, see below
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

//    test('can add new task', function () {
//        TODO: somehow the $scope is undefined here...
//    });

});
