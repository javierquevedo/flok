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
    'title': 'flok',
    'error': {
        'noModules': 'Welcome to flok, the Radically Open Business Operation Toolkit. It looks like you currently don\'t have any configured components, check your config and make sure you enable at least 1!'
    },
    'version': 'Version',
    'format.date_and_time': 'dd.MM.y HH:mm:ss',
    login: {
        title: 'Register / Login / Logout'
    },
    action: {
        login: 'Login',
        logout: 'Logout',
        register: 'Register'
    }
};

module.exports = locale;
