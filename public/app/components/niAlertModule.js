/**
 * Simple Module for handling alert messages. Provides a service to add and
 * remove alerts and directives to show these alerts.
 *
 * Possible additions:
 * - Add provider settings for default message (currently hardcoded 'notification')
 *
 * @type {module}
 *
 * @copyright Nothing Interactive 2014
 * @author Tobias Leugger <vibes@nothing.ch>
 * @author Marc Gruber <rune@nothing.ch>
 * @author Patrick Fiaux <nodz@nothing.ch>
 * @version v1.4.0
 *
 * @exports alertModule
 */
angular.module('nothing.alertModule', []);

/*
 * We expose the alertService as a provider which allows us configuration
 * of the template for the directive.
 */
angular.module('nothing.alertModule').provider('alertService', function() {
    'use strict';

    /**
     * custom template to use
     * @type {(string|boolean)}
     */
    var templateUrl = false;

    /**
     * Default time for which an alert is shown
     * (default is 7000 when not configured)
     * @type {number}
     */
    var defaultAlertTimeout = 7000;

    /**
     * Set the template
     * @param value
     */
    this.setTemplateUrl = function(value) {
        templateUrl = value;
    };

    /**
     * Set the default alert timeout.
     * @param {number|false} timeout defaults to 7000. false means no time out.
     */
    this.setDefaultAlertTimeout = function(timeout) {
        if (angular.isNumber(timeout) || timeout === false) {
            defaultAlertTimeout = timeout;
        }
        else {
            defaultAlertTimeout = 7000;
        }
    };

    this.$get = ['$timeout', function($timeout) {
        /**
         * Simple object to represent an alert message
         *
         * @param {AlertService} alertService Reference to the service this alert belongs to
         * @param {string} message
         * @param {string} type
         * @constructor
         * @exports alertModule/Alert
         */
        var Alert = function(alertService, message, type) {
            this._alertService = alertService;
            this.message = message;
            this.type = type;
        };

        /**
         * Removes this alert from the list of alerts
         */
        Alert.prototype.remove = function() {
            this._alertService.removeAlert(this);
        };


        /**
         * Main service of the alertModule that manages to alert messages.
         * @param $timeout
         * @constructor
         * @exports alertModule/AlertService
         */
        var AlertService = function($timeout) {
            /**
             * Angular $timeout service
             * @type {*}
             * @private
             */
            this._$timeout = $timeout;

            /**
             * Stores all the alerts handled by this service.
             * Mapping of alert group name to arrays of alerts
             *
             * @type {{}}
             * @private
             */
            this._alerts = {};
        };

        /**
         * Returns the array of alerts
         * @param {string} [group='']
         * @returns {Array}
         */
        AlertService.prototype.getAlerts = function(group) {
            // Default group is empty
            group = group || '';

            // Check if this group exists already
            if (typeof this._alerts[group] === 'undefined') {
                this._alerts[group] = [];
            }
            return this._alerts[group];
        };

        /**
         * Add a new alert with the given message. By default the alert will be removed after
         * some time. Change the timeout to false or to another number to change that behaviour.
         *
         * @param {string} message
         * @param {string} [type='notification'] One of 'error', 'notification' or 'success'
         * @param {string} [group='']
         * @param {boolean|number} [timeout=defaultAlertTimeout] Whether to hide remove the
         *      alert after the given time in ms
         */
        AlertService.prototype.addAlert = function(message, type, group, timeout) {
            var alert = new Alert(this, message, type || 'notification');
            this.getAlerts(group).push(alert);

            // If timeout is false or (not given & default if false) return
            if (timeout === false || !angular.isNumber(timeout) && defaultAlertTimeout === false) {
                return;
            }

            // If it should be removed automatically, set the timeout
            if (!angular.isNumber(timeout) && defaultAlertTimeout) {
                timeout = defaultAlertTimeout;
            }

            this._$timeout(function() {
                alert.remove();
            }, timeout);

        };

        /**
         * Remove all alerts
         */
        AlertService.prototype.removeAllAlerts = function() {
            // Go through all the alert groups and empty them
            for (var group in this._alerts) {
                if (this._alerts.hasOwnProperty(group)) {
                    this.removeAllGroupAlerts(group);
                }
            }
        };

        /**
         * Remove all alerts in a given group
         * @param targetGroup
         */
        AlertService.prototype.removeAllGroupAlerts = function(targetGroup) {
            var alerts = this._alerts[targetGroup];
            // Remove all elements from the array. Not overwriting with a new empty array
            // because we want to keep the object.
            alerts.splice(0, alerts.length);
        };

        /**
         * Removes the given alert from the list of alerts
         *
         * @param alert
         */
        AlertService.prototype.removeAlert = function(alert) {
            // Go through all the alert groups to find the given alert
            for (var group in this._alerts) {
                if (this._alerts.hasOwnProperty(group)) {
                    var alerts = this._alerts[group];
                    var index = alerts.indexOf(alert);
                    if (index >= 0) {
                        alerts.splice(index, 1);
                        break;
                    }
                }
            }
        };

        /**
         * Returns the currently configured template for display
         * @returns {string|boolean}
         */
        AlertService.prototype.getTemplateUrl = function() {
            return templateUrl;
        };

        return new AlertService($timeout);
    }];
});

angular.module('nothing.alertModule').directive('niAlertDisplay', ['alertService', function(alertService) {
    'use strict';

    /**
     * Directive for displaying the alerts
     *
     * @example
     * // Renders a list of the alerts in the default group
     * <ni-alert-display></ni-alert-display>
     *
     * @example
     * // Renders a list of the alerts in the "sideBar" group
     * <ni-alert-display group="sideBar"></ni-alert-display>
     *
     * @module alertModule/niAlertDisplay
     */
    var alertDisplayDirective = {
        restrict: 'E',
        replace: true,
        scope: {
            group: '@'
        },
        controller: function($scope) {
            // Get the alerts of the given group
            $scope.alerts = alertService.getAlerts($scope.group);
        }
    };

    // If template url is set use that for the directive
    if (alertService.getTemplateUrl()) {
        alertDisplayDirective.templateUrl = alertService.getTemplateUrl();
    }
    // else use the default template
    else {
        alertDisplayDirective.template = '<ul class="alert-display">' +
        '<li ng-repeat="alert in alerts" class="alert-{{ alert.type }}" ng-bind-html="alert.message"></li>' +
        '</ul>';
    }

    return alertDisplayDirective;
}]);
