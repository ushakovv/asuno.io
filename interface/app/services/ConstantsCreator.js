(function () {
  'use strict';

  function ConstantsCreator($log) {
    this.create = function(prefix, map) {
      var constants = {};
      Object.keys(map).forEach(function (key) {
        constants[key] = prefix + '.' + key + '.' + _.uniqueId();
        $log.debug(key + ' -> ' + constants[key]);
      });
      return constants;
    };
  }

  angular.module('asuno.services').service('ConstantsCreator', ConstantsCreator);
})();
