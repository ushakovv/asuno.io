(function () {
  'use strict';

  function AlertsReportController($scope, ReportFormatter, Events, ngGridBase) {
    $scope.query = function(options, callback) {
      Events.query(Object.assign({}, options, {alerts: null, aggregates: 1}), callback);
    };

    $scope.map = function (events) {
      return events.events.map(ReportFormatter.format_alarm);
    };

    $scope.alertsOptions = angular.extend({}, ngGridBase, {
      data: 'empty',
      columnDefs: [
        {
          field: 'timestamp',
          displayName: 'Дата',
          cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field)|serverDate|date:"dd.MM.yyyy"}}</div>'
        },
        {
          field: 'timestamp',
          displayName: 'Время',
          cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field)|serverDate|date:"HH:mm:ss"}}</div>'
          },
        {
          field: 'object',
          displayName: 'Объект',
          cellTemplate: '<div class="ngCellText"><a ui-sref="core.controller({rdp: row.entity.rdp.slug, controller: row.entity.object_id})">{{row.getProperty(col.field)}}</a></div>'
        },
        {
          field: 'description',
          displayName: 'Описание',
          width: '***'
        },
        {
          field: '',
          displayName: 'Категория'
        }]
    });
  }

  angular.module('asuno').controller('AlertsReportController', AlertsReportController);
})();
