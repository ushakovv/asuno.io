(function () {
  'use strict';

  function UserCtrl($scope, Users, user, roles, rdps) {
    $scope.user = user;
    $scope.roles = roles;
    $scope.rdps = rdps;
    $scope.companies = [];

    Users.get_companies(function(data) {
      $scope.companies = data.organizations;
    });

    $scope.current = {
      role: $scope.user.roles[0].slug,
      email: $scope.user.email,
      organization: $scope.user.organization,
      rdp_id: $scope.user.dispatcher ? $scope.user.dispatcher.rdp.id : void 0
    };

    $scope.closeErrors = function () {
      delete $scope.userMessage;
      delete $scope.userError;
      delete $scope.passwordMessage;
      delete $scope.passwordError;
    };

    $scope.updateUser = function (user) {
      $scope.closeErrors();
      $scope.loading = true;
      Users.update({
          id: user.id
        }, {
          name: user.name,
          email: user.email,
          organization: user.organization
        }).$promise
        .then(function () {
          return Users.set_role({
            id: user.id
          }, {
            role: $scope.current.role,
            rdp_id: $scope.current.role === 'dispatcher' ? $scope.current.rdp_id : void 0
          }).$promise;
        })
        .then(function () {
          delete $scope.loading;
          $scope.userMessage = 'Данные успешно сохранены';
        })
        .catch(function () {
          delete $scope.loading;
          $scope.userError = 'Произошла ошибка. Повторите зарос позднее';
        });
    };

    $scope.resetPassword = function (password) {
      $scope.loadingPassword = true;
      Users.set_password({
        id: $scope.user.id
      }, {
        password: password
      }, function () {
        delete $scope.loadingPassword;
        $scope.passwordMessage = 'Данные успешно сохранены';
      }, function () {
        delete $scope.loadingPassword;
        $scope.passwordError = 'Произошла ошибка. Повторите зарос позднее';
      });
    };
  }

  angular.module('asuno').controller('UserCtrl', UserCtrl);
})();
