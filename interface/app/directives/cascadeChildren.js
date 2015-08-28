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
          loading: '=loading',
          parentId: '=controllerId'
        },
        bindToController: true,
        controller: 'CascadeChildrensController as cascadeChildCtrl'
      };
    })
    .controller('CascadeChildrensController', function CascadeChildrensController($rootScope, $scope, $log, $timeout, Controllers) {

      $scope.deleteChild = function deleteChild(index, childId) {
        $scope.loading = true;
        var children = $scope.cascadeChildCtrl.children;
        Controllers.remove_parent({id: childId}, {id: childId}).$promise
          .finally(() => {
            $scope.loading = false;
          })
          .then(() => {
            let part1 = children.slice(0, index);
            let part2 = children.slice(index + 1);
            $scope.cascadeChildCtrl.children = part1.concat(part2);
          }, (data) => {
            $log.debug('Controllers remove_parent error', data);
          });
      };

      $scope.addChild = function addChild() {

        var child = $scope.cascadeChildCtrl.controllerSelected,
            children = $scope.cascadeChildCtrl.children;

        $scope.cascadeChildCtrl.controllerSelected = null;

        if ( !_.findWhere(children, { 'id': child.id }) &&
            child.id !== $scope.cascadeChildCtrl.parentId) {
          Controllers.add_child({
            parent_id: $scope.cascadeChildCtrl.parentId,
            child_id: child.id
           }, {
            parent_id: $scope.cascadeChildCtrl.parentId,
            child_id: child.id
           })
            .$promise
            .then((result) => {
              $log.debug('ok', result);
              children = $scope.cascadeChildCtrl.children.slice();
              children.push(child);
              $scope.cascadeChildCtrl.children = children;
            }, (data) => {
              $log.debug('error', data);
            });
        }

      };

      $scope.searchController = function searchController(val) {
        return Controllers.controllers_search({query: val})
          .$promise
          .then(function(response){
            return response.controllers.map(function(item){
              item.formated = item.name + ', ' + item.address;
              return item;
            });
        });
      };
    });
})();
