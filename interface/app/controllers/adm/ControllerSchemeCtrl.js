(function () {
  'use strict';

  function ControllerSchemeCtrl($scope, $state, Controllers) {

    const loadController = _.debounce(() => {
      Controllers.get({controller: $scope.controller.id}).$promise
        .then((controller) => $scope.controller = controller)
        .then(() => $scope.$applyAsync());
    }, 1000);

    $scope.$on('asuno-refresh-all', loadController);

  }

  angular.module('asuno').controller('ControllerSchemeCtrl', ControllerSchemeCtrl);
})();
