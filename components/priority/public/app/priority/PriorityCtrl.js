/**
 * Controller for flok Priority
 * @module TimeCtrl
 */
angular.module('flokPriorityModule').controller('PriorityCtrl', ['$scope', function($scope) {
    'use strict';

    // Set some dummy data
    $scope.tasks = {
        planned: [
            {
                id: 100,
                name: 'Flok Priority prototype',
                project: 'flok',
                milestone: '0.4.0',
                owner: 'Vibes',
                time: {
                    estimated: 20,
                    used: 3
                }
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
                }
            }
        ],
        unplanned: [
            {
                id: 300,
                name: 'Create offer',
                project: 'internals',
                milestone: 'September 2014',
                owner: 'Spot',
                time: {
                    estimated: 12,
                    used: 8
                }
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
                }
            }
        ]
    };

    $scope.sortableOptions = {
        axis: 'y',
        cursor: 'n-resize',
        connectWith: '.task-container'
    };

    /**
     * Adds up the total remaining hours in the planned list. Negative numbers
     * are counted as 0.
     * @returns {number}
     */
    $scope.getTotalPlannedRemaining = function() {
        var total = 0;
        for (var i = 0; i < $scope.tasks.planned.length; i++) {
            var task = $scope.tasks.planned[i];
            total += Math.max(task.time.estimated - task.time.used, 0);
        }
        return total;
    };
}]);
