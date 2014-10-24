'use strict';
/**
 * backendStorageServiceTest tests
 * @copyright  Nothing Interactive 2014
 * @author     Patrick Fiaux <nodz@nothing.ch>
 *
 */
/* global suite, setup, test, assert */
suite('backendStorageService', function() {
    var backendStorageService;

    // before each
    setup(function() {
        angular.mock.module(
            'flokModule',
            /*
             * We have to setup the translateProvider to use static strings otherwise
             * we get `Unexpected request: Get locale....js Errors.
             */
            function($translateProvider) {
                $translateProvider.translations('en', {});
            }
        );
        angular.mock.module(function($provide) {
            $provide.value('backendUrl', '');
        });
    });

    setup(angular.mock.inject(function($rootScope, $injector) {
        backendStorageService = $injector.get('backendStorageService');
    }));

    test('service loaded', function() {
        assert.typeOf(backendStorageService, 'object', 'backendStorageService is an object');
    });


    test('getTime method', angular.mock.inject(function($httpBackend, backendStorageService) {
        assert.typeOf(backendStorageService.getTime, 'function', 'backendStorageService has a getTime method');

        var calledSuccess = false;
        var expectedData = [
            {name: 'Task1', owner: 'Vibes'}
        ];

        // Define our expectations
        $httpBackend.expectGET('/time/Vibes')
            .respond(expectedData)
        ;

        var req = backendStorageService.getTime('Vibes');

        req.success(function(data) {
            calledSuccess = true;
            assert.deepEqual(data, expectedData, 'Got unexpected');
        });

        $httpBackend.flush();

        // Make sure we got a $http object
        assert.typeOf(req.then, 'function');
        assert.typeOf(req.success, 'function');
        assert.typeOf(req.error, 'function');

        assert.isTrue(calledSuccess, 'success method was called');
    }));

    test('putTime method', angular.mock.inject(function($httpBackend, backendStorageService) {
        assert.typeOf(backendStorageService.putTime, 'function', 'backendStorageService has a putTime method');

        var expectedData = [
            {name: 'Task1'}
        ];

        var req = backendStorageService.putTime('Vibes', expectedData);

        var calledSuccess = false;

        req.success(function() {
            calledSuccess = true;
        });

        // Define our expectations
        $httpBackend.expectPUT('/time/Vibes', expectedData)
            .respond({})
        ;
        $httpBackend.flush();

        // Make sure we got a $http object
        assert.typeOf(req.then, 'function');
        assert.typeOf(req.success, 'function');
        assert.typeOf(req.error, 'function');

        assert.isTrue(calledSuccess, 'success method was called');
    }));
});
