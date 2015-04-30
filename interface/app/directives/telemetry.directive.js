(function() {
  'use strict';

  angular.module('asuno')
    .directive('telemetry', function telemetry() {
      return {
        replace: true,
        templateUrl: '/assets/templates/telemetry.tmpl.html',
        scope: {
          controller: '='
        },
        bindToController: true,
        controller: 'TelemetryController as telemetry'
      };
    })
    .controller('TelemetryController', function TelemetryController($rootScope, SensorGraph) {

      this.showGraph = false;

      this.openSensorGraphModal = SensorGraph.open;
    })
    .controller('GraphModalController', function GraphModalController($scope, $log, Sensors, sensor) {
      const graphModal = this;

      this.sensor = sensor;

      this.load = function (conf) {
        graphModal.loading = true;
        graphModal.between = [conf.dateFrom.getTime(), conf.dateTo.getTime()];

        const data = [];

        function loadData(sensor, storage) {
          return Sensors.history(sensor.sid, conf.dateFrom, (response) => new Date(response.data.last_date) >= conf.dateTo)
            .then(function (data) {
              const max = _(data)
                .filter((item) => item.timestamp.getTime() < conf.dateTo.getTime())
                .forEach((item) => storage.push([item.timestamp.getTime(), item.value]))
                .max('value');

              graphModal.forcey = [0, max.value || 0];
            });
        }

        loadData(this.sensor, data)
          .then(() => graphModal.loading = false);

        this.data = [
          {
            key: this.sensor.hr_name,
            values: data
          }
        ];

        this.xAxisTickFormat = function (d) {
          return moment(d).format('DD.MM HH:mm');
        };

        this.yAxisTickFormat = function(d) {
          return `${(d || 0).toFixed(2)} ${graphModal.sensor.measurement}`;
        };
      };
    });
})();
