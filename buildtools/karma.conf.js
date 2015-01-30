// Karma configuration
module.exports = function (config) {
    'use strict';
    config.set({

        // Base path, that will be used to resolve files and exclude
        basePath: '../',

        // Frameworks to use
        frameworks: ['mocha'],

        // List of files / patterns to load in the browser
        files: [
            // Application vendors
            'public/vendor/bower/angular/angular.js',
            'public/vendor/bower/angular-messages/angular-messages.js',
            'public/vendor/bower/angular-sanitize/angular-sanitize.js',
            'public/vendor/bower/angular-translate/angular-translate.js',
            'public/vendor/bower/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            'public/vendor/bower/angular-ui-router/release/angular-ui-router.js',
            'public/vendor/bower/angular-fullscreen/src/angular-fullscreen.js',
            'public/vendor/bower/angular-loading-bar/build/loading-bar.js',
            'public/vendor/js/*.js',

            // Testing resources
            'node_modules/chai/chai.js',
            'buildtools/karma/*.js',
            'public/vendor/bower/angular-mocks/angular-mocks.js',

            // Fixtures
            'tests/public/flok/enabledComponentsFixture.js',

            // The actual application files
            'public/app/flok/flokModule.js',
            'public/app/**/*.js',
            'components/time/public/app/time/flokTimeModule.js',
            'components/time/public/app/time/*.js',

            // And finally the tests
            'tests/public/**/*.js',
            'components/time/tests/public/**/*.js'
        ],

        // List of files to exclude
        exclude: [
            // Don't include the minified vendors
            'public/vendor/js/*.min.js',
            'public/vendor/js/*.map.js'
        ],

        // Test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress'],

        // Web server port
        port: 9876,

        // Enable / disable colors in the output (reporters and logs)
        colors: true,

        // Level of logging
        // Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // Enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
