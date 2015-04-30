(function () {
  'use strict';

  function ExternalReportController($scope, Logs) {

    $scope.query = Logs.external_api;

    $scope.map = function (actions) {
      return actions.log;
    };

    $scope.externalOptions = {
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
        {field : 'system', displayName : 'Наименование системы'},
        {field : 'action', displayName : 'Наименование функции взаимодействия', width : '**'},
        {field : 'status', displayName : 'Статус', width : '**'}
      ]
    };
  }

  angular.module('asuno').controller('ExternalReportController', ExternalReportController);
})();
