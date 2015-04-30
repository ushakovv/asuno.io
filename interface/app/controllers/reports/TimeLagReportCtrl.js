/**
 * Created by vasa on 03.10.14.
 */

(function () {
  'use strict';

  function TimeLagReportCtrl($scope, Controllers) {

    $scope.query = Controllers.query;

    $scope.map = function (controllers) {
      return _.sortBy(controllers, function (ctrl) {
        return -new Date(ctrl.last_response).getTime();
      });
    };

    $scope.timeLagReport = {
      columnDefs : [
        {
          field        : 'name', displayName : 'Пункт питания',
          cellTemplate : '<div class="ngCellText"><a ui-sref="core.controller({rdp: rdp.slug, controller: row.entity.id})">{{ row.getProperty(col.field) }}</a></div>'
        },
        {
          field        : 'last_response', displayName : 'Опоздание',
          cellTemplate : `<div class="ngCellText"><span time-lag="row.entity.sensorValue('BADTIMER')" timestamp="row.getProperty(col.field)" once="true"></span></div>`
        }
      ]
    };
  }

  angular.module('asuno').controller('TimeLagReportCtrl', TimeLagReportCtrl);
})();
