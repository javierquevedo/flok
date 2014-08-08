(function() {
    'use strict';
    // saves the milisecond timestamp of the last tracked click and compares it to the listeners, to avoid saving 2 times the same event.
    var lastClickTimestamp = 0;

    /**
     * TODO: this whole class has to be tested and cleaned up and only loaded when enabled in the config
     *
     * Tracking of more advanced values such as clicks in empty areas and scrolls.
     * @param $window
     * @param piwikDomain
     * @param siteId
     * @constructor
     */
    var AdvancedTracking = function($window, piwikDomain, siteId) {
        this._$window = $window;

        this._piwikTracker = this._$window.Piwik.getTracker();
        this._piwikTracker.setTrackerUrl(piwikDomain);
        this._piwikTracker.setSiteId(siteId);

        this._oldScrollTime = 0;
        this._minTimeBetweenAction = 500;
        this._scrollCollection = [];
        this._isScrollFlag = [false, -1]; // second value is to define if swipe is vertical (0) or horizontal (1)
        this._swipeThreshold = 50; // for touch devices, check if threshold was exceeded.
        this._keyboardFlag = 0; // 0 : no key tracked, 1: 1 key tracked, 2 : more than 1 key tracked.
        this._oldKeydownTime = 0;
        this._isComputer = true;

        var that = this;

        // computer
        var clickProxy = function(e) {
            that._clickActivity(e);
        };
        var scrollProxy = function(e) {
            that._scrollActivity(e);
        };
        var keyDownProxy = function(e) {
            that._keydownActivity(e);
        };

        // mobile
        var touchProxy = function(e) {
            that._touchActivity(e);
        };
        var touchEndProxy = function(e) {
            that._touchEndActivity(e);
        };

        // triggerd by both
        var scrollBothProxy = function(e) {
            that._scrollBothActivity(e);
        };

        // Click event Listeners
        addEventListener('click', clickProxy, false);
        // Scroll event listeners
        addEventListener('DOMMouseScroll', scrollProxy, false); // tracks scrolls for firefox
        addEventListener('mousewheel', scrollProxy, false); // tracks scrolls for webkit
        // keyboard event listener
        addEventListener('keydown', keyDownProxy, false); // tracks if keyboard is used.
        // touch devices
        addEventListener('touchstart', touchProxy, false);
        addEventListener('touchmove', touchProxy, false);
        addEventListener('touchend', touchEndProxy, false);
        // scroll is tracked when it really scrolls on computer, or on any swipe (at the end) on mobile devices
        addEventListener('scroll', scrollBothProxy, false); // tracks only when it really scrolls.

        window.setInterval(function() {
            that.pushDataToBackend(false);
        }, 1000);
    };

    /**
     *  For scrolling and keydowns,
     * if no activity was tracked for more than one second, push the existing data to the database and clear the tables
     *
     * @public
     */
    AdvancedTracking.prototype.pushDataToBackend = function(saveDirectly) {
        var now = new Date();
        // scroll data
        if ((saveDirectly || now.getTime() - this._oldScrollTime > this._minTimeBetweenAction) && this._scrollCollection.length > 0) {
            var distance = this._findScrollDistance();
            var scrolling = (distance.isEmpty) ? 'e_scroll' : 'scroll';
            var finalDistance = this._isScrollFlag[1] === 0 ? distance.distY : distance.distX;
            var scrollDirection = this._isScrollFlag[1] === 0 ? 'vertical scroll' : 'horizontal scroll';
            this._piwikTracker.trackEvent(this._$window.document.title, scrollDirection, scrolling, finalDistance);
            this._scrollCollection = [];
            this._isScrollFlag[0] = false;
        }
        // keyboard data
        if ((saveDirectly || now.getTime() - this._oldKeydownTime > this._minTimeBetweenAction) && this._keyboardFlag > 0) {
            // todo could add empty keydown tracking
            var keyboardKeys = this._keyboardFlag === 1 ? 'one key' : 'several keys';
            this._piwikTracker.trackEvent(this._$window.document.title, 'fill form', 'keydown / ' + keyboardKeys);
            this._keyboardFlag = 0;
        }
    };

    /**
     * Tracks all click activity.
     * If a click is already tracked (for now only Angular), don't take it into account.
     *
     * @param evt
     */
    AdvancedTracking.prototype._clickActivity = function(evt) {
        if (this._isComputer) {
            this._trackClickAndTouch(evt, true);
        }
    };

    /**
     * Saves scroll data (distance, timestamp) with respect to the browser.
     * Defines if the scroll is horizontal or vertical
     *
     * @param evt
     * @private
     */
    AdvancedTracking.prototype._scrollActivity = function(evt) {
        evt = evt || window.event;
        // If time passed between two scrolls is larger than a certain amount, save the scroll array
        var now = new Date();
        this._oldScrollTime = now.getTime();
        var wheelDistX = 0;
        var wheelDistY = 0;
        if (evt.type === 'DOMMouseScroll') { // firefox
            if (evt.axis === 2) {
                wheelDistX = 0;
                wheelDistY = evt.detail;
            }
            else {
                wheelDistX = evt.detail;
                wheelDistY = 0;
            }
        }
        else if (evt.type === 'mousewheel') { // webkit
            wheelDistX = evt.wheelDeltaX / 40;
            wheelDistY = evt.wheelDeltaY / 40;
        }

        this._scrollCollection.push({
            eventName: evt.type,
            scrollDistX: wheelDistX,
            scrollDistY: wheelDistY,
            timestamp: evt.timeStamp
        });
        this._isScrollFlag[0] = true;
        if (this._isScrollFlag[1] === -1) {
            if (Math.abs(this._scrollCollection[0].scrollDistY - evt.pageY) > 0) {
                this._isScrollFlag = [true, 0];
            }
            else if (Math.abs(this._scrollCollection[0].scrollDistX - evt.pageX) > 0) {
                this._isScrollFlag = [true, 1];
            }
        }
    };

    /**
     * Goes through all scrolling elements and checks out whether it is an empty scroll or not.
     * It also returns the scrolled "distance" and the element at the start of the scroll (which will remain the same on a touch device)
     *
     * @returns {{isEmpty: boolean, distX: number, distY: number, targetNode: *}}
     */
    AdvancedTracking.prototype._findScrollDistance = function() {
        var distX = 0;
        var distY = 0;
        var isEmpty = true;
        for (var i = 0, len = this._scrollCollection.length; i < len; i++) {
            if (this._scrollCollection[i].eventName === 'scroll') {
                isEmpty = false;
            }
            distX += this._scrollCollection[i].scrollDistX;
            distY += this._scrollCollection[i].scrollDistY;
        }
        return {isEmpty: isEmpty, distX: distX, distY: distY, targetNode: this._scrollCollection[0].targetNodeName};
    };

    /**
     * Tracks the keyboard activities
     *
     * in order not to violate any privacy, don't track the key itself or even the number of keydown that happened.
     * the only saved data is that user either used the keyboard once or more
     * this rule could be changed for gaming keyboard tracking
     *
     * @private
     */
    AdvancedTracking.prototype._keydownActivity = function() {
        var now = new Date();
        this._oldKeydownTime = now.getTime();
        this._keyboardFlag = Math.min(this._keyboardFlag + 1, 2);
    };

    /**
     * Saves the data from the touchstart event.
     * Also checks for each touchmove event if the moved distance is enough to be considered as a swipe rather than a click
     *
     * @param evt
     * @private
     */
    AdvancedTracking.prototype._touchActivity = function(evt) {
        if (this._scrollCollection.length === 0) {
            this._scrollCollection.push({
                eventName: evt.type,
                scrollDistX: evt.changedTouches[0].pageX,
                scrollDistY: evt.changedTouches[0].pageY,
                timestamp: evt.timeStamp
            });
            this._isComputer = false;
        }
        if (!this._isScrollFlag[0]) {
            if (Math.abs(this._scrollCollection[0].scrollDistY - evt.pageY) > this._swipeThreshold) {
                this._isScrollFlag = [true, 0];
            }
            else if (Math.abs(this._scrollCollection[0].scrollDistX - evt.pageX) > this._swipeThreshold) {
                this._isScrollFlag = [true, 1];
            }
        }
    };

    /**
     * Tracks the end of the touch event. Checks whether the touch event was a swipe or a simple touch/click.
     * @param evt
     * @private
     */
    AdvancedTracking.prototype._touchEndActivity = function(evt) {
        if (!this._isScrollFlag[0]) { // simple touch/click
            this._trackClickAndTouch(evt, false);
        }
        else { // it is a swipe
            var distance = this._isScrollFlag[1] === 0 ?
                Math.abs(this._scrollCollection[0].scrollDistY - evt.changedTouches[0].pageY) :
                Math.abs(this._scrollCollection[0].scrollDistX - evt.changedTouches[0].pageX);
            var scrollDirection = this._isScrollFlag[1] === 0 ? 'vertical swipe' : 'horizontal swipe';
            this._piwikTracker.trackEvent(this._$window.document.title, scrollDirection, 'swipe', distance);
            // todo add check for empty swipes (if distance != 0 but page move == 0)
        }
        this._isScrollFlag = [false, -1];
        this._scrollCollection = [];
    };

    /**
     * saves the new click/touch event to Piwik. If the click/touch happened on an input tag, then its not empty
     * If the click happens somewhere else, it is considered as empty (real buttons are tracked with the "track" flag)
     *
     * @param evt
     * @param isClick
     * @private
     */
    AdvancedTracking.prototype._trackClickAndTouch = function(evt, isClick) {
        evt = evt || window.event;
        var device = isClick ? 'click' : 'touch';
        var markupInfo = 'empty';
        var clicking = 'e_' + device; // error flag

        if (evt.target.nodeName.toLowerCase() === 'input') {
            markupInfo = 'select form';
            clicking = device;
        }

        if ((isClick && evt.timeStamp !== lastClickTimestamp) ||
            (!isClick && this._scrollCollection[0].timestamp !== lastClickTimestamp))
        { // if the click is not already tracked (compares timestamp at milisecond)
            this._piwikTracker.trackEvent(this._$window.document.title, markupInfo, clicking);
        }
    };

    /**
     * need to check what event happened before
     * case a : a touchstart/touchmove -> it is the end trigger
     * case b : a mousewheel/DOMMouseScroll -> it is the actual trigger and ensures that the scroll is not empty.
     * case c : no event happened before -> cannot happen with touch events -> so back to case b.
     *
     * @param evt
     * @private
     */
    AdvancedTracking.prototype._scrollBothActivity = function(evt) {
        if (this._isComputer) {
            this._scrollActivity(evt);
        }
    };

    /**
     * AngularPiwik class exposed to angular with the angularPiwik module.
     * @param $window
     * @param piwikDomain
     * @param siteId
     * @param enableTracking
     * @constructor
     */
    var AngularPiwik = function($window, piwikDomain, siteId, enableTracking) {
        /**
         * The window object
         * @type {Object}
         * @private
         */
        this._$window = $window;

        // Make sure the piwik _paq array exists
        this._$window._paq = this._$window._paq || [];

        /**
         * Whether to track any events
         * @type {boolean}
         * @private
         */
        this._enabled = enableTracking;

        this._advanceTracker = null;
        var that = this;

        // Check if we should include the tracking code
        if (this._enabled === true && typeof piwikDomain !== 'undefined' && typeof siteId !== 'undefined') {
            // Set up piwik
            var _paq = this._$window._paq;
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);

            // Slightly angularised piwik tracking code
            var d = $window.document;
            var u = (('https:' === d.location.protocol) ? 'https' : 'http') + '://' + piwikDomain + '/';
            _paq.push(['setTrackerUrl', u + 'piwik.php']);
            _paq.push(['setSiteId', '' + siteId]);
            var g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
            g.type = 'text/javascript';
            g.defer = true;
            g.async = true;
            g.src = u + 'piwik.js';
            s.parentNode.insertBefore(g, s);

            // Start advanced when piwik is loaded
            var startAdvancedTracking = function() {
                if ($window.Piwik) {
                    that._advanceTracker = new AdvancedTracking($window, u + 'piwik.php', siteId);
                }
                else {
                    setTimeout(startAdvancedTracking, 100);
                }
            };
            startAdvancedTracking();
        }
    };

    /**
     * Tracks events tagged in the view.
     * @param action {string} action defined in the html file
     * @param event {Object} the $event object, it gives all the data linked to the event
     * @param input {bool/undefined} defined if action function returns a success flag
     */
    AngularPiwik.prototype.track = function(action, event, input) {
        // Don't do anything if not enabled

        if (!this._enabled) {
            return;
        }

        // Preparing the tracking array
        var track = ['trackEvent', this._$window.document.title, action];
        var that = this;

        // Add more info if we got event data
        if (event) {
            if (this._advanceTracker !== null) {
                this._advanceTracker.pushDataToBackend(true);
            }

            lastClickTimestamp = event.timeStamp;
            // Normalise the event type
            var eventType = event.type.toLowerCase();

            // Check whether it is keyboard or mouse event
            // Exception : if type = click and clientX & clientY === 0, than it was not a click, but a button was triggered by "enter"
            var falseClick = (eventType === 'click' && event.clientX === 0 && event.clientY === 0);

            // Add the event type to the tracking array
            var trigger = (falseClick ? 'keydown' : eventType);
            if (input === false) {
                trigger = 'e_' + trigger;
            }
            if (falseClick) {
                trigger += ' / enter';
            }
            else if (eventType === 'keydown') {
                trigger += ' / ' + event.key.toLowerCase();
            }
            track.push(trigger);
        }
        that._$window._paq.push(track);
    };


    /**
     * Angular Piwik Analytics Module: track events and page views to Piwik analytics
     *
     * The angularPiwik provider can be configured with the server settings. If
     * piwikDomain and siteId is given and track is enabled, then the Piwik
     * tracking code is generated and included.
     *
     * @example
     * // Use the 'track' filter to track an action for example on a ng-click.
     * // The filter takes two arguments:
     * // i) the action: a short string, e.g. edit/abort task
     * // ii) $event: the $event object provided by angular (optional)
     * <button ng-click="task.anyFunc() | track:'action':$event">Track It</button>
     *
     * @example
     * // Use the track() method on the $rootScope from anywhere in the template.
     * // Again with the above two arguments. This time we leave out the second one:
     * <a ng-click="track('link')">link</a>
     *
     * @namespace angularPiwik
     */
    var angularPiwikModule = angular.module('angularPiwik', []);

    /**
     * Piwik tracking provider
     * @memberof angularPiwik
     */
    var piwikProvider = function() {
        // Configuration values
        var enable = true;
        var piwikDomain;
        var siteId;

        /**
         * Set whether to enable any tracking to Piwik
         * @param shouldEnable {boolean}
         */
        this.enableTracking = function(shouldEnable) {
            // !! to make sure it's a boolean
            enable = !!shouldEnable;
        };

        /**
         * Set the domain of the piwik server, e.g. 'piwik.example.com'
         * @param domain {string}
         */
        this.setPiwikDomain = function(domain) {
            piwikDomain = domain;
        };

        /**
         * Set the piwik server site id, e.g. 5
         * @param id {number}
         */
        this.setSiteId = function(id) {
            siteId = id;
        };

        this.$get = ['$window', function($window) {
            return new AngularPiwik($window, piwikDomain, siteId, enable);
        }];
    };

    /**
     * Piwik track filter
     * @memberof angularPiwik
     */
    var piwikFilter = function(piwik) {
        return function(input, action, event) {
            piwik.track(action, event, input);
        };
    };

    // Register the provider and filter
    angularPiwikModule.provider('piwik', piwikProvider);
    angularPiwikModule.filter('track', ['piwik', piwikFilter]);

    // Register a track function to root scope
    angularPiwikModule.run(['$rootScope', 'piwik', function($rootScope, piwik) {
        // Need to wrap it, otherwise 'this' is not set correctly
        $rootScope.track = function(action, event) {
            piwik.track(action, event);
        };
    }]);
})();
