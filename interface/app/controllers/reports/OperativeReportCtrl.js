/**
 * Created by vasa on 17.09.14.
 */

(function () {
  'use strict';

  function OperativeReportCtrl($scope, ReportFormatter, Events) {

    $scope.query = function (query, cb) {
      return Events.query(query, cb);
    };

    $scope.map = function (events) {
      return events.events.map(ReportFormatter.format_alarm);
    };

    $scope.operativeOptions = {
      rowTemplate : '<div ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}"\n     ng-style="{ \'cursor\': row.cursor, \'background-color\': row.entity.backgroundColor, \'font-weight\': row.entity.fontWeight }">\n  <div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div>\n  <div ng-cell></div>\n</div>\n',
      columnDefs  : [
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
        {field : 'description', displayName : 'Описание', width : '***'},
        {field : 'level', displayName : 'Важность'},
        {field : 'identity', displayName : 'Идентификатор'}
      ]
    };
  }

  angular.module('asuno').controller('OperativeReportCtrl', OperativeReportCtrl);
})();
