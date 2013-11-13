(function() {
    'use strict';

    /**
     * flok Filters: a collection of reusable Angular filters
     * @exports flokFilters
     * @private
     */
    var flokFilters = {
        /**
         * Convert to human readable duration
         * @param {number} input Duration in milliseconds
         * @return {string} Human readable duration
         * @example
         * // Calculate the time in milliseconds
         * var time = ((((2 * 60) + 10) * 60) + 30) * 1000
         * // Returns "2h 10m 30s"
         * duration(time);
         */
        duration: function(input) {
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
        },


        /**
         * Convert to decimal duration
         * @param {number} input Duration in milliseconds
         * @return {string} The given duration in hours with a precision of 2
         * @example
         * // Calculate the time in milliseconds
         * var time = ((((2 * 60) + 10) * 60) + 30) * 1000
         * // Returns "2.18"
         * decimalDuration(time);
         */
        decimalDuration: function(input) {
            if (!input) {
                input = 0;
            }

            // Input is in milliseconds, convert to hours
            var hours = input / 3600000;
            return hours.toFixed(2);
        }
    };

    // Register as Angular module
    angular.module('flokFilters', [])
        .filter('duration', function() {
            return flokFilters.duration;
        })
        .filter('decimalDuration', function() {
            return flokFilters.decimalDuration;
        })
    ;
})();
