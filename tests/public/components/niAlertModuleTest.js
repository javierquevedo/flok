/**
 * Tests for the niAlertModule
 * @copyright  Nothing Interactive 2014
 * @author     Tobias Leugger <vibes@nothing.ch>
 */

/* global angular, describe, beforeEach, it, assert */
describe('niAlertModule', function() {
    'use strict';

    beforeEach(function() {
        angular.mock.module('nothing.alertModule');
    });

    describe('alertServiceProvider', function() {
        var _alertServiceProvider, alertService;

        beforeEach(function() {
            // Initialize the service provider by injecting it to a fake module's config block
            angular.module('nothing.alertModule.test', function () {}).config(function(alertServiceProvider) {
                _alertServiceProvider = alertServiceProvider;
            });

            // We then make sure to mock our test module so it's config runs
            angular.mock.module('nothing.alertModule.test');

            // Then we inject the service
            angular.mock.inject(function(_alertService_) {
                alertService = _alertService_;
            });

        });

        it('has no templateUrl by default', function() {
            assert.isFalse(alertService.getTemplateUrl(),'The default template should not be set');
        });

        it('sets the template url', function() {
            _alertServiceProvider.setTemplateUrl('testUrlHere');
            assert.equal(alertService.getTemplateUrl(),'testUrlHere','The default template should not be set');
        });
    });

    describe('alertService', function() {
        var alertService, $timeout;

        beforeEach(angular.mock.inject(function(_alertService_, _$timeout_) {
            alertService = _alertService_;
            $timeout = _$timeout_;
        }));

        it('should have a getAlerts method.', function() {
            assert.isFunction(alertService.getAlerts);

            var alerts = alertService.getAlerts();
            assert.isArray(alerts);
            assert.propertyVal(alerts, 'length', 0);
        });

        it('should expose newly added alert.', function() {
            assert.isFunction(alertService.addAlert);
            var alerts = alertService.getAlerts();

            alertService.addAlert('Test');
            assert.propertyVal(alerts, 'length', 1);
            assert.propertyVal(alerts[0], 'message', 'Test');
        });

        it('should be possible to remove an alert.', function() {
            assert.isFunction(alertService.removeAlert);
            var alerts = alertService.getAlerts();

            alertService.addAlert('Test1');
            alertService.addAlert('Test2');
            alertService.addAlert('Test3');

            assert.propertyVal(alerts, 'length', 3);
            var toRemove = alerts[1];
            alertService.removeAlert(toRemove);
            assert.propertyVal(alerts, 'length', 2, 'Should have one less alert');

            assert.propertyVal(alerts[0], 'message', 'Test1', 'Test1 alert should still be around');
            assert.propertyVal(alerts[1], 'message', 'Test3', 'Test3 alert should still be around');
        });

        it('alert should have method to remove itself.', function() {
            assert.isFunction(alertService.removeAlert);
            var alerts = alertService.getAlerts();

            alertService.addAlert('Test1');

            assert.propertyVal(alerts, 'length', 1);
            var toRemove = alerts[0];

            assert.isFunction(toRemove.remove, 'alert should have a remove method');
            toRemove.remove();
            assert.propertyVal(alerts, 'length', 0, 'Should have one less alert');
        });

        it('should be possible to remove all alerts.', function() {
            assert.isFunction(alertService.removeAllAlerts);
            var alerts = alertService.getAlerts();

            alertService.addAlert('Test1');
            alertService.addAlert('Test2');
            alertService.addAlert('Test3');

            assert.propertyVal(alerts, 'length', 3);
            alertService.removeAllAlerts();
            assert.propertyVal(alerts, 'length', 0, 'Should have no more alerts');
        });

        it('should remove alerts automatically after some time.', function() {
            var alerts = alertService.getAlerts();
            alertService.addAlert('Test');

            assert.propertyVal(alerts, 'length', 1);
            $timeout.flush(2000);
            assert.propertyVal(alerts, 'length', 1, 'Should still have the alert after 2 seconds');
            $timeout.flush(6000);
            assert.propertyVal(alerts, 'length', 0, 'Should have no more alerts after a few more seconds');
        });

        it('should be possible to add alerts that do not remove automatically.', function() {
            var alerts = alertService.getAlerts();
            alertService.addAlert('Test', 'success', '', false);
            assert.propertyVal(alerts, 'length', 1);
            $timeout.verifyNoPendingTasks();
        });

        it('should have alert grouping capabilities.', function() {
            var alerts1 = alertService.getAlerts();
            var alerts2 = alertService.getAlerts('group2');

            assert.propertyVal(alerts1, 'length', 0, 'default group should have no alerts');
            assert.propertyVal(alerts2, 'length', 0, 'group2 should have no alerts');

            alertService.addAlert('Test');
            assert.propertyVal(alerts1, 'length', 1, 'default group now has 1 alert');
            assert.propertyVal(alerts2, 'length', 0, 'group2 should have still no alerts');

            alertService.addAlert('Another Test', 'success', 'group2');
            assert.propertyVal(alerts1, 'length', 1, 'default should still have 1 alert');
            assert.propertyVal(alerts2, 'length', 1, 'group2 now has 1 alert too');

            alerts1[0].remove();
            assert.propertyVal(alerts1, 'length', 0, 'default group alert removed');
            assert.propertyVal(alerts2, 'length', 1, 'group2 still has 1 alert');

            alerts2[0].remove();
            assert.propertyVal(alerts1, 'length', 0, 'default group alert still removed');
            assert.propertyVal(alerts2, 'length', 0, 'group2 alert removed too');
        });


        describe('ni-alert-display directive.', function() {
            var $compile, $rootScope, $sce;

            beforeEach(angular.mock.inject(function(_$sce_, _$compile_, _$rootScope_) {
                $sce = _$sce_;
                $compile = _$compile_;
                $rootScope = _$rootScope_;
            }));

            it('should render list of alerts', function() {
                var element = $compile('<ni-alert-display></ni-alert-display>')($rootScope);

                assert.isTrue(element.hasClass('alert-display'), 'element has alert-display class');
                assert.propertyVal(element.find('li'), 'length', 0, 'no alerts are displayed');

                alertService.addAlert($sce.trustAsHtml('test alert'));
                $rootScope.$digest();
                var displayedAlerts = element.find('li');
                assert.propertyVal(displayedAlerts, 'length', 1, 'added alert is shown');
                assert.match(displayedAlerts.text(), /test alert/, 'contains correct text');
            });

            it('should render list of alerts of a given group', function() {
                var element = $compile('<ni-alert-display group="testGroup"></ni-alert-display>')($rootScope);

                assert.isTrue(element.hasClass('alert-display'), 'element has alert-display class');
                assert.propertyVal(element.find('li'), 'length', 0, 'no alerts are displayed');

                alertService.addAlert($sce.trustAsHtml('test alert'));
                $rootScope.$digest();
                assert.propertyVal(element.find('li'), 'length', 0, 'does not show alert of default group');

                alertService.addAlert($sce.trustAsHtml('test'), 'success', 'testGroup');
                $rootScope.$digest();
                assert.propertyVal(element.find('li'), 'length', 1, 'shows alert of testGroup');
            });

            it('should render alert with correct type', function() {
                var element = $compile('<ni-alert-display></ni-alert-display>')($rootScope);
                alertService.addAlert($sce.trustAsHtml('test1'));
                alertService.addAlert($sce.trustAsHtml('test2'), 'error');
                alertService.addAlert($sce.trustAsHtml('test3'), 'success');
                $rootScope.$digest();

                var alerts = element.find('li');
                assert.propertyVal(alerts, 'length', 3, 'shows 3 alerts');
                assert.isTrue(angular.element(alerts[0]).hasClass('alert-notification'), 'first alert hat default notification class');
                assert.isTrue(angular.element(alerts[1]).hasClass('alert-error'), 'second alert hat error class');
                assert.isTrue(angular.element(alerts[2]).hasClass('alert-success'), 'third alert hat success class');
            });
        });
    });
});
