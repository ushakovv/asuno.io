(function () {
  'use strict';

  function StatesAdmController($scope, States) {
    $scope.states = States.query();

    $scope.savePriority = _.debounce(function (state) {
      States.save({id : state.id}, {priority : state.priority || 10});
    }, 50);
  }

  angular.module('asuno').controller('StatesAdmController', StatesAdmController);
})();
