/**
 * Created by vasa on 15.09.14.
 */

(function () {
  'use strict';

  var hour = 1000 * 60 * 60;

  /**
   * Если дата меньше минимальной, то отправить её на 1 час в будущее
   * @param {Date} date дата
   * @param {Date} minDate минимальная дата
   * @returns {Date}
   */
  var makeAfterMinDate = function (date, minDate) {
    minDate = new Date(Math.max(new Date().getTime(), minDate.getTime()));
    if (!date || date <= minDate) {
      return new Date(minDate.getTime() + hour);
    } else {
      return date;
    }
  };

  function MaintenancePopupCtrl($rootScope, $scope, $q, $modalInstance, Controllers) {
    $scope.maintenance = {date_from : new Date()};

    $scope.save = function (maintenance) {
      delete $scope.error;
      $scope.loading = true;

      var date_from;
      if (maintenance.date_from && maintenance.date_from > new Date()) {
        date_from = maintenance.date_from;
      }

      var requests = $scope.selectedControllers
        .filter(function (ctrl) {
          return !ctrl.maintenance;
        })
        .map(function (ctrl) {
          return Controllers.maintenance(
            {controller : ctrl.id},
            {date_from : date_from, date_to : maintenance.date_to, reason : maintenance.reason}
          ).$promise;
        });

      $q.all(requests).then(function () {
        $rootScope.$broadcast('asuno-refresh-all');
        $modalInstance.close();
      }, function () {
        delete $scope.loading;

        if ($scope.maintenance.date_to < new Date()) {
          $scope.error = 'Нельзя установить профилактику задним числом';
        } else {
          $scope.error = 'Произошла ошибка';
        }
      });
    };

    $scope.$watch('maintenance.date_from', function (next) {
      if (!next) {
        $scope.maintenance.date_from = new Date();
      }
      $scope.maintenance.date_to = makeAfterMinDate(next, $scope.maintenance.date_from);
    });

    $scope.$watch('maintenance.date_to', function (next) {
      $scope.maintenance.date_to = makeAfterMinDate(next, $scope.maintenance.date_from);
    });
  }

  angular.module('asuno').controller('MaintenancePopupCtrl', MaintenancePopupCtrl);
})();
