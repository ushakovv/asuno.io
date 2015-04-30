(function () {
  'use strict';

  function controllerBlock($injector) {
    return {
      replace : false,
      scope   : {
        controller : '=controllerBlock',
        choose     : '='
      },
      link    : function (scope, element) {
        var handleClick = function (controller) {
          scope.choose(controller);
        };

        React.render(
          <REACT.ControllerBlock ngInjector={$injector} controller={scope.controller} choose={handleClick} />,
          element[0]
        );

        scope.$on('$destroy', function () {
          React.unmountComponentAtNode(element[0]);
        });
      }
    };
  }

  angular.module('asuno').directive('controllerBlock', controllerBlock);
})();
