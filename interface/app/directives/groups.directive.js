/**
 * Created by vasa on 16.09.14.
 */

(function () {
  'use strict';

  angular.module('asuno')
    .directive('groups', function groups() {
      return {
        replace          : true,
        templateUrl      : '/assets/templates/groups.html',
        scope            : true,
        bindToController : true,
        controller       : 'GroupsController as gr'
      };
    })
    .controller('GroupsController', function GroupsController($scope, $state, ControllersStore, ControllersActions, Auth, Groups, Utils, EmitEvents) {
      var gr = this;

      gr.groups = [
        {name : 'Все пункты питания', controllers : 'all', undeletable: true},
        {name: 'Все ДЭП', controllers: 'dep', undeletable: true},
        {name: 'Все НИИТМ', controllers: 'niitm', undeletable: true}
      ];

      Groups.query({rdp : $state.params.rdp}, function (data) {
        gr.groups = gr.groups.concat(data.groups);
      });

      function _showNewGroupInput(selectedControllers) {
        var allControllers = ControllersStore.getAllControllers().map((ctrl) => ctrl.id);

        return selectedControllers.length && !Utils.same(allControllers, selectedControllers) && !_.any(gr.groups, function (group) {
            return group.undeletable && Utils.same(group.controllers, selectedControllers);
          });
      }

      gr.configNewGroup = function () {
        gr.selectedControllers = ControllersStore.getSelectedControllerIds();

        gr.showNewGroupInput = _showNewGroupInput(gr.selectedControllers);
      };

      gr.addGroup = function (group) {
        gr.error = '';
        var newGroup = {name : group.name};
        Groups.save({rdp : $state.params.rdp}, newGroup, function (response) {
          group.name = null;
          newGroup.id = response.id;
          newGroup.controllers = gr.selectedControllers;
          newGroup.selected = true;
          gr.groups.push(newGroup);
          gr.selectGroup(true, newGroup);
          gr.showNewGroupInput = false;

          gr.selectedControllers.forEach(function (controller_id) {
            Groups.add_controller({rdp : $state.params.rdp, id : newGroup.id}, {controller_id : controller_id});
          });
        }, function () {
          gr.error = 'Не удалось сохранить группу';
        });
      };

      gr.selectGroup = function (selected, group) {
        var controllerIds = null;

        gr.groups.forEach(function (grp) {
          if (grp.name !== group.name) {
            grp.selected = false;
          }
        });

        switch (group.controllers) {
          case 'all':
            controllerIds = ControllersStore.getAllControllers().map((ctrl) => ctrl.id);
            ControllersActions.toggleControllersSelection(selected, controllerIds);
            break;
          case 'dep':
            controllerIds = ControllersStore.getAllControllers().filter((ctrl) => ctrl.type === 'dep').map((ctrl) => ctrl.id);
            ControllersActions.toggleControllersSelection(selected, controllerIds);
            break;
          case 'niitm':
            controllerIds = ControllersStore.getAllControllers().filter((ctrl) => ctrl.type === 'niitm').map((ctrl) => ctrl.id);
            ControllersActions.toggleControllersSelection(selected, controllerIds);
            break;
          default:
            ControllersActions.toggleControllersSelection(selected, group.controllers);
            break;
        }
      };

      gr.deleteGroup = function (group) {
        if (!group.undeletable) {
          var index = gr.groups.indexOf(group);
          gr.groups.splice(index, 1);

          Groups.delete({rdp : $state.params.rdp, id : group.id});
        }
      };

      if (Auth.hasControl()) {
        ControllersStore.addListener(EmitEvents.CONTROLLER_SELECTION, gr.configNewGroup);

        $scope.$on('$destroy', function () {
          ControllersStore.removeListener(EmitEvents.CONTROLLER_SELECTION, gr.configNewGroup);
        });
      }
    });
})();
