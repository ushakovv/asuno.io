(function () {
  'use strict';

  var _adminStates = {
    'core.rdps': 'adm.rdps',
    'core.rdp': 'adm.rdp',
    'core.controller': 'adm.controller.scheme'
  };

  angular.module('asuno')
    .directive('adminButton', function adminButton() {
      return {
        template   : '<a ng-href="{{ href }}" class="btn btn-default btn-img btn-img--icon-settings-asuno" title="Администрирование"></a>',
        replace    : true,
        scope      : true,
        controller: 'AdminButtonController as adminButton'
      };
    })
    .controller('AdminButtonController', function AdminButtonController($scope, $rootScope, $state) {
      $scope.adminHref = function () {
        if (_adminStates[$state.current.name]) {
          $scope.href = $state.href(_adminStates[$state.current.name], $state.params);
        } else {
          $scope.href = $state.href('adm.rdps');
        }
      };

      $scope.adminHref();

      $rootScope.$on('$stateChangeSuccess', $scope.adminHref);
    });

})();
