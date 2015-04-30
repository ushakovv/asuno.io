(function () {
  'use strict';

  angular.module('asuno').filter('moment', function momentFilter() {
    return function (input, format, inputFormat) {
      return moment(input, inputFormat).format(format);
    };
  });
})();
