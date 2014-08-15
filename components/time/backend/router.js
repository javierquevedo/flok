/**
 * Main router of the Time component
 */
'use strict';

var express = require('express');
var cors = require('cors');

// Controllers
var Time = require('./controllers/Time');

// Create the router
var router = express.Router();

// Handle the "/:user" URL
router.options('/:user', cors());
router.get('/:user', cors(), Time.get);
router.put('/:user', cors(), Time.put);

// Export the router. It will be mounted on /api/time
module.exports = router;
