(function () {
  'use strict';

  function serverDate(ClockStore) {
    return function (time) {
      if (!time) {
        return void 0;
      }
      return ClockStore.adjustTime(time);
    };
  }

  serverDate.$stateful = true;

  angular.module('asuno').filter('serverDate', serverDate);
})();
