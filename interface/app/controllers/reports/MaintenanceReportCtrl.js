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
                    field : 'date_to',
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
                    displayName : 'Контоллер',
                    cellTemplate : '<div class="ngCellText"><a ui-sref="core.controller({rdp: row.entity.rdp_slug, controller: row.entity.controller_id})">{{row.getProperty(col.field)}}</a></div>'
                },
                {
                    field        : 'controller_name',
                    displayName : 'Статус',
                    cellTemplate : '<div class="ngCellText"><div maintenance-state maintenance-date-from="row.entity.date_from" maintenance-date-to="row.entity.date_to"></div></div>'
                }
            ]
        };
    }

    angular.module('asuno').controller('MaintenanceReportCtrl', MaintenanceReportCtrl);
})();
