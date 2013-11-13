(function() {
    'use strict';

    /**
     * flok Directives: a collection of reusable Angular directives
     * @exports flokDirectives
     */
    var flokDirectives = {
        /**
         * Directive for an element <icon> that inserts a font-awesome icon.
         * @see {@link http://fortawesome.github.io/Font-Awesome/} Font-Awesome website
         * @example
         * // The following snippet will insert an info icon
         * &lt;icon type="info"&gt;&lt;/icon&gt;
         * // becomes:
         * &lt;i class="icon-info"&gt;&lt;/i&gt;
         *
         * @example
         * // One can also add extra classes:
         * &lt;icon type="info" options="rotate-90"&gt;&lt;/icon&gt;
         * // becomes:
         * &lt;i class="icon-info icon-rotate-90"&gt;&lt;/i&gt;
         */
        icon: function() {
            return {
                restrict: 'E',
                scope: { type: '@' },
                controller: function($scope, $attrs) {
                    if ($attrs.options) {
                        var optionArray = $attrs.options.split(/\s+/).map(function(value) {
                            return 'icon-' + value.trim();
                        });
                        if (optionArray.length > 0) {
                            $scope.extraClasses = optionArray.join(' ');
                        }
                    }
                },
                template: '<i class="icon-[[type]] [[extraClasses]]"></i>',
                replace: true
            };
        }
    };

    // Register as Angular module
    angular.module('flokDirectives', [])
        .directive('icon', flokDirectives.icon)
    ;
})();
