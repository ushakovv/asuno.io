/**
 * Created by vasa on 14.07.14.
 */

(function () {
  'use strict';

  function Events(resource) {
    return resource('/api/events', {}, {
      query: {isArray : false},
      comment: {method : 'POST', url : '/api/events/:id/comment'},
      create_issue: {method : 'POST', url : '/api/events/:id/create_issue'}
    });
  }

  angular.module('asuno').service('Events', Events);
})();
