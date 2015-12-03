/**
 * Created by vasa on 15.08.14.
 */

(function () {
  'use strict';
  const address = 'http://moslight.mos.ru'; // 'http://moslight.mos.ru' + '81.88.217.69'
  angular.module('asuno').constant('GIS_LAYERS', {
    rdps        : {
      //http://moslight.mos.ru
      url            :  address + '/arcgis/rest/services/Mossvet/FeatureServer/9/',
      dataAttributes : ['db_NAME', 'db_ADDRESS', 'DISPATCHER_ID'],
      name           : 'Диспетчерские пункты',
      icon           : '/assets/img/dispatchCenter.png'
    },
    lep        : {
      url            : address + '/arcgis/rest/services/Mossvet/FeatureServer/6',
      name           : 'ЛЭП',
      dataAttributes : ['Object_ID', 'CABEL_ID'],
      icon           : '/assets/img/dispatchCenter.png',
      titleTemplate    : '<span>Выберите ЛЭП</span>',
      invisible      : true,
      tooMuchData : true,
      popupTemplateUrl : '/assets/templates/gis/lep.html'
    },
    controllers : {
      url            : address + '/arcgis/rest/services/Mossvet/FeatureServer/2',
      dataAttributes : ['PP_ID', 'db_PP_NAME', 'db_STREET', 'db_DISPATCHER_ID', 'db_PP_TYPE'],
      name           : 'Пункты питания (точки)',
      icon           : '/assets/img/electricalSubstationPoint.png',
      filter         : '/assets/templates/modals/controller-filter-modal.html',
      controller     : ['$scope', '$modal', 'UFAP', function ($scope, $modal, UFAP) {
        $scope.setFilter = function (filter) {
          $scope.l.layer.filter = filter;
        };

        $scope.showFilter = function () {
          var instance = $modal.open({
            templateUrl : '/assets/templates/modals/controller-filter-modal.html',
            scope       : $scope.$new(),
            resolve     : {
              'types' : () => UFAP.types().$promise
            },
            controller  : function ($scope, types, $modalInstance) {
              $scope.types = types.power_point_types;

              if ($scope.l.layer.filter) {
                $scope.selectedType = _.find($scope.types, function (type) {
                  return type.name === $scope.l.layer.filter.db_PP_TYPE;
                });
                $scope.hideUnknown = !!$scope.l.layer.filter.has_point;
              }

              $scope.submitFilters = function (selectedType, hideUnknown) {
                var data;
                if (selectedType) {
                  data = {};
                  data.db_PP_TYPE = selectedType.name;
                }
                if (hideUnknown) {
                  data = data || {};
                  data.has_point = hideUnknown;
                }
                $modalInstance.close(data);
              };
            }
          });

          instance.result.then($scope.setFilter);
        };
      }]
    },
    districts   : {
      url              : address + '/arcgis/rest/services/RDP_region/MapServer/0',
      dataAttributes   : ['ID', 'DISPETCHER', 'ETR', 'FIRM'],
      name             : 'Эксплуатационнные районы',
      icon             : '/assets/img/districts.png',
      titleTemplate    : '<span>Эксплуатационнные районы</span>',
      popupTemplateUrl : '/assets/templates/gis/district.html',
      invisible        : true
    },
    cameras     : {
      url              : address + '/arcgis/rest/services/Mossvet/MapServer/10',
      dataAttributes   : ['address', 'purl', 'iurl', 'name', 'Id'],
      name             : 'Камеры видеонаблюдения',
      icon             : '/assets/img/cameras.png',
      titleTemplate    : '<span>Камеры видеонаблюдения</span>',
      popupTemplateUrl : '/assets/templates/gis/camera.html',
      invisible        : true,
      tooMuchData      : true
    },
    atd         : {
      idGroup     : true,
      name        : 'АТД',
      url         : address + '/arcgis/rest/services/ATD/MapServer',
      invisible   : true,
      layers      : [
        {
          id   : 'atd1',
          num  : 1,
          name : 'Районы'
        },
        {
          id   : 'atd2',
          num  : 2,
          name : 'Административные округа'
        },
        {
          id   : 'atd3',
          num  : 3,
          name : 'Границы Москвы'
        },
        {
          id   : 'atd5',
          num  : 5,
          name : 'Административные округа'
        },
        {
          id   : 'atd6',
          num  : 6,
          name : 'Границы Москвы'
        },
        {
          id   : 'atd8',
          num  : 8,
          name : 'Административные округа'
        },
        {
          id   : 'atd9',
          num  : 9,
          name : 'Границы Москвы'
        }
      ],
      tooMuchData : true
    }
  });

})();
