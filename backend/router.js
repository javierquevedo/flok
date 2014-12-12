/**
 * Main router of the Stream component
 *
 * @copyright  Nothing Interactive 2014
 * @author     Tobias Leugger <vibes@nothing.ch>
 */
'use strict';

var express = require('express');
var cors = require('cors');

var UserController = require('./controllers/UserController');

// Create the router
var router = express.Router();

// Register route
router.options('/register', cors());
router.post('/register', cors(), UserController.register);

// Export the router
module.exports = router;
