'use strict';

/*
 * An AngularJS Localization Service
 *
 * Written by Jim Lavin
 * http://codingsmackdown.tv
 *
 * Fork by mikkosuonio:
 * https://github.com/mikkosuonio/angularjs-localizationservice/blob/545dbdddbe73762377a72dfa15e1f9dfea2446b5/src/localize.js
 * Modified by Vibes <vibes@nothing.ch>
 *
 */

angular.module('localization', [])
    // localization service responsible for retrieving resource files from the server and
    // managing the translation dictionary
    .provider('localize', function () {
        var resourcePath = '/i18n/en.json';

        var $get = ['$http', '$rootScope', '$window', '$filter', function($http, $rootScope) {
            var localize = {
                // array to hold the localized resource string entries
                dictionary: {},
                // flag to indicate if the service hs loaded the resource file
                resourceFileLoaded: false,

                // success handler for all server communication
                successCallback: function (data) {
                    // store the returned array in the dictionary
                    localize.dictionary = data;
                    // set the flag that the resource are loaded
                    localize.resourceFileLoaded = true;
                    // broadcast that the file has been loaded
                    $rootScope.$broadcast('localizeResourcesUpdates');
                },

                // loads the language resource file from the server
                initLocalizedResources: function () {
                    // request the resource file
                    $http({ method:'GET', url:resourcePath, cache:false }).success(localize.successCallback);
                },

                // checks the dictionary for a localized resource string
                getLocalizedString: function(value) {
                    // default the result to element key
                    var result = value;

                    // Check if translation is available
                    if (localize.dictionary.hasOwnProperty(value)) {
                        result = localize.dictionary[value];
                    }

                    // return the value to the call
                    return result;
                }
            };

            // force the load of the resource file
            localize.initLocalizedResources();

            // return the local instance when called
            return localize;
        }];

        // configure the language resource file path on the server
        // example:
        // angular.module('localization')
        //  .config(function(localizeProvider) {
        //    localizeProvider.setResourcePath('<path>');
        //  });
        function setResourcePath(path) {
            resourcePath = path;
        }

        return {
            $get: $get,
            setResourcePath: setResourcePath
        };
    } )
    // simple translation filter
    // usage {{ TOKEN | trans }}
    .filter('trans', ['localize', function (localize) {
        return function (input) {
            return localize.getLocalizedString(input);
        };
    }])
    // translation directive that can handle dynamic strings
    // updates the text value of the attached element
    // usage <span data-trans="TOKEN" ></span>
    // or
    // <span data-trans="TOKEN|VALUE1|VALUE2" ></span>
    .directive('trans', ['localize', function(localize){
        var transDirective = {
            restrict:'EAC',
            updateText:function(elm, token){
                var values = token.split('|');
                if (values.length >= 1) {
                    // construct the tag to insert into the element
                    var tag = localize.getLocalizedString(values[0]);
                    // update the element only if data was returned
                    if ((tag !== null) && (tag !== undefined) && (tag !== '')) {
                        if (values.length > 1) {
                            for (var index = 1; index < values.length; index++) {
                                var target = '{' + (index - 1) + '}';
                                tag = tag.replace(target, values[index]);
                            }
                        }
                        // insert the text into the element
                        elm.text(tag);
                    }
                }
            },

            link:function (scope, elm, attrs) {
                scope.$on('localizeResourcesUpdates', function() {
                    transDirective.updateText(elm, attrs.trans);
                });

                attrs.$observe('trans', function (/*value*/) {
                    transDirective.updateText(elm, attrs.trans);
                });
            }
        };

        return transDirective;
    }])
    // translation directive that can handle dynamic strings
    // updates the attribute value of the attached element
    // usage <span data-trans-attr="TOKEN|ATTRIBUTE" ></span>
    // or
    // <span data-trans-attr="TOKEN|ATTRIBUTE|VALUE1|VALUE2" ></span>
    .directive('transAttr', ['localize', function (localize) {
        var i18NAttrDirective = {
            restrict: 'EAC',
            updateText:function(elm, token){
                var values = token.split('|');
                // construct the tag to insert into the element
                var tag = localize.getLocalizedString(values[0]);
                // update the element only if data was returned
                if ((tag !== null) && (tag !== undefined) && (tag !== '')) {
                    if (values.length > 2) {
                        for (var index = 2; index < values.length; index++) {
                            var target = '{' + (index - 2) + '}';
                            tag = tag.replace(target, values[index]);
                        }
                    }
                    // insert the text into the element
                    elm.attr(values[1], tag);
                }
            },
            link: function (scope, elm, attrs) {
                scope.$on('localizeResourcesUpdated', function() {
                    i18NAttrDirective.updateText(elm, attrs.transAttr);
                });

                attrs.$observe('transAttr', function (value) {
                    i18NAttrDirective.updateText(elm, value);
                });
            }
        };

        return i18NAttrDirective;
    }]);