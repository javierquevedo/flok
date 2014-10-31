var config = {
    // Default values are if they are not overwritten in the more specific sections below
    default: {
        db: 'mongodb://localhost/flok',
        backendUrl: 'http://localhost:3000/api',
        localePath: 'locale/en.json',
        piwik: {
            enable: true,
            url: 'piwik.example.com',
            siteId: 1
        },
        components: {
            time: true,
            todo: false,
            stream: false
        },
        stream: {
            apiKeys: []
        }
    },

    // Overwriting config for development
    development: {
        piwik: {
            enable: false,
            url: 'devPiwik.example.com',
            siteId: 2
        },
        components: {
            time: true,
            todo: true,
            stream: true
        }
    },

    // Overwriting config for testing
    test: {
        // Tests will drop the database and modify it, so they should run on a separate database!
        db: 'mongodb://localhost/flok_test'
    },

    // Overwriting config for production
    production: {
        backendUrl: 'https://example.com/api'
    }
};

module.exports = config;
