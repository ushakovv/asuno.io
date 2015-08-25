/**
 * Created by vasa on 09.07.14.
 */

(function () {
  'use strict';

  function counterInputs($log) {
    return {
      replace  : true,
      template : '<form class="form-horizontal"></form>',
      scope    : {
        sensors : '=counterInputs',
        openGraph : '='
      },
      link     : function (scope, element) {
        scope.$watch('sensors', function (next) {
           $log.debug('sensors changes');
          React.render(<REACT.CounterInputList sensors={next} openGraph={scope.openGraph} />, element[0]);
        });

        scope.$on('$destroy', function () {
          React.unmountComponentAtNode(element[0]);
        });
      }
    };
  }

  angular.module('asuno').directive('counterInputs', counterInputs);
})();
