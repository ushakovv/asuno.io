/**
 * Created by vasa on 13.06.14.
 */

(function () {
  'use strict';

  function controllerSimpleBlock() {
    return {
      replace     : true,
      templateUrl : '/assets/templates/controller-simple-block.html',
      scope       : {
        controller : '='
      }
    };
  }

  angular.module('asuno').directive('controllerSimpleBlock', controllerSimpleBlock);
})();
