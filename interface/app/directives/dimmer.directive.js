(function () {
  'use strict';

  function findDimmer(sensor) {
    return sensor.tag.includes('DIMMER.VOLTAGE');
  }

  angular.module('asuno')
    .directive('dimmer', function dimmer() {
      return {
        templateUrl: '/assets/templates/dimmer.tmpl.html',
        replace: true,
        scope: {
          controller: '=dimmer'
        },
        bindToController: true,
        controller: 'DimmerController as dim'
      };
    })
    .controller('DimmerController', function DimmerController($rootScope, $scope, Controllers, Auth, MassOperations) {
      var dim = this;

      $scope.$watch('dim.controller.other_sensors', function (next) {
        var oldDimmer = dim.dimmer;
        dim.dimmer = angular.copy(_.find(next, findDimmer));

        if (dim.dimmer && (!oldDimmer || typeof dim.dimmerReading === 'undefined' || oldDimmer.current_reading === dim.dimmerReading)) {
          dim.dimmerReading = dim.dimmer.current_reading;
        }
      });

      dim.setDimmerVoltage = function (dimmerReading) {
        var operations = [
          {
            name: dim.controller.name,
            promise: function () {
              return Controllers.change({
                controller: dim.controller.id
              }, {
                command: 'dimmer:set_level',
                parameters: [dimmerReading]
              }).$promise;
            },
            toRdp: {
              controller_id: dim.controller.id,
              command: 'dimmer:set_level',
              parameters: [dimmerReading]
            }
          }
        ];

        var operation = MassOperations.createOperation(`Установка диммера на ${dimmerReading} В`, operations, Auth.isSupervisor());

        $rootScope.$broadcast('asuno-progress-start', operation);
      };
    });
})();
