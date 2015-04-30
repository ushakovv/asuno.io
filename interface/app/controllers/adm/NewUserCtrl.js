(function () {
  'use strict';

  function NewUserCtrl($scope, Users, $modalInstance, roles, rdps) {
    var newUserAdm = this;

    $scope.roles = roles;
    $scope.rdps = rdps;

    newUserAdm.createUser = function (user) {
      var role = user.role,
        rdp = user.rdp,
        password = user.password;
      delete user.role;
      delete user.rdp;
      delete user.password;

      var createdUser;

      Users.save({}, user).$promise
        .then(function (_createdUser) {
          createdUser = _createdUser;
          return Users.set_password({id : createdUser.id}, {password : password}).$promise;
        })
        .then(function () {
          if (role.slug === 'dispatcher') {
            return Users.set_role({id : createdUser.id}, {role: role.slug, rdp_id : rdp.id}).$promise;
          } else {
            return Users.set_role({id : createdUser.id}, {role : role.slug}).$promise;
          }
        })
        .then(function () {
          return Users.unblock({id : createdUser.id}).$promise;
        })
        .then(function () {
          $modalInstance.close();
        })
        .catch(function () {
          if (createdUser) {
            Users.delete({id : createdUser.id});
          }
          $scope.error = 'Произошла ошибка. Повторите запрос позднее.';
        });
    };
  }

  angular.module('asuno').controller('NewUserCtrl', NewUserCtrl);
})();
