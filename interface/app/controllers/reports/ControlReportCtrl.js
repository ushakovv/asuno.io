(function () {
  'use strict';

  function ControlReportController($scope, Logs) {

    $scope.query = Logs.control_actions;

    $scope.map = function (actions) {
      return actions.log;
    };

    $scope.controlReportOptions = {
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
        {field : 'username', displayName : 'Имя пользователя'},
        {field : 'cmd_description', displayName : 'Действие', width : '**'},
        {field : 'rdp', displayName : 'РДП'},
        {
          field        : 'obj',
          displayName  : 'Объект',
          cellTemplate : '<div class="ngCellText">{{row.entity.obj}} ({{ row.entity.obj_address }})</div>',
          width        : '**'
        },
        {field : 'status', displayName : 'Статус', width : '**'}
      ]
    };
  }

  angular.module('asuno').controller('ControlReportController', ControlReportController);
})();
