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

var bcrypt = require('bcryptjs'); // TODO: might want to use 'bcrypt' package, looks more stable, but sucky to install on windows
var BCRYPT_WORK_FACTOR = 10; // To generate salt for password

var userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: String
});

userSchema.virtual('password')
    .set(function(password) {
        this.hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(BCRYPT_WORK_FACTOR));
    })
    .get(function() {
        return this.hashedPassword;
    })
;

userSchema.methods.verify = function(candidatePassword, next) {
    bcrypt.compare(candidatePassword, this.password, next);
};

userSchema.methods.toJSON = function() {
    return _.assign(
        _.pick(this, ['email']),
        {
            id: this.id
        }
    );
};

module.exports = mongoose.model('User', userSchema);
