/**
 * Created by vasa on 22.08.14.
 */

(function () {
  'use strict';

  function Mute(resource) {
    return resource('/api/events/:id/mute', {}, {
      mute_event      : {method : 'POST'},
      mute_controller : {method : 'POST', url : '/api/controllers/:id/acknowledge'}
    });
  }

  angular.module('asuno.services').service('Mute', Mute);
})();
