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
          data = data.schedule;

          sun.datetime_on = new Date(data.datetime_on);
          var time_on = moment(sun.datetime_on).format('HH:mm');
          $rootScope.datetime_on = time_on;

          sun.datetime_off = new Date(data.datetime_off);
          var time_off = moment(sun.datetime_off).format('HH:mm');
          $rootScope.datetime_off = time_off;
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
