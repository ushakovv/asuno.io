(function() {
  'use strict';

  angular.module('asuno')
    .directive('telemetry', function telemetry() {
      return {
        replace: true,
        templateUrl: '/assets/templates/telemetry.tmpl.html',
        scope: {
          controller: '=',
          hideSensors: '=hideSensors',
          hideButton: '=hideButton'
        },
        bindToController: true,
        controller: 'TelemetryController as telemetry'
      };
    })
    .controller('TelemetryController', function TelemetryController($rootScope, SensorGraph) {
      this.showGraph = false;
      this.openSensorGraphModal = SensorGraph.open;

      this.changeSensors = $rootScope.changeSensors;

    })
    .controller('GraphModalController', function GraphModalController($scope, $rootScope, Sensors, sensor) {
      const graphModal = this;
      const powerData = $rootScope.getPowerValues();


      this.sensor = sensor;
      this.minDateTo = null;
      $scope.$watch('graphForm.fromDate.$dateValue', function (newVal) {
        if (!newVal) {
          return;
        }
        graphModal.minDateTo = moment(newVal).add(-1, 'd').toString();
      });

      this.load = function (conf) {
        graphModal.loading = true;
        graphModal.errors = [];
        graphModal.between = [conf.dateFrom.getTime(), conf.dateTo.getTime()];
        const storageSensors = [];
        const storageMaxPower = [];
        const storageAvgPower = [];
        function loadData(sensor, storageSensors, powerData, storageMaxPower, storageAvgPower) {

          const getSensorHistory = Sensors.history(sensor.sid, conf.dateFrom, (response) => new Date(response.data.last_date) >= conf.dateTo);

          return getSensorHistory.then((data) => {
            const max = _(data).filter((item) => item.timestamp.getTime() < conf.dateTo.getTime())
              .forEach((item) => storageSensors.push([item.timestamp.getTime(), item.value]))
              .max('value');

            graphModal.forcey = [0, max.value || 0];

            // if this is Power
            if (sensor.notation === 'P') {
              if (powerData.avgPower.isError) {
                graphModal.errors.push(powerData.avgPower.errorMsg);
              } else {
                storageAvgPower.push([conf.dateFrom.getTime(), powerData.avgPower.value]);
                storageAvgPower.push([conf.dateTo.getTime(), powerData.avgPower.value]);
                //storageSensors.forEach((item) => storageAvgPower.push([item[0], powerData.avgPower.value]));
              }

              if (powerData.maxAllowedPower.isError) {
                graphModal.errors.push(powerData.maxAllowedPower.errorMsg);
              } else {
                storageSensors.forEach((item) => storageMaxPower.push([item[0], powerData.maxAllowedPower.value]));
              }
            }
          });
        }

        loadData(this.sensor, storageSensors, powerData, storageMaxPower, storageAvgPower)
          .then(() => {
            this.data = [{
              key: this.sensor.hr_name,
              values: storageSensors
            }];
            if (storageMaxPower.length > 0) {
              this.data.push({
                key: 'Максимально допустимая мощность',
                values: storageMaxPower,
                color: '#ff7f0e'
              });
            }
            if (storageAvgPower.length > 0) {
              this.data.push({
                key: 'Средне статистическая мощность',
                values: storageAvgPower,
                color: '#2ca02c'
              });
            }
          })
          .then(() => graphModal.loading = false);



        this.xAxisTickFormat = function (d) {
          return moment(d).format('DD.MM HH:mm');
        };

        this.yAxisTickFormat = function(d) {
          return `${(d || 0).toFixed(2)} ${graphModal.sensor.measurement}`;
        };
      };

      this.conf = {
        dateTo : moment().toDate(),
        dateFrom : moment().add(-1, 'd').toDate()
      };

      this.load(graphModal.conf);

  });
})();
