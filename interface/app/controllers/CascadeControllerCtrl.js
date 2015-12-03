/**
 * Created by vasa on 29.03.14.
 */

(function () {
  'use strict';

  function CascadeControllerCtrl($rootScope, $scope, $state, controller, Monitors) {
    var rdp = controller.ancestors.rdp;
    $scope.controller = controller;
    $scope.rdp = rdp;

    // TODO убрать нафиг когда Лёха поправит сервер
    $rootScope._rdpId = rdp.id;

    $scope.crumbs = [
      {
        name : rdp.slug.indexOf('akhp') === -1 ? 'Объекты НО' : 'Объекты АХП',
        href : rdp.slug.indexOf('akhp') === -1 ? $state.href('core.rdps') : null
      },
      {name : $scope.rdp.name, href : $state.href('core.rdp', {rdp : $scope.rdp.slug})},
      {name : $scope.controller.name}
    ];

    $scope.rows = [];

    var children_rows = [];

    var rest_rows = [];

    function setParentId(children, parentId) {
      return children.map(function (child) {
        child.parentId = parentId;
        return child;
      });
    }

    for (var i = 0; i < controller.children.length; i++) {
      var child = controller.children[i];
      child.parentId = controller.id;
      child.isConnected = Monitors.isActive(child.alarms.connection);
      children_rows.push(child);
      rest_rows = rest_rows.concat(setParentId(child.children, child.id));
    }

    $scope.rows.push(children_rows);


    while (rest_rows.length > 0) {
      $scope.rows.push(rest_rows);
      children_rows = [];
      for (var j = 0; j < rest_rows.length; j++) {
        var sub_child = rest_rows[j];
        children_rows = children_rows.concat(setParentId(sub_child.children, sub_child.id));
      }
      rest_rows = children_rows;
    }

    $scope.selectController = function (controller) {
      $state.go('core.controller', {rdp : rdp.slug, controller : controller.id});
    };
  }

  angular.module('asuno').controller('CascadeControllerCtrl', CascadeControllerCtrl);
})();
