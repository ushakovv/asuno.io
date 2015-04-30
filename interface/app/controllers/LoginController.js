/**
 * Created by vasa on 04.04.14.
 */

(function () {
  'use strict';

  function LoginController($scope, $rootScope, $state, Auth) {

    if (Auth.isLoggedIn()) {
      $state.go('choice');
    }

    $scope.login = function (user) {
      $scope.error = null;

      Auth.login(user.username, user.password)
        .then(function () {
          $rootScope.user = Auth.session();
          if (Auth.isDispatcher()) {
            $state.go('core.rdp', {rdp : Auth.session().user.dispatcher.rdp.slug});
          } else {
            $state.go('choice');
          }
        }, function (reason) {
          if (reason.status === 502) {
            $scope.error = 'Сервер АСУНО не отвечает';
          } else {
            $scope.error = 'Неправильный логин или пароль';
          }
        });
    };
  }

  angular.module('asuno').controller('LoginController', LoginController);
})();
