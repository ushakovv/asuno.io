(function () {
  'use strict';

  function Utils() {

    /**
     * @param {Array<*>} first
     * @param {Array<*>} second
     * @returns {boolean}
     */
    this.same = function (first, second) {
      return first.length === second.length && _.all(first, (item) => second.includes(item));
    };
  }

  angular.module('asuno.services').service('Utils', Utils);
})();
