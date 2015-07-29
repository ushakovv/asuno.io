(function () {
  'use strict';

  function controllerBlock($injector) {
    return {
      replace : false,
      scope   : {
        controller : '=controllerBlock',
        choose     : '=',
        openNewTab : '='
      },
      link    : function (scope, element) {
        var handleClick = function (controller) {
          scope.choose(controller);
        };
        var handleRightClick = function (controller) {
          scope.openNewTab(controller);
        };

        React.render(
          <REACT.ControllerBlock ngInjector={$injector} controller={scope.controller} choose={handleClick} openNewTab={handleRightClick} />,
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
