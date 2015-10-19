/**
 * Created by vasa on 01.10.14.
 */

(function () {
  'use strict';

  function ControllerAdmCtrl($scope, $state, Controllers, Cameras, UFAP, rdp, controller, $rootScope, $log) {

    $scope.rdp = rdp;
    $scope.controller = controller;
    $scope.controller.profile = controller.gis_id;
    $scope.isAdmin = true;
    this.search = function (name) {
      return UFAP.search({name : name}).$promise.then(function (data) {
        return data.profiles;
      });
    };

    this.updateControllerData = function (ctrl, profile) {
      ctrl.address = profile.address || ctrl.address;
      ctrl.name = profile.pp_type + ' ' + profile.pp_name || ctrl.name;
    };

    $scope.child = $scope.$new();

    $scope.pointFilter = function (attributes) {
      return attributes.PP_ID === $scope.controller.gis_id;
    };

    $scope.cameraExtractor = function (graphic) {
      var cameras = $scope.controller.cameras.map(function (camera) {
        return camera.uuid;
      });

      if (cameras.indexOf(graphic.attributes.Id) >= 0) {
        return 1;
      }
    };

    $scope.cameraConnect = function (attributes) {
      return _.find($scope.controller.cameras, function (camera) {
        return camera.uuid === attributes.Id;
      });
    };

    $scope.addCamera = function (camera) {
      return Controllers.add_camera({id : controller.id}, camera)
        .$promise
        .then(function () {
          return Controllers.get({controller : controller.id}).$promise;
        })
        .then(function (controller) {
          controller.cameras
            .filter(function (cam) {
              return cam.uuid === camera.uuid;
            }).forEach(function (cam) {
              $scope.controller.cameras.push(cam);
            });
        });
    };

    $scope.removeCamera = function (attributes) {
      var camera = $scope.cameraConnect(attributes);
      return Cameras.delete({id : camera.id})
        .$promise
        .then(function () {
          $scope.controller.cameras = _.filter($scope.controller.cameras, function (cam) {
            return cam.uuid !== attributes.Id;
          });
        });
    };

    $scope.controllerConnect = function (attributes) {
      if (attributes.PP_ID === $scope.controller.gis_id) {
        return $scope.controller;
      }
    };

    $scope.selectController = function (controller) {
      $state.go('core.controller', {rdp : $scope.rdp.slug, controller : controller.id});
    };

    $scope.closeErrors = function () {
      delete $scope.error;
    };

    $scope.updateController = function (controller) {
      delete $scope.error;
      $scope.loading = true;

      var data = {
        tag: controller.tag,
        name    : controller.name,
        checked    : controller.checked,
        address : controller.address
      };

      if (controller.profile) {
        data.gis_id = controller.profile.id;
      }

      Controllers.patch({id : controller.id}, data).$promise.then(function () {
        delete $scope.loading;
      }, function () {
        $scope.error = 'Произошла ошибка при сохранении.';
        delete $scope.loading;
      });
    };

    $rootScope.changeSensors = function () {
      const params = {id: $scope.controller.id };

      if ( $scope.controller.sensors.length > 0) {

        Controllers.delete_sensore(params, $scope.controller).$promise
            .then(function () {
              $scope.$broadcast('asuno-refresh-all');
            }, function(data) {
              $scope.error = 'Произошла ошибка изменения счетчика.';
              $log.debug('Произошла ошибка изменения счетчика.', data);
            });
      } else {
        Controllers.add_sensore(params, $scope.controller).$promise
            .then(function () {
              $scope.$broadcast('asuno-refresh-all');
            }, function(data) {
              $scope.error = 'Произошла ошибка изменения счетчика.';
              $log.debug('Произошла ошибка изменения счетчика.', data);
            });
      }
    };

    function setController() {
      if ( !$scope.loading ) {
        delete $scope.error;
        $scope.loading = true;
        Controllers.get({
          controller: $scope.controller.id
        }, function (controller) {
            $scope.controller = controller;
            $scope.controller.profile = controller.gis_id;
            delete $scope.loading;
        }, function() {
            delete $scope.loading;
        });
      }
    }

    $scope.$on('asuno-refresh-all', setController);
  }

  angular.module('asuno').controller('ControllerAdmCtrl', ControllerAdmCtrl);
})();
