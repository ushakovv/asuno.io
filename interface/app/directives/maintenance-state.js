(function () {
  'use strict';

  var _maintenanceStates = {
    planned  : 'Планируется',
    during :  'В процессе',
    completed :  'Завершена'
  };

  angular.module('asuno')
    .directive('maintenanceState', function maintenanceState() {
      return {
        template   : '<div><span ng-bind="stateText"></span></div>',
        replace    : true,
        scope      : {
          dateFrom: '=maintenanceDateFrom',
          dateTo: '=maintenanceDateTo'
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
        if (timeNow < timeFrom) {
          $scope.stateText = _maintenanceStates.planned;
        } else if (timeNow < timeTo) {
          $scope.stateText = _maintenanceStates.during;
        } else {
          $scope.stateText = _maintenanceStates.completed;
        }
      };

      tick();
    });

})();
