(function () {
  'use strict';

  function Users(resource) {
    return resource('/api/users/:id', {}, {
      query          : {
        method : 'GET', isArray : true, transformResponse : (data) => angular.fromJson(data).users
      },
      roles          : {
        method : 'GET', url : '/api/roles', isArray : true, transformResponse : (data) => angular.fromJson(data).roles
      },
      get            : {
        method : 'GET', transformResponse : (data) => angular.fromJson(data).user
      },
      update         : {method : 'PATCH'},
      set_dispatcher : {url : '/api/rdp/:rdp/dispatchers', method : 'POST'},
      set_role      : {url : '/api/users/:id/role', method : 'POST'},
      set_password   : {url : '/api/users/:id/password', method : 'POST'},
      block          : {url : '/api/users/:id/block', method : 'POST'},
      unblock        : {url : '/api/users/:id/block', method : 'DELETE'},
      get_companies       : {url : '/api/users/companies', method : 'GET'}
    });
  }

  angular.module('asuno.services').service('Users', Users);
})();
