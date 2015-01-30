/**
 * Main application controller
 * @exports flokModule/flokCtrl
 */
angular.module('flokModule').controller('flokCtrl', ['$scope', 'menuService', 'sessionService',
    function($scope, menuService, sessionService) {
        'use strict';

        $scope.contentLoaded = true;
        // Set the content to loaded when the localization says it's done
        // TODO $translateLoadingSuccess isn't called but content is translated
        //$scope.$on('$translateLoadingSuccess', function() {
        //    $scope.contentLoaded = true;
        //});

        // Expose whether we have a valid session
        $scope.hasValidSession = sessionService.hasValidSession.bind(sessionService);

        $scope.menuItems = menuService.getMenuItems();
    }
]);
