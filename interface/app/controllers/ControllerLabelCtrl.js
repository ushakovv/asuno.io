/**
 * Created by vasa on 15.08.14.
 */

(function () {
  'use strict';

  function ControllerLabelCtrl($scope, $modal, Monitors, UFAP) {

    this.isDisconnected = function () {
      return Monitors.isActive($scope.controller.alarms.connection);
    };

    this.openPassport = function () {
      $modal.open({
        templateUrl : '/assets/templates/modals/passport-modal.html',
        controller  : 'PassportCtrl',
        scope       : $scope.$new(),
        resolve     : {
          passport : function () {
            return UFAP.profile({gis_id : $scope.controller.gis_id}).$promise
              .catch(function (reason) {
                if (reason.status === 404) {
                  return {error : 'not-found'};
                } else {
                  throw reason;
                }
              });
          }
        }
      });
    };
  }

  function PassportCtrl($scope, UFAP, passport) {
    $scope.passport = passport.error ? passport : passport.profile;

    $scope.loadPassport = function () {
      $scope.loading = true;
      UFAP.load_profile({gis_id : $scope.controller.gis_id}, {})
        .$promise.finally(function () {
          $scope.loading = false;
          $scope.canReload = true;
        });
    };

    $scope.reload = function () {
      $scope.loading = true;
      UFAP.profile({gis_id : $scope.controller.gis_id})
        .$promise.then(function (passport) {
          $scope.passport = passport.profile;
        })
        .finally(function () {
          $scope.loading = false;
        });
    };
  }

  angular.module('asuno').controller('ControllerLabelCtrl', ControllerLabelCtrl);
  angular.module('asuno').controller('PassportCtrl', PassportCtrl);
})();
