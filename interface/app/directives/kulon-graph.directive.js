(function() {
  'use strict';

  function findSensor(controller, suffix) {
    return _.find(controller.sensors, (sensor) => sensor.tag.includes(suffix));
  }

  angular.module('asuno')
    .directive('kulonGraph', function kgGraph() {
      return {
        templateUrl: '/assets/templates/kulon-graph.tmpl.html',
        scope: {
          controller: '=kulonGraph',
          monitor: '@monitor',
          forcey: '@forcey',
          dimension: '@dimension'
        },
        bindToController: true,
        controller: 'KulonGraphController as kg'
      };
    })
    .controller('KulonGraphController', function KulonGraphController($q, Sensors, ClockStore) {
      var kg = this;

      var now = ClockStore.getTime();
      var after = moment(now).add(-2, 'd').toDate();

      kg.between = [after.getTime(), now.getTime()];

      var phaseOneData = [],
        phaseTwoData = [],
        phaseThreeData = [];

      function loadMonitor(name, storage) {
        var monitor = findSensor(kg.controller, name);

        return Sensors.history(monitor.sid, after)
          .then(function (data) {
            data.forEach(function (item) {
              storage.push([item.timestamp.getTime(), item.value]);
            });
          });
      }

      var promise1 = loadMonitor(`.${kg.monitor}_1`, phaseOneData);
      var promise2 = loadMonitor(`.${kg.monitor}_3`, phaseTwoData);
      var promise3 = loadMonitor(`.${kg.monitor}_2`, phaseThreeData);

      $q.all([promise1, promise2, promise3]).then(() => kg.loadFinished = true);

      this.data = [
        {
          key: 'фаза 1',
          color: '#c70000',
          values: phaseOneData
          }, {
          key: 'фаза 2',
          color: '#00c700',
          values: phaseTwoData
          }, {
          key: 'фаза 3',
          color: '#c7c700',
          values: phaseThreeData
          }
        ];

      this.xAxisTickFormat = function (d) {
        return moment(d).format('DD.MM HH:mm');
      };

      this.yAxisTickFormat = function(d) {
        return `${(d || 0).toFixed(2)} ${kg.dimension}`;
      };
    });
})();
