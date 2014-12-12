/**
 * Mongoose schema for a User.
 */
'use strict';

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

module.exports = mongoose.model('User', userSchema);
