/**
 * Created by vasa on 19.08.14.
 */

(function () {
  'use strict';

  angular.module('asuno')
    .directive('filterBadge', function filterBadge() {
      return {
        replace    : true,
        template   : `<li class="filters__item" ng-class="{'active': current(objectFilter), 'disabled': !enabled}">
                        <a href="" ng-click="click()">{{name}} <span class="badge">{{count(objectFilter)}}</span></a>
                      </li>`,
        scope      : {
          objectFilter : '@filterBadge',
          name         : '@',
          setFilter    : '=',
          count        : '=',
          current      : '='
        },
        controller: 'FilterBadgeController as filterBadge'
      };
    })
    .controller('FilterBadgeController', function FilterBadgeController($scope, FILTER_CONFIGS) {
      $scope.enabled = !!FILTER_CONFIGS[$scope.objectFilter];

      $scope.click = function () {
        if ($scope.enabled) {
          $scope.setFilter($scope.objectFilter);
        }
      };
    });

})();
