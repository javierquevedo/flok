/* global durationUtil */
/* exported Task */
(/** @lends <global> */function() {
    'use strict';

    /**
     * Represents a task for which time is tracked.
     * @param {string} [name=''] Name of this task
     * @param {number} [pastDuration=0] Sum of total time excluding lastTime
     * @param {Date} [startTime=new Date()] When this Task was last started
     * @param {Date} [endTime=undefined] When this Task last ended, if not
     *      defined, the Task is currently active
     * @param {number} [totalManualChange=0] Manual time change in ms
     * @param {boolean} [completed=false] completed or not
     * @class
     * @global
     * @constructor
     */
    function Task(name, pastDuration, startTime, endTime, totalManualChange, completed) {
        /**
         * Name of this task
         * @type {string}
         */
        this.name = name || '';

        /**
         * Total duration of this task in milliseconds
         * @type {number}
         */
        this.totalDuration = 0;

        /**
         * Total duration of this task before the current time span
         * @type {number}
         */
        this.pastDuration = pastDuration || 0;

        /**
         * When this Task last started
         * @type {Date}
         */
        this.startTime = startTime || new Date();

        /**
         * When this Task last stopped. If undefined: is active at the moment
         * @type {Date}
         */
        this.endTime = endTime;

        /**
         * Manual change to the duration of this task in ms
         * @type {number}
         */
        this.totalManualChange = totalManualChange || 0;

        /**
         * Whether this task is currently being edited
         * @type {boolean}
         */
        this.editing = false;

        /**
         * Tracks if the task is complete (archived/committed) or not
         * @type {boolean}
         */
        this.completed = completed || false;

        /**
         * The manual time input as a string when task is being edited.
         * @type {String}
         */
        this.manualChangeInputString = '';

        // Update the totalDuration
        this.updateDuration();
    }

    /**
     * Creates a Task from it's JSON representation
     * @param {JSON} definition
     * @returns {Task}
     */
    Task.createFromJSON = function(definition) {
        definition = definition || {};

        var name = definition.name || definition.url; // "url" is the old name for "name"
        var pastDuration = definition.pastDuration;
        var manualChange = definition.totalManualChange;
        var startTime, endTime;
        if (definition.startTime) {
            startTime = new Date(definition.startTime);
        }
        if (definition.endTime) {
            endTime = new Date(definition.endTime);
        }
        var completed = definition.completed;

        return new Task(name, pastDuration, startTime, endTime, manualChange, completed);
    };

    /**
     * List of properties of Task that will be persisted
     * @type {Array}
     */
    Task.INCLUDE_IN_JSON = ['name', 'pastDuration', 'startTime', 'endTime', 'totalManualChange', 'completed'];

    /**
     * Updates the totalDuration of this Task
     * @param {Date} [now=new Date()] Time to use for now
     */
    Task.prototype.updateDuration = function(now) {
        // Calculate the new duration
        var time;
        if (this.isActive()) {
            time = now || new Date();
        }
        else {
            time = this.endTime;
        }
        this.currentDuration = time - this.startTime;

        // Total duration is the sum of manual change and past and current duration
        this.totalDuration = this.pastDuration + this.currentDuration + this.totalManualChange;
    };

    /**
     * Whether this Task is currently active
     * @returns {boolean}
     */
    Task.prototype.isActive = function() {
        // Task is active if there is no endTime set
        return (typeof this.endTime === 'undefined');
    };

    /**
     * Whether this Task is currently active
     * @returns {boolean}
     */
    Task.prototype.isComplete = function() {
        // Task is active if there is no endTime set
        return this.completed;
    };

    /**
     * Continues tracking time for this task
     */
    Task.prototype.continue = function() {
        if (!this.isActive()) {
            // Create a new time
            this.pastDuration += this.currentDuration;
            this.currentDuration = 0;
            this.startTime = new Date();
            this.endTime = undefined;
        }
    };

    /**
     * Stops tracking time for this task
     */
    Task.prototype.stop = function() {
        if (this.isActive()) {
            // Set the end time
            this.endTime = new Date();
            this.updateDuration();
        }
    };

    /**
     * Applies this.manualChangeInputString to the total manual change.
     * The manualChangeInputString is parsed with getManualChangeInputInMs
     */
    Task.prototype.manualChange = function() {
        var change = this.getManualChangeInputInMs();
        if (change !== 0) {
            // Set to the totalManualChange
            this.totalManualChange += change;

            // Reset the input
            this.manualChangeInputString = '';

            // Update the total duration
            this.updateDuration();

            // No longer editing
            this.editing = false;

            return true;
        }
        return false;
    };

    /**
     * Reset this task to 0 time.
     */
    Task.prototype.reset = function() {
        // Reset all the times:
        this.totalManualChange = 0;
        this.currentDuration = 0;
        this.pastDuration = 0;
        var resetDate = new Date();
        this.startTime = resetDate;
        this.endTime = resetDate;

        // Update the total duration
        this.updateDuration();
    };


    /**
     * Returns the manualChangeInputString in milliseconds. Returns 0 if input
     * is not valid or not set.
     * @returns {number}
     */
    Task.prototype.getManualChangeInputInMs = function() {
        var change = durationUtil.parseStringToMinutes(this.manualChangeInputString);
        // Convert minutes to ms:
        change *= 60000;
        return change;
    };


    /**
     * Toggles the editing state of this Task
     */
    Task.prototype.toggleEdit = function() {
        this.editing = !this.editing;
        this.manualChangeInputString = '';
    };

    // Export to global
    window.Task = Task;
})();
