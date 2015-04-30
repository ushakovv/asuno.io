(function () {
  'use strict';

  function UserActionsReport($scope, Logs) {

    $scope.query = Logs.user_actions;

    $scope.map = function (actions) {
      return actions.log;
    };

    $scope.userOptions = {
      columnDefs : [
        {
          field        : 'timestamp',
          displayName  : 'Дата',
          cellTemplate : '<div class="ngCellText">{{row.getProperty(col.field)|serverDate|date:"dd.MM.yyyy"}}</div>'
        },
        {
          field        : 'timestamp',
          displayName  : 'Время',
          cellTemplate : '<div class="ngCellText">{{row.getProperty(col.field)|serverDate|date:"HH:mm:ss"}}</div>'
        },
        {field : 'address', displayName : 'Имя компьютера'},
        {field : 'action', displayName : 'Действие', width : '***'},
        {field : 'username', displayName : 'Пользователь'}
      ]
    };
  }

  angular.module('asuno').controller('UserActionsReport', UserActionsReport);
})();
