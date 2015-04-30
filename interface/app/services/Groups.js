(function () {
  'use strict';

  function Groups(resource) {
    return resource('/api/rdp/:rdp/groups/:id', {}, {
      query             : {method : 'GET', isArray : false},
      add_controller    : {method : 'POST', url : '/api/rdp/:rdp/groups/:id/controllers'},
      remove_controller : {method : 'DELETE', url : '/api/rdp/:rdp/groups/:id/controllers/:controller_id'}
    });
  }

  angular.module('asuno.services').service('Groups', Groups);
})();
