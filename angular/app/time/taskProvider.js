/* global Task, flokModule */
/**
 * Services that persists and retrieves Tasks from local storage
 */
flokModule.provider('taskProvider', function() {
    'use strict';
    /**
     * Key used in the local storage
     * @type {string}
     * @private
     */
    var STORAGE_ID = 'nothingFlokTaskStorage-1';

    /**
     * Tasks storage
     * @type {Task[]}
     * @private
     */
    this.tasks = [];

    this.$get = function() {
        // Retrieve the stored tasks
        var storedTasks = JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
        for (var i = 0; i < storedTasks.length; i++) {
            this.tasks.push(Task.createFromJSON(storedTasks[i]));
        }

        // Note: for @module to work the variable needs to be named exports
        // see http://usejsdoc.org/tags-exports.html
        /**
         * Services that persists and retrieves Tasks from local storage
         * @module taskProvider
         */
        var exports = {
            /**
             * The provided Tasks
             * @type {Task[]}
             */
            tasks: this.tasks,

            /**
             * Stores the current Tasks in localStorage
             */
            persist: function() {
                localStorage.setItem(STORAGE_ID, JSON.stringify(this.tasks, Task.INCLUDE_IN_JSON));
            },

            /**
             * Adds the given Task to the beginning of the list
             * @param {Task} task
             */
            addTask: function(task) {
                this.tasks.unshift(task);
            },

            /**
             * Removes the given Task from the list
             * @param {Task} task
             */
            deleteTask: function(task) {
                // Search the Task
                for (var i = 0; i < this.tasks.length; i++) {
                    if (this.tasks[i] === task) {
                        // Remove it and return
                        this.tasks.splice(i, 1);
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
                for (var i = 0; i < this.tasks.length; i++) {
                    if (this.tasks[i] === task) {
                        this.tasks[i].completed = true;
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
                for (var i = 0; i < this.tasks.length; i++) {
                    if (this.tasks[i] === task) {
                        this.tasks[i].completed = false;
                        break;
                    }
                }
            },

            /**
             * Clears up the archive
             */
            clearArchive: function() {
                for (var i = 0; i < this.tasks.length; i++) {
                    if (this.tasks[i].completed) {
                        // Remove it and keep going
                        this.tasks.splice(i, 1);
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
                for (var i = 0; i < this.tasks.length; i++) {
                    if (this.tasks[i].completed) {
                        count++;
                    }
                }
                return count;
            }
        };

        return exports;
    };
});

