/**
 * Module dependencies.
 */
'use strict';

// TODO: clean this whole thing up and split it into different files
var path = require('path');
var _ = require('lodash');
var express = require('express');
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var http = require('http');
var passport = require('passport');

var activeConfig = require('./backend/Config.js');

var coreRouter = require('./backend/router.js');

var User = require('./backend/models/UserModel.js');
var AccessController = require('./backend/controllers/AccessController.js');
var SessionStore = require('./backend/controllers/SessionStore.js');

// let's make sure we have a valid default module in the config
if (_.isUndefined(activeConfig.defaultComponent)) {
    // This will go to a blank page on root
    activeConfig.defaultComponent = '';
    // Try to find first active component if we don't have an default one.
    _.forEach(activeConfig.components, function(component, enabled) {
        if (component === '' && enabled) {
            console.log(component, enabled);
            activeConfig.defaultComponent = component;
        }
    });
}

// Load the base locale
var locale = require('./locale/en.js');

// Create the express app
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('port', process.env.PORT || 3000);

/*
 * Setup logging level for http requests (less in dev):
 * - Compact
 * - Skip successful responses
 * See https://www.npmjs.com/package/morgan for more.
 * TODO add logging settings to the config file so we don't have to change the code here.
 */
if (activeConfig.environment === 'development') {
    app.use(morgan('dev', {
        skip: function(req, res) {
            return res.statusCode < 400;
        }
    }));
}
// In production log full requests and all of them:
else {
    app.use(morgan('combined'));
}
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Setup the session storeage:
var mongoSessionStore = new SessionStore({
    url: activeConfig.db
});

app.use(session({
    name: 'flok.sid',
    secret: activeConfig.session.secret,
    resave: false,
    saveUninitialized: true, // TODO: what setting to we want?
    store: mongoSessionStore
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Restrict access to all urls under /api with the AccessController
app.use('/api', AccessController.restrict(activeConfig.publicApiUrls, activeConfig.apiKeys));

// Set up the routes
// Route for delivering the angular page
app.get('/', function(req, res) {
    res.render('index', activeConfig);
});

// Add the static resources from core:
app.use(express.static(path.join(__dirname, 'public')));

// Dummy api method to check if API is up
// TODO this should probably return the version of the API
app.get('/api', function(req, res) {
    return res.send({status: 'OK'});
});

// Expose that locale
app.get('/locale/en.json', function(req, res) {
    res.send(locale);
});

// Register core router
app.use('/api/flok/', coreRouter);

// TODO: all of this component loading should go in a separate file
// Read the config of the enabled components
activeConfig.angularModules = [];
activeConfig.jsFiles = [];
activeConfig.cssFiles = [];

/*
 * Will contain the init method of each enabled component, defined in their component.js file.
 * This allows component to start listening to streams or run start up tasks when flok starts.
 * TODO consider similar implementation for shutdown.
 */
var componentsInitMethods = [];

/*
 * Perform loading and initialization tasks for each of the enabled components of flok
 */
_.forOwn(activeConfig.components, function(enabled, name) {
    if (enabled) {
        // Load the component config
        var config = require('./components/' + name + '/component.js');

        // Serve the public files
        if (config.registerPublicFiles) {
            app.use(express.static(path.join(__dirname, 'components', name, 'public')));

            // Merge the js anc css files
            if (config.jsFiles) {
                Array.prototype.push.apply(activeConfig.jsFiles, config.jsFiles);
            }
            if (config.cssFiles) {
                Array.prototype.push.apply(activeConfig.cssFiles, config.cssFiles);
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

        // Push the init methods to our store to run on startup.
        if (config.init) {
            componentsInitMethods.push(config.init);
        }
    }
});

// Handle errors and if no one responded to the request (must have 4 arguments to be seen as error handler)
app.use(function(err, req, res, next) { // jshint ignore:line
    // Check if we got an error
    if (err) {
        // TODO: should have the status code on the Error object
        if (res.statusCode < 400) {
            // If no error status code has been set, use 500 by default
            res.status(500);
        }

        // TODO: improve what is sent and how it's send
        // Send the error details
        return res.send({
            error: err.message,
            details: err.details
        });
    }

    // No error given, still ended up here, must be 404
    return res.status(404).send({
        error: 'Method not found'
    });
});

// This route deals enables HTML5Mode by forwarding missing files to the index
// This must be the last route defined right now or it will serve the html instead of js files.
// The reg exp is used so that static resources like `doesNotExist.js` does not return the index file.
app.get('/[a-z0-9\/]{0,100}', function(req, res) {
    res.render('index', activeConfig);
});


// Server
var server = http.createServer(app);

/**
 * Initialize server once connected to database.
 * @param [err] error callback
 */
var initServer = function(err) {
    if (err) {
        console.log('flok:core Could not connect to Mongo: ', err);
        process.exit();
    }

    server.listen(app.get('port'), function(err) {
        if (err) {
            console.log('flok:core Could not listen: ', err);
            process.exit();
        }

        // Run the init method of every enabled component
        _.each(componentsInitMethods, function(method) {
            method();
        });

        console.log('flok:core Running in ' + app.settings.env + ' environment');
        console.log('flok:core Express server listening on port ' + app.get('port'));
    });
};

// Start flok server
if (require.main === module) {
    // Connect to mongo and initialize database
    if (mongoose.connection.readyState === 0) {
        mongoose.connect(activeConfig.db, initServer);
    }
    // If we're already connected directly initialize
    else {
        initServer();
    }
}

module.exports = server;
