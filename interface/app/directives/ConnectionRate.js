/**
 * Created by vasa on 10.06.14.
 */

(function () {
  'use strict';

  angular.module('asuno')
    .directive('connectionRate', function connectionRate() {
      return {
        templateUrl: '/assets/templates/connection-rate.html',
        replace: true,
        scope: {
          controller: '=connectionRate'
        },
        bindToController: true,
        controller: 'ConnectionRateController as cr'
      };
    })
    .controller('ConnectionRateController', function ConnectionRateController($scope, Monitors) {
      var cr = this;

      this.isDisconnected = function() {
        return Monitors.isActive(cr.controller.alarms.connection);
      };

      switch (cr.controller.type) {
        case 'grs_kulon':
          $scope.$watch('cr.controller.other_sensors', function (next) {
            var connectionRate = _.find(next, function (sensor) {
              return sensor.tag.includes('CONNECTION.LEVEL');
            });

            cr.rate = connectionRate ? connectionRate.current_reading / 100 : 1;
          });
          break;
        case 'ahp_kulon':
          $scope.$watch('cr.controller.structure', function () {
            var connectionRate = cr.controller.monitorValue('GSM');

            cr.rate = connectionRate ? connectionRate / 100 : 1;
          });
          break;
        default:
          cr.rate = 1;
      }
    });
})();
