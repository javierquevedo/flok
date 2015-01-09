/**
 * Main router of the flok core
 *
 * @copyright  Nothing Interactive 2014
 * @author     Tobias Leugger <vibes@nothing.ch>
 */
'use strict';

var express = require('express');

var UserController = require('./controllers/UserController');
var AccessController = require('./controllers/AccessController');

// Create the router
var router = express.Router();

// Route for registering new user
router.post('/register', UserController.register);

// Creating and deleting sessions (login and logout)
router.post('/session', AccessController.createSession);
router.delete('/session', AccessController.deleteSession);

// Get user
router.get('/user/me', UserController.getMe);


// Export the router
module.exports = router;
