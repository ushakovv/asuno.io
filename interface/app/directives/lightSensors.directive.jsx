(function () {
  'use strict';

  function lightSensors($injector, SensorGraph) {
    return {
      replace  : true,
      template : '<div></div>',
      scope    : true,
      link     : function (scope, element) {
        scope.openGraph = SensorGraph.open;

        React.render(<REACT.LightSensorList openGraph={scope.openGraph} ngInjector={$injector} />, element[0]);

        scope.$on('$destroy', function () {
          React.unmountComponentAtNode(element[0]);
        });
      }
    };
  }

  angular.module('asuno').directive('lightSensors', lightSensors);
})();
