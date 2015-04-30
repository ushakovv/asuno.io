(function () {
  'use strict';

  angular.module('asuno')
    .directive('kulonGraphs', function kulonGraphs() {
      return {
        templateUrl: '/assets/templates/kulon-graphs.tmpl.html',
        replace: true,
        scope: {
          controller: '=kulonGraphs'
        },
        bindToController: true,
        controller: 'KulonGraphsController as kulon'
      };
    })
    .controller('KulonGraphsController', function KulonGraphsController() {
      var kulon = this;

      this.currentGraph = 'I';

      kulon.setCurrent = function(graph) {
        kulon.currentGraph = graph;
      };
    });
})();
