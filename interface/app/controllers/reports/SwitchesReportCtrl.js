/**
 * Created by vasa on 17.09.14.
 */

(function () {
  'use strict';

  function SwitchesReportCtrl($scope, ReportFormatter, Events) {

    $scope.query = Events.query;

    $scope.map = function (events) {
      return events.events.map(ReportFormatter.format_alarm);
    };

    $scope.switchOptions = {
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
        {
          field        : 'object', displayName : 'Объект',
          cellTemplate : '<div class="ngCellText"><a ui-sref="core.controller({rdp: row.entity.rdp.slug, controller: row.entity.object_id})">{{row.getProperty(col.field)}}</a></div>'
        },
        {field : 'description', displayName : 'Описание', width : '***'}
      ]
    };
  }

  angular.module('asuno').controller('SwitchesReportCtrl', SwitchesReportCtrl);
})();
