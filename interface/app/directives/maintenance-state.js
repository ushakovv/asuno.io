(function () {
  'use strict';

  var _maintenanceStates = {
    planned  : 'Планируется',
    during :  'В процессе',
    disabled :  'Снята ',
    completed :  'Завершена'
  };
  /* TODO: если же атрибут maintenance.disabled равен True,
   то в колонке "планируется"/"завершена"/"в процессе" нужно писать "Снята (имя_пользователя)",
   заключая имя пользователя в скобки. Имя пользователя брать из атрибута maintenance.disabled_by_name.*/
  angular.module('asuno')
    .directive('maintenanceState', function maintenanceState() {
      return {
        template   : '<div><span ng-bind="stateText"></span></div>',
        replace    : true,
        scope      : {
          dateFrom: '=maintenanceDateFrom',
          dateTo: '=maintenanceDateTo',
          disabled: '=maintenanceDisabled',
          disabledByName: '=maintenanceDisabledByName'
        },
        controller: 'MaintenanceStateController'
      };
    })
    .controller('MaintenanceStateController', function MaintenanceStateController($scope, ClockStore) {
      $scope.stateText = _maintenanceStates.during;

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
      const timeFrom = getFixedTime($scope.dateFrom);
      const timeTo = getFixedTime($scope.dateTo);

      let tick = function tick() {

        const timeNow = (new Date(ClockStore.getTime())).getTime();
        if ($scope.disabled) {
          $scope.stateText = _maintenanceStates.disabled + '(' + $scope.disabledByName + ')';
        } else if (timeNow < timeFrom) {
          $scope.stateText = _maintenanceStates.planned;
        } else if (timeTo > timeNow) {
          $scope.stateText = _maintenanceStates.during;
        } else {
          $scope.stateText = _maintenanceStates.completed;
        }
      };

      tick();

      $scope.$watch('disabled', function() {
        tick();
      });
    });

})();
