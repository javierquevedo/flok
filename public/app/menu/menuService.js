/**
 * menuService provides methods to manage the main flok menu
 */
angular.module('flokMenuModule').provider('menuService', function() {
    'use strict';

    var menuItems = [];

    /**
     * Add an item to the menu. The object has to have to be in the form:
     * {
     *     url: '/url',
     *     name: 'Title',
     *     icon: 'icon-name'
     * }
     * @param item
     */
    this.addMenuItem = function(item) {
        menuItems.push(item);
    };

    this.$get = function() {
        return {
            /**
             * Returns the list of menu entries
             * @returns {Array}
             */
            getMenuItems: function() {
                return menuItems;
            }
        };
    };
});
