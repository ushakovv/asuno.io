/**
 * Created by vasa on 26.03.14.
 */

(function () {
  'use strict';

  angular.module('asuno')
    .directive('navigation', function navigation() {
      return {
        replace     : true,
        templateUrl : '/assets/templates/rdps-navigation.html',
        scope       : {
          rdps : '='
        },
        controller  : 'SidebarCtrl as sidebar'
      };
    })
    .directive('controllerSearchTerm', function controllerSearchTerm() {
      return {
        replace     : true,
        templateUrl : '/assets/templates/controller-search-term.html',
        scope       : {
          controller : '=controllerSearchTerm'
        },
        controller: 'ControllerSearchTermController as controllerSearchTerm'
      };
    })
    .controller('ControllerSearchTermController', function ControllerSearchTermController($scope) {
      $scope.$watch('controller', function (next) {
        if (next.alarms.connection.length) {
          $scope.indicatorClass = 'rdp-navigation__rdp-list__rdp__controller--offline';
        } else if (next.enabled) {
          $scope.indicatorClass = 'rdp-navigation__rdp-list__rdp__controller--enabled';
        } else if (!next.enabled) {
          $scope.indicatorClass = 'rdp-navigation__rdp-list__rdp__controller--disabled';
        }

        if (next.alarms.common_alarm.length || next.alarms.door.length || next.alarms.fire.length || next.alarms.lock.length) {
          delete $scope.indicatorClass;
        }
      });
    });
})();
