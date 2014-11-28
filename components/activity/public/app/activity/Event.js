/* global durationUtil */
/* exported Event */
(/** @lends <global> */function() {
    'use strict';

    /**
     * Represents a event for which time is tracked.
     * @class
     * @global
     * @constructor
     */
    function Event(timestamp, provider, link, title, message, author, duration) {

        this.timestamp = timestamp;
        this.provider = provider;
        this.author = author;

        this.link = link || false;
        this.title = title || '';
        this.message = message || '';
        this.duration = duration || 0;
    }

    /**
     * Creates an Event from it's JSON representation
     * @param {JSON} definition
     * @returns {Task}
     */
    Event.createFromJSON = function(definition) {
        definition = definition || {};

        var timestamp = new Date(definition.timestamp);
        var provider = definition.provider;
        var author = definition.author;
        var link, title, message, duration;
        if (definition.link) {
            link = definition.link;
        }
        if (definition.title) {
            title = definition.title;
        }
        if (definition.message) {
            message = definition.message;
        }
        if (definition.duration) {
            duration = definition.duration;
        }

        return new Event(timestamp, provider, link, title, message, author, duration);
    };

    /**
     * List of properties of Event that will be persisted
     * @type {Array}
     */
    Event.INCLUDE_IN_JSON = ['timestamp', 'provider', 'link', 'title', 'message', 'author', 'duration'];


    // Export to global
    window.Event = Event;
})();
