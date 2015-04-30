(function() {
  'use strict';

  function confirmation() {

    this.template = `
      <div class="modal-header">
        <h4>{{header || question}}</h4>
      </div>
      <div class="modal-body" ng-show="header">
        {{question}}
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" ng-click="$dismiss()">Отмена</button>
        <button class="btn btn-primary" ng-click="$close()">ОК</button>
      </div>
    `;

    this.$get = ($rootScope, $modal) => {
      return (question, header) => {
        const $child = $rootScope.$new();
        $child.header = header;
        $child.question = question;

        return $modal.open({
          template: this.template,
          scope: $child
        }).result;
      };
    };
  }

  function inform() {

    this.template = `
      <div class="modal-header">
        <h4>{{header || message}}</h4>
      </div>
      <div class="modal-body" ng-show="header">
        {{message}}
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" ng-click="$close()">ОК</button>
      </div>
    `;

    this.$get = ($rootScope, $modal) => {
      return (message, header) => {
        const $child = $rootScope.$new();
        $child.header = header;
        $child.message = message;

        return $modal.open({
          template: this.template,
          scope: $child
        }).result;
      };
    };
  }

  angular.module('asuno.confirmation', ['ui.bootstrap.modal'])
    .provider('confirmation', confirmation)
    .provider('inform', inform);
})();
