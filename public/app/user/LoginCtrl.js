/**
 * Controller for the login form
 * @author     Tobias Leugger <vibes@nothing.ch>
 * @module LoginCtrl
 */
angular.module('flokModule').controller('LoginCtrl', [
    '$scope', 'sessionService',
    function($scope, sessionService) {
        'use strict';

        // TODO: this whole thing is just dummy code to get a basic register/login/logout flow going

        $scope.form = {
            email: '',
            password: ''
        };

        $scope.lastMessage = '';
        $scope.lastMessageType = '';

        var handleError = function(data) {
            $scope.lastMessage = data;
            $scope.lastMessageType = 'danger';
        };

        var handleSuccess = function(data) {
            $scope.lastMessage = data;
            $scope.lastMessageType = 'success';
        };


        /**
         * Submits the form as login action
         */
        $scope.submitLogin = function() {
            $scope.lastMessage = '';
            sessionService.login($scope.form.email, $scope.form.password)
                .then(handleSuccess).catch(handleError);
        };

        /**
         * Submits the form as registration action
         */
        $scope.submitRegistration = function() {
            $scope.lastMessage = '';
            sessionService.register($scope.form.email, $scope.form.password)
                .then(handleSuccess).catch(handleError);
        };

        /**
         * Logs the user out
         */
        $scope.submitLogout = function() {
            $scope.lastMessage = '';
            sessionService.logout()
                .then(handleSuccess).catch(handleError);
        };
    }
]);
