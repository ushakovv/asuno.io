/**
 * Created by vasa on 01.09.14.
 */

(function () {
  'use strict';

  angular.module('asuno')
    .directive('serverStatus', function serverStatus(ServersStore) {
      return {
        replace    : true,
        priority   : 1000,
        template   : `<button class="btn btn-default btn-img" ng-click="openServerModal()">
                        <img ng-src="{{massSrc(server)}}"/>
                      </button>`,
        link       : function (scope) {
          scope.server = {};

          function hasOffline(server) {
            return server && _.any(server.monitors, (point) => !point.online);
          }

          scope.massSrc = function (server) {
            return hasOffline(server) ? '/assets/img/servers-alarm.gif' : '/assets/img/menu/connection.png';
          };

          function setServerStatus() {
            scope.server = ServersStore.getServer(0);
          }

          setServerStatus();

          ServersStore.addChangeListener(setServerStatus);

          scope.$on('$destroy', function () {
            ServersStore.removeChangeListener(setServerStatus);
          });
        },
        controller: 'ServerStatusController as serverStatus'
      };
    })
    .controller('ServerStatusController', function ServerStatusController($scope, $modal) {
      $scope.openServerModal = function () {
        $modal.open({
          templateUrl : '/assets/templates/modals/servers-modal.html',
          scope       : $scope.$new()
        });
      };
    });

})();
