'use strict';
/**
 * piwikAnalyticsModule Class tests
 */
/*global suite, setup, test, teardown, assert, inject */
suite('piwikAnalyticsModule', function() {
    //var $scope;
    var eventProvider;


    // ---------------- BEFORE ----------------
    var module;
    setup(function() {
        module = angular.module('piwikAnalyticsModule');
    });

    setup(angular.mock.module('piwikAnalyticsModule'));

    setup(angular.mock.inject(function($injector) {
        eventProvider = $injector.get('eventProvider');
    }));

    // ---------------- TESTS ----------------
    // check that module exists
    test('should be registered', function() {
        assert.isNotNull(module);
    });

    // check that filter exists
    test('should have a track filter', inject(function($filter) {
        assert.isNotNull($filter('track'));
    }));

    // check that filter returns a function :: not useful I guess...
    test('should have a track filter that returns a function with 3 parameters', inject(function($filter) {
        var track = $filter('track');
        assert.equal(track.length, 3);
    }));


    /** ----------------------------------------------------------------------------------------------------------
     * Events to test :
     * - Event fired by a mouse click on a button
     * - Event fired by a mouse click on other elements
     * - Event fired by the keyboard on an input
     * - Event fired by the keyboard on any other element
     * - Event fired by other keyboard keys (esc, wathever else) on an input (or other elements)
     * - Event fired by something else than the keyboard and the mouse (e.g. if a person uses siri/equivalent to fire a button) on any element
     */


    var $window = window;
    $window.document.title = 'Time - flok';

    // check Event 01
    test('Event : click event on a non-zero location', function() {
        $window._paq = [];
        var action = 'edit task';
        var event = {
            type: 'click',
            clientX: 1,
            clientY: 0,
            key: 'false'
        };
        eventProvider().tracker(action, event, $window);
        assert.equal($window._paq[0][1], 'Time - flok / edit task / click / x:1, y:0');
    });

    // check Event 02
    test('Event : Keydown using Tab to get to the button and firing with the Enter key', function() {
        $window._paq = [];
        var action = 'edit task';
        var event = {
            type: 'click',
            clientX: 0,
            clientY: 0,
            key: 'false'
        };
        eventProvider().tracker(action, event, $window);
        assert.equal($window._paq[0][1], 'Time - flok / edit task / keydown / Enter');
    });

    // check Event 03
    test('Event : Keydown event on an Input element', function() {
        $window._paq = [];
        var action = 'save task';
        var event = {
            type: 'keydown',
            /*clientX :   0,
             clientY :   0,*/
            key: 'Enter'
        };
        eventProvider().tracker(action, event, $window);
        assert.equal($window._paq[0][1], 'Time - flok / save task / keydown / Enter');
    });

    // check Event 04
    test('Event : Keydown event on an Input element', function() {
        $window._paq = [];
        var action = 'abort task';
        var event = {
            type: 'keydown',
            /*clientX :   0,
             clientY :   0,*/
            key: 'Esc'
        };
        eventProvider().tracker(action, event, $window);
        assert.equal($window._paq[0][1], 'Time - flok / abort task / keydown / Esc');
    });

    //after each
    teardown(function() {
        // Can and should restore any classes that were mocked here
    });
});
