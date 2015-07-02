/**
 * Created by vasa on 10.06.14.
 */

(function () {
  'use strict';

  angular.module('asuno')
    .directive('lastResponse', function lastResponse() {
      return {
        replace: true,
        templateUrl: '/assets/templates/last-response.html',
        require: '^controllerLabel',
        scope: {
          controller: "=lastResponse"
        },
        bindToController: true,
        controller: 'LastResponseController as lr'
      };
    })
    .controller('LastResponseController', function LastResponseController($scope, Controllers) {
      this.poll = () => {
        Controllers.poll({controller: this.controller.id}, {})
          .$promise
          .then(() => Controllers.sensors_poll({controller: this.controller.id}, {}));
      };

      this.timeSync = () => {
        Controllers.change({controller: this.controller.id}, {command: 'time:sync'});
      };
    });
})();
