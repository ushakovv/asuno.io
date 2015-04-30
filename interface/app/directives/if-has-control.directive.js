(function () {
  'use strict';

  angular.module('asuno')
    .directive('ifHasControl', function ifHasControl() {
      return {
        replace          : false,
        scope            : true,
        bindToController : true,
        controller       : 'IfHasControlController as ihc'
      };
    })
    .controller('IfHasControlController', function IfHasControlController($scope, $rootScope, $element, Auth) {
      var ihc = this;

      ihc.hasControl = function () {
        return Auth.hasControl() && !$rootScope.timelineState.show;
      };

      $scope.$watch(ihc.hasControl, function (next) {
        if (next) {
          $element.show();
        } else {
          $element.hide();
        }
      });
    });
})();
