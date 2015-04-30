/**
 * Created by vasa on 09.07.14.
 */

(function () {
  'use strict';

  function controllerPopup() {
    return {
      replace     : true,
      templateUrl : '/assets/templates/controllerPopup.html',
      scope       : {
        controller : '='
      }
    };
  }

  angular.module('asuno').directive('controllerPopup', controllerPopup);
})();
