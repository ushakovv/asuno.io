(function () {
  'use strict';

  angular.module('asuno')
    .directive('remoteCommands', function remoteCommands() {
      return {
        template         : '<div></div>',
        replace          : true,
        scope            : {
          commands : '=remoteCommands',
          $close   : '=close'
        },
        bindToController : true,
        controller       : 'RemoteCommandDirectiveController as rcd'
      };
    })
    .controller('RemoteCommandDirectiveController', function RemoteCommandDirectiveController($rootScope, $scope, $injector, $element) {
      React.render(<REACT.RemoteCommandList rdp={$rootScope._rdpId} $close={this.$close} ngInjector={$injector} />, $element[0]);
    });
})();
