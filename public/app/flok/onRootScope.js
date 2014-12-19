/**
 * Simple module for adding an $onRootScope method to all $scopes
 * @type {angular.Module}
 */
angular.module('onRootScope', []);

// Add $onRootScope method for pub/sub
// See https://github.com/angular/angular.js/issues/4574
angular.module('onRootScope').config(function($provide) {
    'use strict';

    $provide.decorator('$rootScope', ['$delegate', function($delegate) {

        $delegate.constructor.prototype.$onRootScope = function(name, listener) {
            var unsubscribe = $delegate.$on(name, listener);
            this.$on('$destroy', unsubscribe);
        };

        return $delegate;
    }]);
});
