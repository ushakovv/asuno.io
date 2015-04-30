/**
 * Created by vasa on 04.04.14.
 */

(function () {
  'use strict';

  function NavbarCtrl($scope, $rootScope, $state, $modal, Auth, FilterSvc, ControllersActions, ControllersStore) {
    var self = this;

    $scope.logout = function () {
      Auth.logout();
      $state.go('login');
    };

    $scope.fio = function () {
      return Auth.session() ? Auth.session().user.name : '';
    };

    $rootScope.sidebar = {};

    $rootScope.show = {showMap : false, showBlocks : true};

    $rootScope.showMap = function () {
      $rootScope.show.showMap = true;
      $rootScope.show.showBlocks = false;
    };

    $rootScope.showTable = function () {
      $rootScope.show.showMap = false;
      $rootScope.show.showBlocks = false;
    };

    $rootScope.showBlocks = function () {
      $rootScope.show.showMap = false;
      $rootScope.show.showBlocks = true;
    };

    $scope.filterCount = function (key) {
      return FilterSvc.count(key);
    };

    $rootScope.setFilter = function (key) {
      ControllersActions.setControllersFilter(key);
    };

    self.setSearch = _.debounce(function (search) {
      ControllersActions.setControllersSearch(search);
    }, 100);

    $scope.$watch('showAutonomous', function (next, prev) {
      if (next !== prev) {
        ControllersActions.toggleAutonomous(next);
      }
    });

    $rootScope.$on('$stateChangeSuccess', function () {
      if ($scope.search) {
        delete $scope.search.term;
      }
    });

    $rootScope.currentFilter = function () {
      return ControllersStore.getFilterKey();
    };

    $rootScope.isCurrentFilter = function (key) {
      return key === ControllersStore.getFilterKey();
    };

    $scope.openIbp = function () {
      $modal.open({templateUrl : '/assets/templates/modals/ibp-modal.html'});
    };
  }

  angular.module('asuno').controller('NavbarCtrl', NavbarCtrl);
})();
