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
        eventsSecond : '=teleSignalSecond',
        src          : '@iconSrc',
        srcDisabled  : '@iconSrcDisabled',
        activeText   : '@',
        secondActiveText   : '@',
        inactiveText : '@'
      },
      link        : function (scope) {
        scope.$watch('events', function (next) {
          if (next && next.length) {
            scope.isEnabled = Monitors.isActive(next);
            scope.isAfterKvit = Monitors.isAfterKvit(next);
            scope.lastAction = Monitors.lastAction(next);
          } else {
            scope.isEnabled = false;
            scope.isAfterKvit = false;
          }
        });
        scope.$watch('eventsSecond', function (next) {
          if (next && next.length) {
            scope.isSecondEnabled = Monitors.isActive(next);
            scope.isSecondAfterKvit = Monitors.isAfterKvit(next);
            scope.secondLastAction = Monitors.lastAction(next);
          } else {
            scope.isSecondEnabled = false;
            scope.isSecondAfterKvit = false;
          }
        });
      }
    };
  }

  angular.module('asuno').directive('teleSignal', teleSignal);
})();
