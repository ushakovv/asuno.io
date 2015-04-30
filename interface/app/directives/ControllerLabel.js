/**
 * Created by vasa on 10.06.14.
 */

(function () {
  'use strict';

  function ControllerLabel() {
    return {
      replace     : true,
      templateUrl : '/assets/templates/controller-label.html',
      scope       : {
        controller : '=controllerLabel',
        rdp        : '='
      },
      controller  : 'ControllerLabelCtrl as cl'
    };
  }

  angular.module('asuno').directive('controllerLabel', ControllerLabel);
})();
