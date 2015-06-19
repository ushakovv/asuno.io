/**
 * Created by rus on 16.06.15.
 */

(function () {
    'use strict';

    function MaintenanceReportCtrl($scope, Maintence) {

        $scope.query = Maintence.query;

        $scope.filters = {};

        $scope.map = function (actions) {
            return actions.maintenances;
        };

        $scope.maintenanceOptions = {
            columnDefs : [
                {
                    field : 'date_from',
                    displayName : 'Дата начала',
                    cellTemplate : '<div class="ngCellText">{{row.getProperty(col.field)|serverDate|date:"dd.MM.yyyy"}}</div>'
                },
                {
                    field : 'date_from',
                    displayName : 'Время начала',
                    cellTemplate : '<div class="ngCellText">{{row.getProperty(col.field)|serverDate|date:"HH:mm:ss"}}</div>'
                },
                {
                    field : 'date_to',
                    displayName : 'Дата окончания',
                    cellTemplate : '<div class="ngCellText">{{row.getProperty(col.field)|serverDate|date:"dd.MM.yyyy"}}</div>'
                },
                {
                    field : 'date_from',
                    displayName : 'Время окончания',
                    cellTemplate : '<div class="ngCellText">{{row.getProperty(col.field)|serverDate|date:"HH:mm:ss"}}</div>'
                },
                {
                    field : 'reason',
                    displayName : 'Причина'
                },
                {
                    field : 'user_name',
                    displayName : 'Пользователь'
                },
                {
                    field        : 'controller_name',
                    displayName : 'Контоллер'
                }
            ]
        };
    }

    angular.module('asuno').controller('MaintenanceReportCtrl', MaintenanceReportCtrl);
})();
