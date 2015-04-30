(function () {
  'use strict';

  function Cameras(resource) {
    return resource('/api/cameras/:id', {}, {
      get      : {method : 'GET', transformResponse : (data) => angular.fromJson(data).camera},
      snapshot : {method : 'POST', url : '/api/cameras/:id/snapshot'},
      update   : {method : 'PATCH'},
      comment  : {method : 'POST', url : '/api/snapshots/:id/comment'}
    });
  }

  angular.module('asuno.services').service('Cameras', Cameras);
})();
