/**
 * Created by vasa on 01.09.14.
 */

(function () {
  'use strict';

  angular.module('asuno')
    .directive('connStatus', function connStatus(ServersStore) {
      return {
        replace    : true,
        priority   : 1000,
        template   : '<button class="btn btn-default btn-img btn-img--connection-systems" ng-click="openConnModal()" title="Системы связи"></button>',
        scope      : true,
        link       : function (scope) {
          scope.server = {};

          function setServerStatus() {
            scope.server = ServersStore.getServer(1);
          }

          setServerStatus();

          ServersStore.addChangeListener(setServerStatus);

          scope.$on('$destroy', function () {
            ServersStore.removeChangeListener(setServerStatus);
          });
        },
        controller: 'ConnStatusController as connStatus'
      };
    })
    .controller('ConnStatusController', function ConnStatusController($scope, $modal) {
      $scope.openConnModal = function () {
        $modal.open({
          templateUrl : '/assets/templates/modals/conn-modal.html',
          scope       : $scope.$new()
        });
      };
    });

})();
