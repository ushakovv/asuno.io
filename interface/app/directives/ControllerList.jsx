(function () {
  'use strict';

  function ControllerList(ControllersStore, $injector) {
    return {
      replace  : true,
      template : '<div class="row" style="margin: 0"></div>',
      scope    : {
        choose : '=controllerList'
      },
      link     : function (scope, element) {
        var handleClick = function (controller) {
          scope.choose(controller);
        };

        React.render(
          <REACT.Controllers ngInjector={$injector} choose={handleClick} />,
          element[0]
        );

        scope.$on('$destroy', function () {
          React.unmountComponentAtNode(element[0]);
        });
      }
    };
  }

  angular.module('asuno').directive('controllerList', ControllerList);
})();
