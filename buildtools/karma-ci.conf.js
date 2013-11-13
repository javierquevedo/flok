var baseConfig = require('./karma.conf');

/**
 * Karma configuration for running tests on a CI server
 * @param config
 */
module.exports = function (config) {
    'use strict';

    // Load the base config
    baseConfig(config);

    // Continuous Integration mode
    config.singleRun = true;

    // Use dots reporter (for direct output) and junit for detailed analysis
    config.reporters = ['dots', 'junit'];

    // Set the junit output file
    config.junitReporter = {
        outputFile: 'build/logs/karma.xml'
    };

    // Use PhantomJS for te tests
    config.browsers = ['PhantomJS'];
};