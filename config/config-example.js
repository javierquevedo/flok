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
        trac: {
            auth: 'username:password'
        },
        components: {
            time: true
        }
    },

    // Overwriting config for development
    development: {
        piwik: {
            enable: false,
            url: 'devPiwik.example.com',
            siteId: 2
        }
    },

    // Overwriting config for production
    production: {
        backendUrl: 'https://example.com/api'
    }
};

module.exports = config;
