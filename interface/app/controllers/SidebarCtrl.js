/**
 * Created by vasa on 16.09.14.
 */

(function () {
  'use strict';

  function SidebarCtrl($scope, Controllers) {

    $scope.results = {};

    var sortControllers = function (controllers) {
      $scope.noControllersFound = controllers.length === 0 && $scope.term;

      $scope.rdps.forEach(function (rdp) {
        $scope.results[rdp.slug] = controllers.filter((ctrl) => ctrl.ancestors.rdp.id === rdp.id);
      });
    };

    $scope.search = _.debounce(function (term) {
      if (term && term.length >= 2) {
        Controllers.query({name : term}, function (controllers) {
          // В случае рассинхрона делаем обновление только по текущему поисковому запросу
          if (term === $scope.term) {
            sortControllers(controllers);
          }
        });
      } else if (!term) {
        $scope.results = {};
        $scope.noControllersFound = false;
        $scope.$digest();
      }
    }, 100);
  }

  angular.module('asuno').controller('SidebarCtrl', SidebarCtrl);
})();
