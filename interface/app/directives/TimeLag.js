/**
 * Created by vasa on 10.06.14.
 */

(function () {
  'use strict';

  var calculateLag = function (timestamp, origin) {
    return Math.abs(origin.getTime() - timestamp.getTime());
  };

  angular.module('asuno')
    .directive('timeLag', function timeLag() {
      return {
        replace     : true,
        templateUrl : '/assets/templates/time-lag.html',
        scope       : {
          lag       : '=timeLag',
          timestamp : '=timestamp',
          once      : '@'
        },
        controller: 'TimeLagController as timeLag'
      };
    })
    .controller('TimeLagController', function TimeLagController($scope, $interval, ClockStore) {
      var tick = function () {
        var lag = Math.abs($scope.lag) * 1000 || calculateLag(new Date($scope.timestamp), ClockStore.getTime());
        var hours = Math.floor(lag / 3600000);
        lag = lag - hours * 3600000;
        var minutes = Math.floor(lag / 60000);
        lag = lag - minutes * 60000;
        var seconds = Math.floor(lag / 1000);

        if (hours < 10) {
          hours = '0' + hours;
        }
        if (minutes < 10) {
          minutes = '0' + minutes;
        }
        if (seconds < 10) {
          seconds = '0' + seconds;
        }

        $scope.hours = hours;
        $scope.minutes = minutes;
        $scope.seconds = seconds;

        if ($scope.lag && $scope.lag < 0) {
          $scope.hours = '- ' + $scope.hours;
        }
      };

      tick();

      if (!$scope.once) {
        var loop = $interval(tick, 1000);

        $scope.$on('$destroy', function () {
          $interval.cancel(loop);
        });
      }

      $scope.$watch('timestamp', function (next) {
        $scope.never = new Date(next || 0).getFullYear() === 1970;
        tick();
      });
    });

})();
