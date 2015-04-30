/**
 * Created by vasa on 09.07.14.
 */

(function () {
  'use strict';

  function controllerBlockAlarm(Monitors) {
    return {
      replace  : true,
      template : '<img ng-src="{{src}}" class="controller-alarm-icon" ng-class="{\'controller-alarm-icon--icon-active\': isEnabled, \'controller-alarm-icon--icon-active--nokvit\': isAfterKvit}"/>',
      scope    : {
        event : '=',
        src   : '@controllerBlockAlarm'
      },
      link     : function (scope) {
        scope.$watch('event', function (next) {
          if (next && next.length) {
            scope.isEnabled = Monitors.isActive(next);
            scope.isAfterKvit = Monitors.isAfterKvit(next);
          } else {
            scope.isEnabled = false;
            scope.isAfterKvit = false;
          }
        });
      }
    };
  }

  angular.module('asuno').directive('controllerBlockAlarm', controllerBlockAlarm);
})();
