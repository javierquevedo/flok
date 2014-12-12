angular.module('flokTimeModule').factory('taskService', ['$timeout', '$rootScope', 'backendStorageService', 'Task',
    function($timeout, $rootScope, backendStorageService, Task) {
        'use strict';

        /**
         * Services that persists and retrieves Tasks from local storage
         * Key used in the local storage
         * @type {string}
         * @private
         */
        var STORAGE_ID = 'nothingFlokTaskStorage-1';

        /**
         * TODO: document the new parts (persisting to backend)
         * @type {number}
         */
        var PERSIST_BACKEND_DELAY = 1000;

        /**
         * Service that persists and retrives tasks from local storage
         * @copyright  Nothing Interactive 2014
         * @author     Patrick Fiaux <nodz@nothing.ch>
         * @constructor
         * @exports flokTimeModule/taskService
         */
        var TaskService = function() {
        };

        // TODO these need to be refactored as private variables to TaskService:

        /**
         * Tasks storage
         * @type {Task[]}
         * @private
         */
        var tasks = [];

        var _persistToBackendTimeout = null;

        var _lastPlannedDataToPersistToBackend = '';

        var _initialising = true;

        var _currentUser = '';

        var getStorageId = function() {
            return STORAGE_ID + '-' + _currentUser;
        };

        var stringifyTasks = function(tasks) {
            return JSON.stringify(tasks, Task.INCLUDE_IN_JSON);
        };

        var persistToBackend = function(data) {
            // TODO: handle success and error
            backendStorageService.putTime(_currentUser, data);
        };

        var retrieveTasksFor = function(user) {
            _initialising = true;
            _currentUser = user;
            tasks = [];

            // Retrieve the stored tasks
            backendStorageService.getTime(_currentUser)
                .success(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        tasks.push(Task.createFromJSON(data[i]));
                    }
                    _lastPlannedDataToPersistToBackend = stringifyTasks(tasks);
                    _initialising = false;
                })
                .error(function() {
                    var storedTasks = JSON.parse(localStorage.getItem(getStorageId()) || '[]');
                    for (var i = 0; i < storedTasks.length; i++) {
                        tasks.push(Task.createFromJSON(storedTasks[i]));
                    }
                    _initialising = false;
                })
            ;
        };

        TaskService.prototype.retrieveTasksFor = retrieveTasksFor;

        /**
         * The provided Tasks
         * @type {Task[]}
         */
        TaskService.prototype.getTasks = function() {
            return tasks;
        };

        /**
         * Stores the current Tasks in localStorage
         */
        TaskService.prototype.persist = function() {
            if (_initialising) {
                return;
            }
            var stringified = stringifyTasks(tasks);
            localStorage.setItem(getStorageId(), stringified);

            if (_lastPlannedDataToPersistToBackend !== stringified) {
                _lastPlannedDataToPersistToBackend = stringified;
                if (_persistToBackendTimeout) {
                    $timeout.cancel(_persistToBackendTimeout);
                }

                _persistToBackendTimeout = $timeout(function() {
                    persistToBackend(_lastPlannedDataToPersistToBackend);
                }, PERSIST_BACKEND_DELAY);

                // TODO: this should not be done here, but in the backendStorageService (but it isn't called yet)
                $rootScope.$emit('flok.backend.status', 'requesting');
            }

        };

        /**
         * Adds the given Task to the beginning of the list
         * @param {Task} task
         */
        TaskService.prototype.addTask = function(task) {
            tasks.unshift(task);
        };

        /**
         * Removes the given Task from the list
         * @param {Task} task
         */
        TaskService.prototype.deleteTask = function(task) {
            // Search the Task
            for (var i = 0; i < tasks.length; i++) {
                if (tasks[i] === task) {
                    // Remove it and return
                    tasks.splice(i, 1);
                    break;
                }
            }
        };

        /**
         * Deletes all the completed tasks
         */
        TaskService.prototype.deleteCompleted = function() {
            for (var i = 0; i < tasks.length; i++) {
                if (tasks[i].completed) {
                    // Remove it and keep going
                    tasks.splice(i, 1);
                    // Clever messing of the array index since it just go smaller?
                    i--;
                }
            }
        };

        /**
         * Returns the number of currently complete tasks
         * @returns {number}
         */
        TaskService.prototype.completedCount = function() {
            var count = 0;
            for (var i = 0; i < tasks.length; i++) {
                if (tasks[i].completed) {
                    count++;
                }
            }
            return count;
        };

        return new TaskService();
    }
]);
