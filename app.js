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

// Load the base locale
var locale = require('./locale/en.js');

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

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('port', process.env.PORT || 3000);
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set up the routes
// Route for delivering the angular page
app.get('/', function(req, res) {
    res.render('index', activeConfig);
});

// Dummy api method to check if API is up
app.options('/api', cors());
app.get('/api', function(req, res) {
    res.send({ status: 'OK' });
});

// Expose that locale
app.get('/locale/en.json', function(req, res) {
    res.send(locale);
});

// TODO: all of this component loading should go in a separate file
// Read the config of the enabled components
activeConfig.angularModules = [];
activeConfig.jsFiles = [];
activeConfig.cssFiles = [];
_.forOwn(activeConfig.components, function(enabled, name) {
    if (enabled) {
        // Load the component config
        var config = require('./components/' + name + '/component.js');

        // Serve the public files
        if (config.registerPublicFiles) {
            app.use(express.static(path.join(__dirname, 'components', name, 'public')));

            // Merge the js anc css files
            if (config.jsFiles) {
                _.merge(activeConfig.jsFiles, config.jsFiles);
            }
            if (config.cssFiles) {
                _.merge(activeConfig.cssFiles, config.cssFiles);
            }
        }

        // Mount the router
        if (config.registerRouter) {
            app.use('/api/' + name, require('./components/' + name + '/backend/router.js'));
        }

        // TODO: should be able to handle multiple languages
        // Load the locale
        if (config.registerLocale) {
            var componentLocale = require('./components/' + name + '/locale/en.js');
            locale = _.merge(locale, componentLocale);
        }

        // Add to angular modules if there is one
        if (config.registerAngularModule) {
            activeConfig.angularModules.push(name);
        }
    }
});


// Server
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
