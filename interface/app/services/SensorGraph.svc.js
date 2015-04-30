(function() {
  'use strict';

  function SensorGraph($modal) {
    this.open = function(sensor) {
      return $modal.open({
        templateUrl: '/assets/templates/modals/graph-modal.html',
        controller: 'GraphModalController as graphModal',
        resolve: {
          sensor: () => sensor
        }
      });
    };
  }

  angular.module('asuno.services').service('SensorGraph', SensorGraph);
})();
