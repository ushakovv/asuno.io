/**
 * Created by vasa on 10.08.14.
 */

(function () {
  'use strict';
  /* global confirm */

  function RdpAdmController($scope, $modal, Controllers, initial, confirmation) {
    $scope.rdp = initial.rdp;
    $scope.controllers = initial.controllers;

    $scope.sort = "address";
    $scope.reverse = true;

    $scope.changeSort = function(value){
      if ($scope.sort == value){
        $scope.reverse = !$scope.reverse;
        return;
      }

      $scope.sort = value;
      $scope.reverse = false;
    };

    $scope.toggle = function (id) {
      Controllers.toggle({id : id}, {});
    };

    $scope.remove = function (ctrl) {
      confirmation('Вы действительно хотите удалить ${ctrl.name} ?').then(function(){
        Controllers.delete({controller : ctrl.id}, function () {
          $scope.controllers = $scope.controllers.filter(function(controller){
            return controller.id !== ctrl.id;
          });
        });
      });
    };

    $scope.addController = function () {
      var instance = $modal.open({
        templateUrl: '/assets/templates/pages/addController.html',
        controller: 'NewControllerController as ncc',
        scope: $scope.$new()
      });

      function _add() {
        Controllers.query({sid : $scope.rdp.sid}, (controllers) => $scope.controllers = controllers);
      }

      instance.result.then(_add, _add);
    };
  }

  function NewControllerController($scope, $modalInstance, UFAP, Controllers) {
    this.search = function (name) {
      return UFAP.search({name : name}).$promise.then(function(data){
        return data.profiles;
      });
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
        .$promise.then(function() {
          this.success = true;
          this.message = {type: 'success', text: 'Пункт питания добавлен'};
        })
        .catch(function(){
          this.message = {type: 'error', text: 'Произошла ошибка'};
        })
        .finally(function(){
          this.loading = false
        });
    };

  }

  angular.module('asuno').controller('RdpAdmController', RdpAdmController);
  angular.module('asuno').controller('NewControllerController', NewControllerController);
})();
