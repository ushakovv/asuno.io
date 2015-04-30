/**
 * Created by vasa on 23.07.14.
 */

(function () {
  'use strict';

  function ReportCtrl($scope, Events, ReportFormatter, ngGridBase) {

    Events.query({}, function (events) {
      $scope.switches = _(events.events)
        .map(ReportFormatter.format_alarm)
        .value();
    });

    Events.query({alarms : 1}, function (events) {
      $scope.alarmsAll = _(events.events)
        .map(ReportFormatter.format_alarm)
        .value();
    });

    $scope.empty = [];

    $scope.filters = {};

    $scope.filterToday = function () {
      if (!$scope.filters.filterToday) {
        $scope.filters.filterToday = true;
        var today = moment().startOf('day').toDate();
        var tomorrow = moment().add(1, 'd').startOf('day').toDate();

        angular.extend($scope.filters, {
          dateFrom : today,
          dateTo   : tomorrow
        });
      } else {
        delete $scope.filters.filterToday;

        angular.extend($scope.filters, {
          dateFrom : null,
          dateTo   : null
        });
      }
    };

    $scope.lightOptions = angular.extend({}, ngGridBase, {
        data       : 'empty',
        columnDefs : [
          {field : '', displayName : 'Дата'},
          {field : '', displayName : 'Время'},
          {field : '', displayName : 'Объект'},
          {field : '', displayName : 'Время горения'}
        ]
      }
    );
  }

  angular.module('asuno').controller('ReportCtrl', ReportCtrl);
})();
