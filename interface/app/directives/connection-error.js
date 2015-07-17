(function () {
'use strict';

angular.module('asuno')
    .directive('connectionError', function connectionError() {
        return {
            templateUrl : '/assets/templates/connection-error.html',
            replace    : true,
            scope      : false,
            restrict: 'E',
            controller: 'ConnectionErrorController as ce'
        };
    })
    .controller('ConnectionErrorController', function ConnectionErrorController($scope, ConnectionError, $log) {
        var ce = this;
        $scope.$watch(ConnectionError.isError, (newValue) => {
            if (newValue) {
                ce.error = ConnectionError.MESSAGE_ERROR;
            } else {
                delete ce.error;
            }
        });
        $scope.$watch(ConnectionError.getErrorData, (newValue) => {
            $log.debug('$watch ConnectionError getErrorData updated. newValue: ', newValue);
        });
    });
})();
