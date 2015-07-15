(function () {
  'use strict';

  function serverDate(ClockStore) {
    return function (time) {
      if (!time) {
        return void 0;
      }
      if ( isNaN( time * 1 ) && time.indexOf('Z') < 0 ) {
        time = time + 'Z';
      }
      return ClockStore.adjustTime(time);
    };
  }

  serverDate.$stateful = true;

  angular.module('asuno').filter('serverDate', serverDate);
})();
