/* global Task, flokModule */
/**
 * Controller for flok Time
 * @module TimeCtrl
 */
flokModule.controller('TimeCtrl', function($scope, $timeout, taskProvider) {
    'use strict';

    // Watch for location changes
    $scope.$watch('location.path()', function(path) {
        // Set if we have to show the trash
        $scope.showTrash = path === '/time/trash';

        // Update the statusFilter on location changes
        $scope.statusFilter = {
            completed: $scope.showTrash
        };
    });

    // TODO: improve the organisation of what functions are called in the view, at the moment it's a mess

    /**
     * The Tasks that time is tracked for
     * @alias module:TimeCtrl
     * @type {Task[]}
     */
    $scope.tasks = taskProvider.tasks;

    /**
     * Stores the total time of all active tasks.
     * @type {number}
     */
    $scope.totalTimeActive = 0;

    /**
     * Stores the total time of all deleted tasks.
     * @type {number}
     */
    $scope.totalTimeDeleted = 0;

    /**
     * Current time and date
     * @alias module:TimeCtrl
     * @type {Date}
     */
    $scope.now = new Date();

    /**
     * New Task input field text
     * @alias module:TimeCtrl
     * @type {string}
     */
    $scope.newTaskName = '';

    /**
     * Adds a task to the list with the name taken from $scope.newTaskName
     * @alias module:TimeCtrl
     */
    $scope.createNewTask = function() {
        // Stop the currently active task
        if ($scope.tasks.length > 0) {
            $scope.tasks[0].stop();
        }

        // Add the new task
        taskProvider.addTask(new Task($scope.newTaskName));

        // Reset the input field
        $scope.newTaskName = '';
    };

    /**
     * Removes the given task from the list
     * @alias module:TimeCtrl
     * @param {Task} task
     */
    $scope.deleteTask = function(task) {
        taskProvider.deleteTask(task);
    };

    /**
     * Mark a task as completed
     * @alias module:TimeCtrl
     * @param {Task} task
     */
    $scope.archiveTask = function(task) {
        taskProvider.archiveTask(task);
    };

    /**
     * Mark a task as incomplete
     * @alias module:TimeCtrl
     * @param {Task} task
     */
    $scope.unArchiveTask = function(task) {
        taskProvider.unArchiveTask(task);
    };

    /**
     * This deletes ALL of the archived tasks.
     * @alias module:TimeCtrl
     */
    $scope.clearArchive = function() {
        taskProvider.clearArchive();
    };

    /**
     * Continuous tracking time for the given task
     * @alias module:TimeCtrl
     * @param {Task} task
     */
    $scope.continueTask = function(task) {
        // Stop the currently active task
        $scope.tasks[0].stop();

        // Continue the given task and move it to the beginning of the list
        task.continue();
        taskProvider.deleteTask(task);
        taskProvider.addTask(task);
    };

    // Watch for changes on the tasks
    $scope.$watch('tasks', function() {
        // TODO: improve watch expression, this persists way too often
        // https://github.com/tastejs/todomvc/blob/gh-pages/architecture-examples/angularjs/js/controllers/todoCtrl.js line 19 might help
        taskProvider.persist();
        $scope.completedCount = taskProvider.trashCount();

        // Update total time of all active tasks and all deleted tasks:
        $scope.totalTimeActive = getTotalTimeActive();
        $scope.totalTimeDeleted = getTotalTimeDeleted();
    }, true);


    // Calculates total time of active tasks.
    function getTotalTimeActive() {
        var time = 0;
        angular.forEach($scope.tasks, function(task) {
            time += !task.isComplete() ? task.totalDuration : 0;
        });
        return time;
    }


    // Calculates total time of active tasks.
    function getTotalTimeDeleted() {
        var time = 0;
        angular.forEach($scope.tasks, function(task) {
            time += task.isComplete() ? task.totalDuration : 0;
        });
        return time;
    }


    /**
     * Angular timeout promise for the main update loop
     */
    var timeout;

    /**
     * Schedules an update of all the tasks in one second
     */
    function scheduleUpdate() {
        timeout = $timeout(function() {
            updateDuration();
            scheduleUpdate();
        }, 1000);
    }

    /**
     * Updates the current time and durations of active tasks
     */
    function updateDuration() {
        $scope.now = new Date();
        if ($scope.tasks.length > 0) {
            $scope.tasks[0].updateDuration($scope.now);
        }
    }

    // Update right now and start the scheduling
    updateDuration();
    scheduleUpdate();
});
