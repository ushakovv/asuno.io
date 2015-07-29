(function () {
  'use strict';

  function ControllerList(ControllersStore, $injector) {
    return {
      replace  : true,
      template : '<div class="row" style="margin: 0"></div>',
      scope    : {
        choose : '=controllerList',
        newTab : '=newTab'
      },
      link     : function (scope, element) {
        var handleClick = function (controller) {
          scope.choose(controller);
        };
        var handleRightClick = function (controller) {
          scope.newTab(controller);
        };
        React.render(
          <REACT.Controllers ngInjector={$injector} choose={handleClick} openNewTab={handleRightClick} />,
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
