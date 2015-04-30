/**
 * Created by vasa on 13.06.14.
 */

(function () {
  'use strict';

  function teleSignal($rootScope, $modal, Monitors) {
    return {
      replace     : true,
      templateUrl : '/assets/templates/tele-signal.html',
      scope       : {
        events       : '=teleSignal',
        src          : '@iconSrc',
        srcDisabled  : '@iconSrcDisabled',
        activeText   : '@',
        inactiveText : '@'
      },
      link        : function (scope) {
        scope.$watch('events', function (next) {
          if (next.length) {
            scope.isEnabled = Monitors.isActive(next);
            scope.isAfterKvit = Monitors.isAfterKvit(next);
            scope.lastAction = Monitors.lastAction(next);
          } else {
            scope.isEnabled = false;
            scope.isAfterKvit = false;
          }
        });
      }
    };
  }

  angular.module('asuno').directive('teleSignal', teleSignal);
})();
