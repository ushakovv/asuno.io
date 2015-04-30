/**
 * Created by vasa on 03.09.14.
 */

(function () {
  'use strict';

  function UFAP(resource) {
    return resource('', {}, {
      search       : {method : 'GET', url : '/api/ufaptoir/profiles'},
      types        : {method : 'GET', url : '/api/ufaptoir/power_points/types'},
      profile      : {method : 'GET', url : '/api/ufaptoir/profiles/:gis_id'},
      load_profile : {method : 'POST', url : '/api/ufaptoir/profiles/:gis_id/load'}
    });
  }

  angular.module('asuno').service('UFAP', UFAP);
})();
