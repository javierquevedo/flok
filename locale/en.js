/**
 * The main language file for flok
 *
 * The strings are dot appended so:
 * { flok: { title: 'flok' } } becomes accessible via flok.title
 * @copyright  Nothing Interactive 2014
 */
var locale = {};

// Flok Strings
locale.flok = {
    title: 'flok',
    error: {
        'default': 'An error occurred.',
        noModules: 'Welcome to flok, the Radically Open Business Operation Toolkit. It looks like you currently don\'t have any configured components, check your config and make sure you enable at least 1!'
    },
    version: 'Version',
    message: {
        registrationSuccess: 'Registered successfully. You can now log in.'
    },
    login: {
        title: 'Login or Register'
    },
    logout: {
        title: 'Logout'
    },
    action: {
        login: 'Login',
        register: 'Register'
    }
};

module.exports = locale;
