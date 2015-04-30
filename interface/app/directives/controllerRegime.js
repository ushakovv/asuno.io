/**
 * Created by vasa on 10.09.14.
 */

(function () {
  'use strict';

  function controllerRegime() {
    return {
      replace     : true,
      templateUrl : '/assets/templates/controller-regime.html',
      scope       : {
        controller : '=controllerRegime'
      }
    };
  }

  angular.module('asuno').directive('controllerRegime', controllerRegime);
})();
