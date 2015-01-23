angular.module('flokFilters', []);

angular.module('flokFilters').filter('decimalDuration', [function() {
    'use strict';

    /**
     * Convert to decimal duration
     * @param {number} input Duration in milliseconds
     * @return {string} The given duration in hours with a precision of 2
     * @example
     * // Calculate the time in milliseconds
     * var time = ((((2 * 60) + 10) * 60) + 30) * 1000
     * // Returns "2.18"
     * decimalDuration(time);
     * @exports flokFilters/decimalDuration
     */
    return function(input) {
        if (!input) {
            input = 0;
        }

        // Input is in milliseconds, convert to hours
        var hours = input / 3600000;
        return hours.toFixed(2);
    };
}]);

angular.module('flokFilters').filter('duration', [function() {
    'use strict';

    /**
     * Convert to human readable duration
     * @param {number} input Duration in milliseconds
     * @return {string} Human readable duration
     * @example
     * // Calculate the time in milliseconds
     * var time = ((((2 * 60) + 10) * 60) + 30) * 1000
     * // Returns "2h 10m 30s"
     * duration(time);
     * @exports flokFilters/duration
     */
    return function(input) {
        // TODO: make it possible to specify display format (from translations file)
        if (!input) {
            return '0s';
        }

        // Check if the value is negative
        var negative = (input < 0);
        if (negative) {
            // Make it positive for the calculations below to work
            input *= -1;
        }

        // Input is in milliseconds, convert to seconds
        input = Math.round(input / 1000);
        var seconds = input % 60;
        var minutes = Math.floor(input / 60) % 60;
        var hours = Math.floor(input / 3600);

        var string = negative ? '-' : '';
        if (hours > 0) {
            string += hours + 'h ';
        }
        if (hours > 0 || minutes > 0) {
            string += minutes + 'm ';
        }
        string += seconds + 's';
        return string;
    };
}]);
