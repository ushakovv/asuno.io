/**
 * Created by vasa on 15.09.14.
 */

(function () {
  'use strict';

  function States(resource) {
    return resource('/api/states/:id', {}, {
      query : {method : 'GET', isArray : true, transformResponse : function (data) {
        angular.fromJson(data).states;
      }}
    });
  }

  angular.module('asuno').service('States', States);
})();
