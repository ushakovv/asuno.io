(function () {
  'use strict';

  function RdpsAdmController($scope, rdps) {
    $scope.rdps = rdps;
  }

  angular.module('asuno').controller('RdpsAdmController', RdpsAdmController);
})();
