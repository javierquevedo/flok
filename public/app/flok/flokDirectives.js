/**
 * Flok directives
 * @copyright  Nothing Interactive 2015
 * @author     Patrick Fiaux <nodz@nothing.ch>
 */
angular.module('flokDirectives', []);

angular.module('flokDirectives').directive('icon', [function() {
    'use strict';

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
     *
     * @module flockDirectives/icon
     */
    return {
        restrict: 'E',
        scope: {type: '@'},
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
        template: '<i class="icon-{{type}} {{extraClasses}}"></i>',
        replace: true
    };
}]);

angular.module('flokDirectives').directive('clickLink', ['$location', function($location) {
    'use strict';

    /**
     * Directive to navigate to a URL from any clickable element, e.g. Button.
     * @param $location
     * @returns {{link: Function}}
     *
     * @example
     * // similar to &lt;a href="#/partial"&gt; but hash is not required
     * // e.g. &lt;div click-link="/partial"&gt;
     *
     * @module flokDirectives/clickLink
     */
    return {
        link: function(scope, element, attrs) {
            attrs.$observe('clickLink', function() {
                element.on('click', function() {
                    scope.$apply(function() {
                        $location.path(attrs.clickLink);
                    });
                });
            });
        }
    };
}]);

angular.module('flokDirectives').directive('focusOn', ['$timeout', function($timeout) {
    'use strict';

    /**
     * Directive for input elements, triggers focus
     * on or off (focusOn/blurOn) based on an expression. These were renamed to not conflict with the core
     * ngFocus and ngBlur
     * See http://stackoverflow.com/questions/14859266/input-autofocus-attribute
     *
     * @example
     * <input focusOn="someScopeVariable" type="text" />
     *
     * @module flokDirectives/flocusOn
     */
    return {
        link: function($scope, $element, attrs) {
            /*
             * Watch for the expression value to change
             */
            $scope.$watch(attrs.focusOn, function(val) {
                if (angular.isDefined(val) && val) {
                    $timeout(function() {
                        $element[0].focus();
                    });
                }
            }, true);

            /*
             * blurs the element base on other expression
             */
            $element.bind('blur', function() {
                if (angular.isDefined(attrs.blurOn)) {
                    $scope.$apply(attrs.blurOn);
                }
            });
        }
    };
}]);
