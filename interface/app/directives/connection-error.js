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
    .controller('ConnectionErrorController', function ConnectionErrorController($scope, ConnectionError) {
        var ce = this;
        $scope.$watch(ConnectionError.getErrorNumber, function(newValue) {
            if (newValue) {
                ce.error = ConnectionError.MESSAGE_ERROR;
            } else {
                delete ce.error;
            }
        });
    });
})();
