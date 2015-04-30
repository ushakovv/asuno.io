(function() {
  'use strict';

  function TimelineService() {
    return new EventEmitter();
  }

  angular.module('asuno').factory('TimelineService', TimelineService);
})();
