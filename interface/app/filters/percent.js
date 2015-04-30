/**
 * Created by vasa on 10.06.14.
 */

(function () {
  'use strict';

  function normalize(input) {
    if (typeof input !== 'number') {
      input = parseFloat(input) || 0;
    }
    return Math.max(0, Math.min(100, Math.round(input * 100)));
  }

  function percent() {
    return function (input) {
      return normalize(input) + '%';
    };
  }

  angular.module('asuno').filter('percent', percent);
})();
