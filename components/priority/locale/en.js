/**
 * Flok priority language strings
 * Note that they're prefixed with both the flok and priority namespaces.
 * @copyright  Nothing Interactive 2014
 */
var locale = {
    flok: {}
};

locale.flok.priority = {
    'title': 'Priority',
    'planned': 'Doing',
    'unplanned': 'Todo',
    'prototypeWarning': 'The Priority component is currently a prototype for trying out interactions.' +
    ' No data is stored outside the browser and everything is subject to change.',
    'task': {
        'number': '#',
        'name': 'Task',
        'project': 'Project',
        'milestone': 'Milestone',
        'owner': 'Owner',
        'remainingTime': 'Remaining Hours',
        'timeDetails': 'Estimated: {{ estimated }}, Used: {{ used }}'
    },
    'total': '{{total}} Total'
};

module.exports = locale;
