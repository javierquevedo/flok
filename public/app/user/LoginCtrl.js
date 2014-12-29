/**
 * Controller for the login form
 * @author     Tobias Leugger <vibes@nothing.ch>
 * @module LoginCtrl
 */
angular.module('flokModule').controller('LoginCtrl', [
    '$scope', '$location', '$translate', 'sessionService',
    function($scope, $location, $translate, sessionService) {
        'use strict';

        $scope.form = {
            email: '',
            password: ''
        };

        // TODO: use a proper alert component
        $scope.message = '';
        $scope.messageType = '';

        var handleError = function(errorMessage) {
            $scope.message = errorMessage;
            $scope.messageType = 'danger';
        };

        var handleSuccess = function(successMessage) {
            $scope.message = successMessage;
            $scope.messageType = 'success';
        };

        /**
         * Submits the form as login action
         */
        $scope.submitLogin = function() {
            $scope.message = '';
            sessionService.login($scope.form.email, $scope.form.password)
                .then(function() {
                    $location.url('/');
                })
                .catch(handleError);
        };

        /**
         * Submits the form as registration action
         */
        $scope.submitRegistration = function() {
            $scope.message = '';
            sessionService.register($scope.form.email, $scope.form.password)
                .then(function() {
                    handleSuccess($translate.instant('flok.message.registrationSuccess'));
                })
                .catch(handleError);
        };
    }
]);
