/**
 * Controller for flok Time
 * @module flokTimeModule/TimeCtrl
 */
angular.module('flokTimeModule').controller('TimeCtrl', [
    '$scope', '$timeout', 'sessionService', 'taskService', 'Task',
    function($scope, $timeout, sessionService, taskService, Task) {
        'use strict';

        /**
         * Whether to show all tasks or only uncompleted ones
         * @type {boolean}
         */
        $scope.showAll = false;

        sessionService.getUser().then(function(user) {
            taskService.retrieveTasksFor(user);
        });

        // TODO: improve the organisation of what functions are called in the view, at the moment it's a mess

        /**
         * The Tasks that time is tracked for
         * @alias module:TimeCtrl
         * @type {Task[]}
         */
        $scope.tasks = taskService.getTasks();

        /**
         * Stores the total time of all uncompleted tasks.
         * @type {number}
         */
        $scope.totalTimeUncompleted = 0;

        /**
         * Stores the total time of all completed tasks.
         * @type {number}
         */
        $scope.totalTimeCompleted = 0;

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
         * Returns the filter to be used for the tasks
         * @returns {*}
         */
        $scope.getStatusFilter = function() {
            if ($scope.showAll) {
                return {};
            }
            return {
                completed: false
            };
        };

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
            // TODO task dependency might not be needed here service could handle it.
            taskService.addTask(new Task($scope.newTaskName));

            // Reset the input field
            $scope.newTaskName = '';
        };

        /**
         * This deletes ALL of the completed tasks.
         * @alias module:TimeCtrl
         */
        $scope.deleteCompleted = function() {
            taskService.deleteCompleted();
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
            taskService.deleteTask(task);
            taskService.addTask(task);
        };

        // Watch for changes on the tasks
        $scope.$watch('tasks', function() {
            // TODO: improve watch expression, this persists way too often
            // https://github.com/tastejs/todomvc/blob/gh-pages/architecture-examples/angularjs/js/controllers/todoCtrl.js line 19 might help
            taskService.persist();
            $scope.completedCount = taskService.completedCount();

            // Update total time of all completed and uncompleted tasks:
            $scope.totalTimeUncompleted = getTotalTimeUncompleted();
            $scope.totalTimeCompleted = getTotalTimeCompleted();
        }, true);


        // Calculates total time of uncompleted tasks.
        function getTotalTimeUncompleted() {
            var time = 0;
            angular.forEach($scope.tasks, function(task) {
                time += !task.completed ? task.totalDuration : 0;
            });
            return time;
        }

        // Calculates total time of completed tasks
        function getTotalTimeCompleted() {
            var time = 0;
            angular.forEach($scope.tasks, function(task) {
                time += task.completed ? task.totalDuration : 0;
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
    }
]);
