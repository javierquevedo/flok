'use strict';

var TwitterStream = require('./backend/controllers/TwitterStream.js');

var config = {
    registerRouter: false,
    registerLocale: false,
    registerAngularModule: false,
    registerPublicFiles: false,
    init: function () {
        TwitterStream.start();
    },
    jsFiles: []
};

module.exports = config;
