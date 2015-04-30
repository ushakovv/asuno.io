(function () {
  'use strict';

  /* global confirm */

  function UsersCtrl($scope, $modal, Users, RDPs, confirmation, users) {

    var usersAdm = this;

    $scope.users = users;

    usersAdm.addUser = function () {
      var instance = $modal.open({
        templateUrl : '/assets/templates/modals/add-user.html',
        controller  : 'NewUserCtrl as newUserAdm',
        resolve     : {
          roles : () => Users.roles().$promise,
          rdps  : () => RDPs.query().$promise
        }
      });

      instance.result.then(function () {
        Users.query(function (users) {
          $scope.users = users;
        });
      });
    };

    usersAdm.deleteUser = function (user) {
      confirmation(`Вы действительно хотите удалить пользователя ${user.name}`).then(() => {
        Users.delete({id : user.id}, function () {
          Users.query(function (users) {
            $scope.users = users;
          });
        }, function () {
          $scope.error = 'Произошла ошибка. Повторите запрос позднее.';
        });
      });
    };

    usersAdm.toggleBlock = function (user) {
      var promise;

      if (user.is_blocked) {
        promise = Users.unblock({id : user.id}).$promise;
      } else {
        promise = Users.block({id : user.id}, {}).$promise;
      }

      promise.then(function () {
        Users.query(function (users) {
          $scope.users = users;
        });
      }, function () {
        $scope.error = 'Произошла ошибка. Повторите запрос позднее.';
      });
    };
  }

  angular.module('asuno').controller('UsersCtrl', UsersCtrl);
})();
