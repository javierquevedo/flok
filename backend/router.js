/**
 * Main router of the flok core
 *
 * @copyright  Nothing Interactive 2014
 * @author     Tobias Leugger <vibes@nothing.ch>
 */
'use strict';

var express = require('express');

var UserController = require('./controllers/UserController');
var SessionController = require('./controllers/SessionController');

// Create the router
var router = express.Router();

// Route for registering new user
router.post('/register', UserController.register);

// Creating and deleting sessions (login and logout)
router.post('/session', SessionController.createSession);
router.delete('/session', SessionController.deleteSession);


// Export the router
module.exports = router;
