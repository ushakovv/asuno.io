(function () {
  'use strict';

  function ControllerSchemeCtrl($scope, $state) {

    $scope.$on('asuno-refresh-all', () => $state.reload());

  }

  angular.module('asuno').controller('ControllerSchemeCtrl', ControllerSchemeCtrl);
})();
