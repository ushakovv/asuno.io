/**
 * Created by rus on 16.06.15.
 */

(function () {
    'use strict';

    function Maintence(resource) {
        return resource('/api/maintenancejournal', {}, {
            query: { url: '/api/maintenancejournal' }
        });
    }

    angular.module('asuno').service('Maintence', Maintence);
})();
