(function () {
  'use strict';

  function MassOperations($rootScope, $q, $modal, RemoteCommandActions) {

    this.createOperation = function (name, operations, allowToRdp) {

      var promise = $q.defer();

      return {
        name       : name,
        allowToRdp : allowToRdp,
        finished   : promise.promise,
        operations : operations,
        finish     : () => promise.resolve()
      };
    };

    this.installListener = function () {
      $rootScope.$on('asuno-progress-start', function (event, operation) {
        $modal.open({
          templateUrl : '/assets/templates/modals/progress-modal.html',
          scope       : $rootScope.$new(),
          keyboard    : false,
          backdrop    : 'static',
          controller  : function ($scope, $q, $modalInstance) {
            $scope.operation = operation.name;
            $scope.allowToRdp = operation.allowToRdp;

            $scope.all = operation.operations.length;
            $scope.oks = 0;
            $scope.fails = 0;

            $scope.progressItems = operation.operations.map(function (op) {
              return {
                name    : op.name,
                promise : op.promise,
                toRdp   : op.toRdp,
                started : false
              };
            });

            $scope.confirm = function () {
              $scope.confirmed = true;

              $scope.progressItems.forEach(function (op) {
                op.started = true;
                op.promise = op.promise();

                op.promise.then(function (result) {
                  op.ok = true;
                  $scope.oks = $scope.oks + 1;
                  return {ok : true, result : result};
                }, function (reason) {
                  op.ok = false;
                  $scope.fails = $scope.fails + 1;
                  return {ok : false, result : reason};
                });
              });

              $q.all(_.pluck($scope.progressItems, 'promise')).finally(function () {
                $scope.finished = true;
                operation.finish();
              });
            };
            $scope.chancel = function () {
              operation.finish();
              $modalInstance.close('chancel');
            };
            $scope.sendToRdp = function () {
              $scope.confirmed = true;

              $scope.progressItems.forEach(function (op) {
                RemoteCommandActions.createCommand(op.toRdp);
                $scope.oks = $scope.oks + 1;
                op.started = true;
                op.ok = true;
              });

              $scope.finished = true;
              operation.finish();
            };

            $scope.okProgress = function () {
              return $scope.oks * 100 / $scope.all + '%';
            };

            $scope.failProgress = function () {
              return $scope.fails * 100 / $scope.all + '%';
            };
          }
        });
      });
    };
  }

  angular.module('asuno.services').service('MassOperations', MassOperations);
})();
