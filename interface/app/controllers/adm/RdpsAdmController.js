(function () {
  'use strict';

  function RdpsAdmController($scope, rdps, $log) {
    $log.debug(rdps);
    $scope.rdps = rdps;
  }

  angular.module('asuno').controller('RdpsAdmController', RdpsAdmController);
})();
