(function () {
  'use strict';

  angular.module('asuno')
    .directive('rdpRemoteCommands', function rdpRemoteCommands() {
      return {
        replace          : true,
        template         : `<button class="btn btn-default" style="margin-left: 15px;" ng-show="rrcc.isSupervisor()" ng-click="rrcc.showModal()">
                              ЦДП->РДП
                            </button>`,
        scope            : true,
        bindToController : true,
        controller       : 'RdpRemoteCommandsController as rrcc'
      };
    })
    .controller('RdpRemoteCommandsController', function RdpRemoteCommandsController($modal, Auth) {
      var rrcc = this;

      rrcc.isSupervisor = function () {
        return Auth.isSupervisor();
      };

      rrcc.showModal = function () {
        $modal.open({
          templateUrl : '/assets/templates/modals/remote-command-modal.html'
        });
      };
    });
})();
