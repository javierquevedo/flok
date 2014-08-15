/**
 * Module dependencies.
 */
'use strict';
var path = require('path');
var _  = require('lodash');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var http = require('http');
var packageJson = require('./package.json');
var config = require('./config/config.js');

// Create the express app
var app = express();

// Define defaultsDeep method (from http://lodash.com/docs#partialRight)
var defaultsDeep = _.partialRight(_.merge, function deep(value, other) {
    return _.merge(value, other, deep);
});

// Load the config and set the defaults
var activeConfig = defaultsDeep(config[app.settings.env], config.default);

// Set additional settings
activeConfig.environment = app.settings.env;
activeConfig.version = packageJson.version;

// Controllers
var Time = require('./backend/controllers/Time');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('port', process.env.PORT || 3000);
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// TODO: all of this component loading should go in a separate file
// Read the config of the enabled components
var enabledComponents = activeConfig.components;
activeConfig.components = {};
_.forOwn(enabledComponents, function(enabled, name) {
    if (enabled) {
        // Load the component config
        activeConfig.components[name] = require('./components/' + name + '/component.js');

        // Serve the components public files
        app.use(express.static(path.join(__dirname, 'components', name, 'public')));
    }
});

// Also expose the components as a list
activeConfig.componentList = _.keys(activeConfig.components);

// Route for delivering the angular page
app.get('/', function(req, res) {
    res.render('index', activeConfig);
});

/*
 * Routes
 * Following the route-separation express example:
 * https://github.com/visionmedia/express/blob/master/examples/route-separation/index.js
 */
// Home
app.options('/api', cors());
app.get('/api', function(req, res) {
    res.send({ status: 'OK' });
});

// Handle the "/time/:user" URL
app.options('/api/time/:user', cors());
app.get('/api/time/:user', cors(), Time.get);
app.put('/api/time/:user', cors(), Time.put);

// server
var server = http.createServer(app);
if (require.main === module) {
    mongoose.connect(activeConfig.db, function(err) {
        if (err) {
            console.log('Could not connect to Mongo: ', err);
            process.exit();
        }

        server.listen(app.get('port'), function(err) {
            if (err) {
                console.log('Could not listen: ', err);
                process.exit();
            }

            console.log('Running in ' + app.settings.env + ' environment');
            console.log('Express server listening on port ' + app.get('port'));
        });
    });
}

module.exports = server;
