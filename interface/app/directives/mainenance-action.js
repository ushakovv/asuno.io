/**
 * Created by rus on 06.10.2015.
 */

(function () {
  'use strict';

  angular.module('asuno')
    .directive('maintenanceActions', function maintenanceActions() {
      return {
        template   : '<div><button type="button" class="btn btn-xs" ng-if="isButtonVisible" ng-click="showModal()">Снять</button></div>',
        replace    : true,
        scope      : {
          entity: '=maintenanceEntity',
          dateTo: '=maintenanceDateTo',
          disabled: '=maintenanceDisabled'
        },
        controller : 'MaintenanceActionsController'
      };
    })
    .controller('MaintenanceActionsController', function MaintenanceActionsController($scope, ClockStore, $rootScope, $modal) {
      $scope.isButtonVisible = false;
      function _hideButton() {
        $scope.isButtonVisible = false;
      }
      $scope.showModal = function() {
        let controllerId = $scope.entity.controller_id;

        $modal.open({
          templateUrl : '/assets/templates/modals/progress-modal.html',
          scope       : $rootScope.$new(),
          keyboard    : false,
          backdrop    : 'static',
          controller  : function ($scope, $q, $modalInstance, Controllers) {
            $scope.operation = 'Снятие профилактики';
            $scope.allowToRdp = false;

            $scope.all = 1;
            $scope.oks = 0;
            $scope.fails = 0;

            $scope.progressItems = [];

            $scope.confirm = function () {
              $scope.confirmed = true;

              Controllers.maintenance_delete( { controller : controllerId }, { controller : controllerId })
                .$promise
                .then( (result ) => {
                  $rootScope.$broadcast('asuno-refresh-all');
                  _hideButton();
                  $scope.oks = $scope.oks + 1;
                  return {ok : true, result : result};
                }, (reason) => {
                  $scope.fails = $scope.fails + 1;
                  return {ok : false, result : reason};
                }).then(() => {
                  $scope.finished = true;
                });
            };

            $scope.chancel = function () {
              $modalInstance.close('chancel');
            };

            $scope.sendToRdp = function () {};

            $scope.okProgress = function () {
              return $scope.oks * 100 / $scope.all + '%';
            };

            $scope.failProgress = function () {
              return $scope.fails * 100 / $scope.all + '%';
            };
          }
        });
        //Кнопка "снять" должна вызывать модальное окно, аналогичное окну из представления контроллера: "снять профилактику - да/нет".
        //После снятия профилактики нужно заново подгрузить журнал профилактик, чтобы получить обновленные данные.
      };

      const getFixedTime = function (time) {
        if (isNaN( time * 1 )) {
          let pos = time.indexOf('+');
          if (pos > 0) {
            time = time.substr(0, pos);
          }
          if ( time.indexOf('Z') < 0 ) {
            time = time + 'Z';
          }
          return (new Date(time)).getTime();
        } else {
          return time;
        }
      };
      const timeTo = getFixedTime($scope.dateTo);

      let tick = function tick() {
        const timeNow = (new Date(ClockStore.getTime())).getTime();
        //дата окончания профилактики еще не настала
        //и если у профилактики атрибут maintenance.disabled равен false.
        if (timeTo > timeNow && !$scope.disabled) {
          $scope.isButtonVisible = true;
        }
      };

      tick();
    });

})();

