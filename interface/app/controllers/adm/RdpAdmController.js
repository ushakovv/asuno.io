/**
 * Created by vasa on 10.08.14.
 */

(function () {
  'use strict';

  /* global confirm */

  function RdpAdmController($scope, $modal, Controllers, initial, confirmation) {
    $scope.rdp = initial.rdp;
    $scope.controllers = initial.controllers;

    $scope.remove = function (ctrl) {
      confirmation(`Вы действительно хотите удалить ${ctrl.name} ?`).then(() => {
        Controllers.delete({controller : ctrl.id}, function () {
          $scope.controllers = $scope.controllers.filter((controller) => controller.id !== ctrl.id);
        });
      });
    };

    $scope.addController = function () {
      var instance = $modal.open({
        templateUrl: '/assets/templates/pages/addController.html',
        controller: 'NewControllerController as ncc',
        scope: $scope.$new()
      });

      instance.result.then(function () {
        Controllers.query({sid : $scope.rdp.sid}, (controllers) => $scope.controllers = controllers);
      });
    };
  }

  function NewControllerController($scope, $modalInstance, UFAP, Controllers) {
    this.search = function (name) {
      return UFAP.search({name : name}).$promise.then((data) => data.profiles);
    };

    this.updateController = function (ctrl, profile) {
      ctrl.address = ctrl.address || profile.address;
      ctrl.name = ctrl.name || `${profile.pp_type} ${profile.pp_name}`;
    };

    this.save = function (ctrl) {
      this.loading = true;
      this.message = void 0;
      Controllers.save({rdp : $scope.rdp.slug}, {
        type: ctrl.type,
        name: ctrl.name,
        address: ctrl.address,
        gis_id: ctrl.ufap ? ctrl.ufap.id : void 0,
        tag: ctrl.tag
      })
      .$promise
      .then(() => this.success = true)
      .then(() => this.message = {type: 'success', text: 'Пункт питания добавлен'})
      .catch(() => this.message = {type: 'error', text: 'Произошла ошибка'})
      .finally(() => this.loading = false);
    };
  }

  angular.module('asuno').controller('RdpAdmController', RdpAdmController);
  angular.module('asuno').controller('NewControllerController', NewControllerController);
})();
