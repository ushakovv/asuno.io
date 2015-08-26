/**
 * Created by rus on 25.08.15.
 */
(function() {
  'use strict';

  angular.module('asuno')
    .directive('cascadeChildren', function cascadeChildren() {
      return {
        replace: true,
        templateUrl: '/assets/templates/cascade-children.html',
        scope: {
          children: '=children',
          showControls: '=showControls',
          loading: '=loading'
        },
        bindToController: true,
        controller: 'CascadeChildrensController as cascadeChildCtrl'
      };
    })
    .controller('CascadeChildrensController', function CascadeChildrensController($rootScope, $scope, $log, $timeout, Controllers) {

      $scope.addChild = function addChild() {
        $log.debug('add child. show modal');
        $scope.loading = true;
        $timeout(() => {
          $log.debug('add child');
          $scope.loading = false;
        }, 2000);
/*        $modal.open({
          templateUrl : '/assets/templates/modals/add-child-modal.html',
          controller  : 'AddChildModalController as acmCtrl'
        });*/
      };

      $scope.deleteChild = function deleteChild(id) {
        $scope.loading = true;

        Controllers.remove_parent({id: id}).$promise
          .finally(() => {
            $scope.loading = false;
          })
          .then((data) => {
            $log.debug('Controllers remove_parent ok', data);
          }, (data) => {
            $log.debug('Controllers remove_parent error', data);
          });
      };
    })
    .controller('AddChildModalController', function AddChildModalController($scope, $log) {
      $scope.loading = false;
      $scope.notFound = false;
      $scope.childControllerQuery = '';
      $log.debug('AddChildModalController', $scope);
    });
})();
