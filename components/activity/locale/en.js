/**
 * Flok activity language strings
 * Note that they're prefixed with both the flok and activity namespaces.
 * @copyright  Nothing Interactive 2014
 */
var locale = {
    flok: {}
};

locale.flok.activity = {
    'title': 'Activity',
    'user': {
        'follow': 'Follow'
    },
    'item': {
        'timestampWithDuration': 'on {{ date }}, {{duration}}',
        'timestamp': 'on {{ date }}'
    },
    'duration': {
        'minutes': '{{minutes}} minutes',
        'hours': '{{hours}} hour(s)',
        'hoursAndMinutes': '{{hours}} hours {{minutes}} minutes',
        'added': 'added {{duration}}',
        'removed': 'removed {{duration}}'
    }
};

module.exports = locale;
