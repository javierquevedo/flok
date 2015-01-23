/**
 * Controller for the login form
 * @author     Tobias Leugger <vibes@nothing.ch>
 * @module LoginCtrl
 */
angular.module('flokModule').controller('LoginCtrl', [
    '$scope', '$location', '$translate', 'sessionService','alertService',
    function($scope, $location, $translate, sessionService,alertService) {
        'use strict';

        $scope.form = {
            email: '',
            password: ''
        };

        var handleError = function(errorMessage) {
            alertService.addAlert(errorMessage,'error');
        };

        /**
         * Submits the form as login action
         */
        $scope.submitLogin = function() {
            $scope.message = '';
            sessionService.login($scope.form.email, $scope.form.password)
                .then(function() {
                    alertService.addAlert($translate.instant('flok.message.loginSuccess'),'success'); //'Welcome back robot!')
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
                    alertService.addAlert($translate.instant('flok.message.registrationSuccess'),'success');
                })
                .catch(handleError);
        };
    }
]);
