(function () {
  'use strict';

  function Schedule(resource) {
    return resource('/api/schedule/:time', {}, {});
  }

  angular.module('asuno.services').service('Schedule', Schedule);
})();
