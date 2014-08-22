/**
 * Controller for flok Todo
 * @module TimeCtrl
 */
angular.module('flokTodoModule').controller('TodoCtrl', ['$scope', function($scope) {
    'use strict';

    // Set some dummy data
    $scope.tasks = [
        {
            id: 100,
            name: 'Flok Todo prototype',
            project: 'flok',
            milestone: '0.4.0',
            owner: 'Vibes',
            time: {
                estimated: 20,
                used: 3
            },
            inPriorityList: true
        },
        {
            id: 200,
            name: 'Improve tests',
            project: 'flok',
            milestone: '0.4.0',
            owner: 'Vibes',
            time: {
                estimated: 10,
                used: 0
            },
            inPriorityList: true
        },
        {
            id: 300,
            name: 'Create offer',
            project: 'internals',
            milestone: 'September 2014',
            owner: 'Spot',
            time: {
                estimated: 12,
                used: 8
            },
            inPriorityList: false
        },
        {
            id: 400,
            name: 'Plan next features',
            project: 'flok',
            milestone: '0.5.0',
            owner: 'Vibes',
            time: {
                estimated: 4,
                used: 7
            },
            inPriorityList: false
        }
    ];

    /**
     * Returns the object that should be used for the ng-filter get the given
     * list from the tasks.
     * @param {string} listType Either 'priority' or 'all'
     * @returns {{}}
     */
    $scope.filterForListType = function(listType) {
        if (listType === 'priority') {
            return {
                inPriorityList: true
            };
        }
        return {};
    };

    /**
     * Adds up the total remaining hours in the priority list. Negative numbers
     * are counted as 0.
     * @returns {number}
     */
    $scope.getTotalRemainingInPriorityList = function() {
        var total = 0;
        for (var i = 0; i < $scope.tasks.length; i++) {
            var task = $scope.tasks[i];
            if (task.inPriorityList) {
                total += Math.max(task.time.estimated - task.time.used, 0);
            }
        }
        return total;
    };
}]);
