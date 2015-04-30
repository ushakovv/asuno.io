(function () {
  'use strict';

  function LightSensorsController(ngGridBase) {
    this.crumbs = [{
      name: 'Датчики освещенности'
    }];

    this.gridOptions = angular.extend({}, ngGridBase, {
      data: [],
      showFooter: true,
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
          field: 'hr_name',
          displayName: 'Датчик'
        },
        {
          field: 'value',
          displayName: 'Показание'
        }
      ]
    });
  }

  angular.module('asuno').controller('LightSensorsController', LightSensorsController);
})();
