/**
 * Created by vasa on 07.10.14.
 */

(function () {
  'use strict';

  function _checkActiveSunSensor(sensor) {
    return sensor.tag.includes('.LS') &&
      new Date(sensor.last_reading_timestamp).getFullYear() !== 1970 &&
      typeof sensor.current_reading === 'number' &&
      sensor.current_reading >= 0;
  }

  angular.module('asuno')
    .directive('sunLevel', function sunLevel() {
      return {
        replace          : true,
        templateUrl      : '/assets/templates/sun-level.html',
        bindToController : true,
        controller       : 'SunLevelController as sun'
      };
    })
    .controller('SunLevelController', function SunLevelController($scope, $rootScope, $interval, SensorsStore, Schedule, ClockStore) {
      const sun = this;

      sun.offline = true;

      function loadSchedule() {
        Schedule.get({time : moment(ClockStore.getTime()).format('YYYY-MM-DD')}, function (data) {
          sun.datetime_on = new Date(data.datetime_on);

          var time = moment(sun.datetime_on);
          time = time.hour(time.hour()-3).format('HH:MM');
          $rootScope.datetime_on = time;
        });
        Schedule.get({time : moment(ClockStore.getTime()).add(-1, 'd').format('YYYY-MM-DD')}, function (data) {
          sun.datetime_off = new Date(data.datetime_off);
          var time = moment(sun.datetime_off);
          time = time.hour(time.hour()-3).format('HH:MM');
          $rootScope.datetime_off = time;
        });
      }

      loadSchedule();

      sun.alarmTooltip = function () {
        const current = ClockStore.getTime();

        if (Math.abs(sun.datetime_on - current) < 1000 * 60 * 10) {
          return `включение освещения в ${moment(sun.datetime_on).format('HH:mm')}`;
        } else if (Math.abs(sun.datetime_off - current) < 1000 * 60 * 10) {
          return `выключения освещения в ${moment(sun.datetime_off).format('HH:mm')}`;
        }
      };

      function setSunSensors() {
        const sensors = SensorsStore.getSensors()
          .filter(_checkActiveSunSensor);

        if (sensors) {
          sun.sensor = (sensors || [])[0];
          delete sun.offline;
        }
      }

      setSunSensors();

      SensorsStore.addChangeListener(setSunSensors);
      const schedule = $interval(loadSchedule, 1000 * 60 * 60);

      $scope.$on('$destroy', function () {
        SensorsStore.removeChangeListener(setSunSensors);
        $interval.cancel(schedule);
      });
    });
})();
