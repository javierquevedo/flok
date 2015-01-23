'use strict';
/*global describe, beforeEach, it, assert, inject */
describe('angularPiwik', function() {
    var documentTitle = 'Angular Piwik Test';
    var piwik, windowMock;

    // Make a dummy piwik config
    angular.module('flokModule', []);

    // Make a dummy piwik config
    angular.module('flokModule').constant('piwikConfig', {
        enable: true,
        url: 'dummy',
        siteId: '1'
    });

    // ---------------- BEFORE ----------------
    beforeEach(function() {
        // Mock the $window
        windowMock = {
            document: {
                title: documentTitle
            }
        };
        angular.mock.module(function($provide) {
            $provide.value('$window', windowMock);
        });

        angular.mock.module('flokModule');

        // Setup angularPiwik module
        angular.mock.module('angularPiwik');

        // Inject piwik service
        angular.mock.inject(function($injector) {
            piwik = $injector.get('piwik');
        });
    });

    // TODO: test filter and root scope method more
    // ---------------- TESTS ----------------
    it('should have a track filter', angular.mock.inject(function($filter) {
        var track = $filter('track');
        assert.typeOf(track, 'function', 'there is a track filter');
    }));

    it('should have a track method on $rootScope', angular.mock.inject(function($rootScope) {
        var track = $rootScope.track;
        assert.typeOf(track, 'function');
        assert.equal(track.length, 2, 'track $rootScope method takes 2 arguments');
    }));

    it('should set up _paq', inject(function() {
        assert.typeOf(windowMock._paq, 'array');
    }));


    it('Event: click event on a non-zero location', function() {
        var action = 'edit';
        var event = {
            type: 'click',
            clientX: 1,
            clientY: 0,
            key: 'false'
        };
        piwik.track(action, event);
        assert.deepEqual(windowMock._paq[0], ['trackEvent', documentTitle, action, 'click']);
    });


    it('Event: click event on a non-zero location where action was defined as false', function() {
        var action = 'edit';
        var event = {
            type: 'click',
            clientX: 1,
            clientY: 0,
            key: 'false'
        };
        var input = false;
        piwik.track(action, event, input);
        assert.deepEqual(windowMock._paq[0], ['trackEvent', documentTitle, action, 'e_click']);
    });


    it('Event: Keydown using Tab to get to the button and firing with the Enter key', function() {
        var action = 'edit';
        var event = {
            type: 'click',
            clientX: 0,
            clientY: 0,
            key: 'false'
        };
        piwik.track(action, event);
        assert.deepEqual(windowMock._paq[0], ['trackEvent', documentTitle, action, 'keydown / enter']);
    });

    it('Event: Keydown enter event on an Input element', function() {
        var action = 'save';
        var event = {
            type: 'keydown',
            /*clientX :   0,
             clientY :   0,*/
            key: 'Enter'
        };
        piwik.track(action, event);
        assert.deepEqual(windowMock._paq[0], ['trackEvent', documentTitle, action, 'keydown / enter']);

    });

    it('Event : Keydown esc event on an Input element', function() {
        var action = 'abort';
        var event = {
            type: 'keydown',
            /*clientX :   0,
             clientY :   0,*/
            key: 'Esc'
        };
        piwik.track(action, event);
        assert.deepEqual(windowMock._paq[0], ['trackEvent', documentTitle, action, 'keydown / esc']);
    });

    it('Event: Keydown using Tab to get to the button and firing with the Enter key, with form value not accepted', function() {
        var action = 'edit';
        var event = {
            type: 'click',
            clientX: 0,
            clientY: 0,
            key: 'false'
        };
        var input = false;
        piwik.track(action, event, input);
        assert.deepEqual(windowMock._paq[0], ['trackEvent', documentTitle, action, 'e_keydown / enter']);
    });

    it('Event: Keydown enter event on an Input element, with form value not accepted', function() {
        var action = 'save';
        var event = {
            type: 'keydown',
            /*clientX :   0,
             clientY :   0,*/
            key: 'Enter'
        };
        var input = false;
        piwik.track(action, event, input);
        assert.deepEqual(windowMock._paq[0], ['trackEvent', documentTitle, action, 'e_keydown / enter']);
    });


    it('Track action without event', function() {
        var action = 'test';
        piwik.track(action);
        assert.deepEqual(windowMock._paq[0], ['trackEvent', documentTitle, action]);
    });
});
