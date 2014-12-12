angular.module('flokActivityModule').filter('activityDuration', ['$filter', function($filter) {
    'use strict';

    /**
     * Filter for duration
     * TODO this might be better done in flokFilters, however the filters there are millisecond based.
     * @param {number} input time input
     * @return {string} formatted time output
     * @exports flokActivityModule/activityDuration
     */
    return function(input) {
        if (!input) {
            return '';
        }

        // Check if the value is negative
        var negative = (input < 0);
        if (negative) {
            // Make it positive for the calculations below to work
            input *= -1;
        }

        var minutes = input % 60;
        var hours = Math.floor(input / 60);

        // First we get the hours/minute translated string
        // TODO we'll need pluralize here.
        var timeString;
        if (hours > 0) {
            if (minutes > 0) {
                timeString = $filter('translate')('flok.activity.duration.hoursAndMinutes', {
                    hours: hours,
                    minutes: minutes
                });
            }
            else {
                timeString = $filter('translate')('flok.activity.duration.hours', {hours: hours});
            }
        }
        else {
            timeString = $filter('translate')('flok.activity.duration.minutes', {minutes: minutes});
        }

        // Then we turn it into a phrase for added/removed time
        if (negative) {
            timeString = $filter('translate')('flok.activity.duration.removed', {duration: timeString});
        }
        else {
            timeString = $filter('translate')('flok.activity.duration.added', {duration: timeString});
        }

        return timeString;
    };
}]);
