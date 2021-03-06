/**
 * Created by vasa on 08.09.14.
 */

(function () {
  'use strict';

  var parseDirectionValue = function (directions, direction, index) {
    return directions[index] ? directions[index][direction.field] : null;
  };

  var _editTemplate = '<div ng-class="{\'has-error\': [\'p_u\',\'i_p\',\'i_ut\'].indexOf(row.entity.field)>=0 && !COL_FIELD}">\n  <input ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" type="number" required name="fieldInput"\n         ng-if="[\'p_u\',\'i_p\',\'i_ut\'].indexOf(row.entity.field)>=0"/>\n  <input ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" type="text" name="fieldInput"\n         ng-if="[\'p_u\',\'i_p\',\'i_ut\'].indexOf(row.entity.field)===-1"/>\n</div>';
  var _cellTemplate = '<div class="ngCellText" ng-class="col.colIndex()" bs-tooltip data-container="body"\n <span ng-switch="row.getProperty(\'field\')">\n  ' +
      '<span ng-switch-when="cable_id" ng-controller="DirectionLepCtrl as dirLep">\n   <a href="javascript:void(0)" ng-disabled="dirLep.isLinking" ng-click="dirLep.toggleDirectionLink(row.getProperty(col.field), row.getProperty(col.field+\'number\'))" >\n    <span ng-if="!row.getProperty(col.field)">Привязать</span>\n' +
      '<span ng-if="row.getProperty(col.field)">Отвязать</span>\n   </a></span>\n  <span ng-switch-default>{{row.getProperty(col.field)}} </span>\n   </span>\n  </div>';

  function ControllerDirectionsCtrl($scope, $rootScope, ngGridBase, Auth, Controllers) {

    var ctrl = this;

    $scope.directionsMap = [
      {title : 'Py, кВт', field : 'p_u'},
      {title : 'Ip, A', field : 'i_p'},
      {title : 'Iyt, mA', field : 'i_ut'},
      {title : 'Напр. линии', field : 'direction'},
      {title : 'Осв. приборы', field : 'lightning'}
    ];
    if ($scope.isAdmin) {
      $scope.directionsMap.push({title : 'Привязка к лэп', field: 'cable_id'});
    }

    $scope.$watch('controller', function (next) {
      if (angular.isArray(next.directions)) {
        var dirs = next.directions.map(function(dir) {
          dir.cable_id = dir.cable_id || null;
          return dir;
        });
        $scope.directions = $scope.directionsMap
          .map(function (dir) {
            return {
              title : dir.title,
              field : dir.field
            };
          })
          .map(function (dirStub) {
            dirs.forEach(function (dir, idx) {
              dirStub['value' + dir.number] = parseDirectionValue(dirs, dirStub, idx);
              dirStub['value' + dir.number + 'number'] = dir.id;
            });
            return dirStub;
          });

        var _columnDefs = [{field : 'title', displayName : ''}];

        dirs.forEach(function (dir) {
          _columnDefs.push({
            field                 : 'value' + dir.number,
            displayName           : '' + dir.number,
            enableCellEdit        : Auth.hasControl(),
            cellEditableCondition : 'row.entity[col.field] !== null && row.entity[col.field] !== undefined',
            editableCellTemplate  : _editTemplate,
            cellTemplate          : _cellTemplate
          });
        });

        ctrl.directionsGridOptions = angular.extend({}, ngGridBase, {
          data                : 'directions',
          i18n                : 'ru-RU',
          enableCellSelection : true,
          enableSorting       : false,
          showFooter          : false,
          footerRowHeight     : null,
          columnDefs          : _columnDefs
        });
      }
    }, true);

    $rootScope.$on('ngGridEventEndCellEdit', function (evt) {
      if (evt && evt.targetScope.columns[0].field === 'title') {
        var row = evt.targetScope.row.entity;
        var field = evt.targetScope.col.field;
        var directionNum = parseInt(field.replace('value', ''), 10) - 1;

        var direction = $scope.controller.directions[directionNum];

        if (direction) {
          var data = {};
          data[row.field] = evt.targetScope.row.getProperty(field);
          if (['p_u', 'i_p', 'i_ut'].indexOf(row.field) >= 0) {
            data[row.field] = data[row.field] || 0;
            evt.targetScope.row.entity[field] = evt.targetScope.row.entity[field] || 0;
          } else {
            data[row.field] = data[row.field] || '';
            evt.targetScope.row.entity[field] = evt.targetScope.row.entity[field] || '';
          }
          delete data.id;
          Controllers.direction_edit({id : direction.id}, data, function () {
            $rootScope.$broadcast('asuno-refresh-all');
          });
        }
      }
    });
  }

  angular.module('asuno').controller('ControllerDirectionsCtrl', ControllerDirectionsCtrl);
})();
