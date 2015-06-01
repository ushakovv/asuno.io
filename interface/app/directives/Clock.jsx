(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name clock
   * @restrict E
   *
   * @description
   * A simple directive to display a live clock.
   *
   * @example
   <example module='asuno'>
   <file name='index.html'>
   <div>
   <div clock></div>
   </div>
   </file>
   </example>
   */
  function Clock($injector) {
    return {
      replace  : true,
      template : '<div/>',
      scope    : true,
      link     : function (scope, element) {
        React.render(
          <REACT.Clock ngInjector={$injector} />,
          element[0]
        );

        scope.$on('$destroy', function () {
          React.unmountComponentAtNode(element[0]);
        });
      }
    };
  }

  angular.module('asuno').directive('clock', Clock);
})();
