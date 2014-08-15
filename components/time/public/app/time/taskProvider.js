/* global Task */
/**
 * Services that persists and retrieves Tasks from local storage
 */
angular.module('flokTimeModule').provider('taskProvider', function() {
    'use strict';
    /**
     * Key used in the local storage
     * @type {string}
     * @private
     */
    var STORAGE_ID = 'nothingFlokTaskStorage-1';

    // TODO: document the new parts (persisting to backend)

    var PERSIST_BACKEND_DELAY = 1000;

    var backendStorageService;
    var $rootScope;

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
        console.log('Persisting to backend');
        backendStorageService.putTime(_currentUser, data)
            .success(function() {
                console.log('Successfully persisted to backend');
            })
            .error(function() {
                console.log('Failed to persisted to backend');
            })
        ;
    };

    var retrieveTasksFor = function(user) {
        _initialising = true;
        _currentUser = user;
        tasks = [];

        console.log('Retrieving data for ' + user);

        // Retrieve the stored tasks
        backendStorageService.getTime(_currentUser)
            .success(function(data) {
                console.log('Successfully retrieved data from backend');
                for (var i = 0; i < data.length; i++) {
                    tasks.push(Task.createFromJSON(data[i]));
                }
                _lastPlannedDataToPersistToBackend = stringifyTasks(tasks);
                _initialising = false;
            })
            .error(function() {
                console.log('Failed to load data from server, using localStorage instead');
                var storedTasks = JSON.parse(localStorage.getItem(getStorageId()) || '[]');
                for (var i = 0; i < storedTasks.length; i++) {
                    tasks.push(Task.createFromJSON(storedTasks[i]));
                }
                _initialising = false;
            })
        ;
    };

    this.$get = ['$timeout', '$rootScope', 'backendStorageService', function($timeout, _$rootScope_, _backendStorageService_) {
        backendStorageService = _backendStorageService_;
        $rootScope = _$rootScope_;

        // Note: for @module to work the variable needs to be named exports
        // see http://usejsdoc.org/tags-exports.html
        /**
         * Services that persists and retrieves Tasks from local storage
         * @module taskProvider
         */
        var exports = {
            retrieveTasksFor: retrieveTasksFor,

            /**
             * The provided Tasks
             * @type {Task[]}
             */
            getTasks: function() {
                return tasks;
            },

            /**
             * Stores the current Tasks in localStorage
             */
            persist: function() {
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

            },

            /**
             * Adds the given Task to the beginning of the list
             * @param {Task} task
             */
            addTask: function(task) {
                tasks.unshift(task);
            },

            /**
             * Removes the given Task from the list
             * @param {Task} task
             */
            deleteTask: function(task) {
                // Search the Task
                for (var i = 0; i < tasks.length; i++) {
                    if (tasks[i] === task) {
                        // Remove it and return
                        tasks.splice(i, 1);
                        break;
                    }
                }
            },

            /**
             * Marks a task a complete
             * @param {Task} task
             */
            archiveTask: function(task) {
                // Search the Task
                for (var i = 0; i < tasks.length; i++) {
                    if (tasks[i] === task) {
                        tasks[i].completed = true;
                        break;
                    }
                }
            },

            /**
             * Resurect a task, bring it back from the dead,
             * this could be called zombify! only use full as an
             * undo?
             * @param {Task} task
             */
            unArchiveTask: function(task) {
                // Search the Task
                for (var i = 0; i < tasks.length; i++) {
                    if (tasks[i] === task) {
                        tasks[i].completed = false;
                        break;
                    }
                }
            },

            /**
             * Clears up the archive
             */
            clearArchive: function() {
                for (var i = 0; i < tasks.length; i++) {
                    if (tasks[i].completed) {
                        // Remove it and keep going
                        tasks.splice(i, 1);
                        // Clever messing of the array index since it just go smaller?
                        i--;
                    }
                }
            },

            /**
             * Returns the number of currently complete tasks
             * @returns {number}
             */
            trashCount: function() {
                var count = 0;
                for (var i = 0; i < tasks.length; i++) {
                    if (tasks[i].completed) {
                        count++;
                    }
                }
                return count;
            }
        };

        return exports;
    }];
});

