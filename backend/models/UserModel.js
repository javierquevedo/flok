/**
 * Mongoose schema for a User.
 *
 * @copyright  Nothing Interactive 2014
 * @author     Tobias Leugger <vibes@nothing.ch>
 */
'use strict';

// TODO: set up integration testing of the whole API

var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({});

// Make it a passport user: this will add email (= username), hash, and salt fields
// as well as a few helper methods
userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameLowerCase: true
});

userSchema.methods.toJSON = function() {
    return _.assign(
        _.pick(this, ['email']),
        {
            id: this.id
        }
    );
};

module.exports = mongoose.model('User', userSchema);
