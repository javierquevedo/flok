/**
 * Main router of the Stream component
 *
 * @copyright  Nothing Interactive 2014
 */
'use strict';

var express = require('express');
var cors = require('cors');

// Controllers
var Stream = require('./controllers/Stream');

// Create the router
var router = express.Router();

// Handle the "/" URL
router.options('/', cors());
router.get('/', cors(), Stream.get);
router.post('/', cors(), Stream.post);

// Export the router. It will be mounted on /api/stream
module.exports = router;
