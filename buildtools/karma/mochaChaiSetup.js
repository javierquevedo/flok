/* exported should, assert, expect */
var should, assert, expect;
(function (mocha, chai) {
    'use strict';

    // Mocha setup
    mocha.setup('tdd');

    // Don't bail on failure
    mocha.bail(false);

    // Export chai functions to global
    should = chai.should();
    assert = chai.assert;
    expect = chai.expect;
})(window.mocha, window.chai);
