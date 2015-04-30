/**
 * Created by vasa on 26.03.14.
 */

(function () {
  'use strict';

  function SimpleMap($q, $http, $compile, httpTemplateCache, SPATIAL_REFERENCE, GIS_LAYERS) {
    return {
      replace     : true,
      transclude  : true,
      templateUrl : '/assets/templates/gis-map.html',
      scope       : {
        center     : '=smCenter',
        zoom       : '@smZoom',
        hideLayers : '@smHideLayers'
      },
      controller  : function ($scope, $element) {
        var deferredMap = $q.defer();
        var deferredPopup = $q.defer();
        var deferredElement = $q.defer();

        this.map = deferredMap.promise;
        this.popup = deferredPopup.promise;
        this.element = deferredElement.promise;

        this.layers = {};
        this.layersArray = [];
        this.groupLayers = {};
        this.groupLayersArray = [];

        this.addLayer = function (id, layer) {
          layer.gis_data = angular.copy(GIS_LAYERS[id]);
          layer.is_visible = layer.visible;
          this.layers[id] = layer;
          this.layersArray.push({id : id, layer : layer});
        };

        this.addGroupLayer = function (id, layer) {
          layer.gis_data = angular.copy(GIS_LAYERS[id]);
          layer.is_visible = layer.visible;
          this.groupLayers[id] = layer;
          this.groupLayersArray.push({id : id, layer : layer});
        };

        var thiz = this;

        $scope.isSubLayerVisible = function (layerId, subLayerId) {
          return thiz.groupLayers[layerId].visibleLayers.indexOf(subLayerId) >= 0;
        };

        $scope.enableSubLayer = function (layerId, subLayerId) {
          if (!$scope.isSubLayerVisible(layerId, subLayerId)) {
            var layer = thiz.groupLayers[layerId];
            var visibleLayers = angular.copy(layer.visibleLayers);
            visibleLayers.push(subLayerId);
            layer.setVisibleLayers(visibleLayers);
          }
        };

        $scope.disableSubLayer = function (layerId, subLayerId) {
          if ($scope.isSubLayerVisible(layerId, subLayerId)) {
            var layer = thiz.groupLayers[layerId];
            var visibleLayers = angular.copy(layer.visibleLayers);
            visibleLayers.splice(visibleLayers.indexOf(subLayerId), 1);
            layer.setVisibleLayers(visibleLayers);
          }
        };

        $scope.gis_layers = angular.copy(GIS_LAYERS);

        $scope.enableLayer = function (id) {
          (thiz.layers[id] || thiz.groupLayers[id]).setVisibility(true);
          (thiz.layers[id] || thiz.groupLayers[id]).is_visible = true;
        };

        $scope.disableLayer = function (id) {
          (thiz.layers[id] || thiz.groupLayers[id]).setVisibility(false);
          (thiz.layers[id] || thiz.groupLayers[id]).is_visible = false;
        };

        $scope.layers = this.layers;
        $scope.layersArray = this.layersArray;
        $scope.groupLayers = this.groupLayers;
        $scope.groupLayersArray = this.groupLayersArray;

        $scope.isLayerVisible = function (id) {
          return $scope.layers[id] ? $scope.layers[id].visible : false;
        };


        require(['esri/map', 'esri/config', 'esri/layers/WebTiledLayer', 'esri/dijit/Popup', 'dojo/dom-construct', 'esri/geometry/Point', 'esri/dijit/Scalebar', 'esri/geometry/Extent', 'esri/layers/TileInfo', 'esri/SpatialReference'],
          function (Map, config, WebTiledLayer, Popup, domConstruct, Point, Scalebar, Extent, TileInfo, SpatialReference) {

            config.defaults.io.corsEnabledServers.push('95.31.222.219');
            config.defaults.io.corsEnabledServers.push('95.31.222.219:83');
            config.defaults.io.corsEnabledServers.push('81.88.217.69');

            var popup = new Popup({}, domConstruct.create('div'));

            var map = new Map('map', {
              infoWindow : popup,
              logo       : false,
              autoResize : true
            });

            deferredMap.resolve(map);
            deferredPopup.resolve(popup);
            deferredElement.resolve($element);

            $(window).on('resize.simplemap', () => map.resize());

            var res = function () {
              map.resize();
            };

            setTimeout(res, 50);

            /*jshint -W031*/
            /*eslint no-new:0*/
            new Scalebar({
              map          : map,
              scalebarUnit : 'metric'
            });

            var baseLayer = new WebTiledLayer('http://95.31.222.219:83/proxy.ashx?http://10.127.0.45/ArcGIS/rest/services/egko_belle/MapServer/tile/${level}/${row}/${col}',
              {
                id            : '123321',
                initialExtent : new Extent({
                  xmin             : -73665.01027303198,
                  ymin             : -26700.78949163724,
                  xmax             : 79665.48737303176,
                  ymax             : 46713.427191636154,
                  spatialReference : {
                    wkt : 'PROJCS["Moscow_bessel",GEOGCS["GCS_Bessel_1841",DATUM["D_Bessel_1841",SPHEROID["Bessel_1841",6377397.155,299.1528128]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",37.5],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",55.66666666666666],UNIT["Meter",1.0]]'
                  }
                }),
                fullExtent    : new Extent({
                  xmin             : -45000.0,
                  ymin             : -59245.43747,
                  xmax             : 30127.253412,
                  ymax             : 40051.17504,
                  spatialReference : {
                    wkt : 'PROJCS["Moscow_bessel",GEOGCS["GCS_Bessel_1841",DATUM["D_Bessel_1841",SPHEROID["Bessel_1841",6377397.155,299.1528128]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",37.5],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",55.66666666666666],UNIT["Meter",1.0]]'
                  }
                }),
                tileInfo      : new TileInfo({
                  cols             : 256,
                  rows             : 256,
                  format           : 'PNG',
                  dpi              : 96,
                  origin           : {
                    x : -20037508.342787,
                    y : 20037508.342787
                  },
                  spatialReference : new SpatialReference({
                    wkt : 'PROJCS["Moscow_bessel",GEOGCS["GCS_Bessel_1841",DATUM["D_Bessel_1841",SPHEROID["Bessel_1841",6377397.155,299.1528128]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",37.5],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",55.66666666666666],UNIT["Meter",1.0]]'
                  }),
                  lods             : [
                    {
                      level      : 0,
                      resolution : 156543.03392800014,
                      scale      : 591657527.591555
                    },
                    {
                      level      : 1,
                      resolution : 78271.516963999937,
                      scale      : 295828763.795777
                    },
                    {
                      level      : 2,
                      resolution : 39135.758482000092,
                      scale      : 147914381.897889
                    },
                    {
                      level      : 3,
                      resolution : 19567.879240999919,
                      scale      : 73957190.948944
                    },
                    {
                      level      : 4,
                      resolution : 9783.93962049996,
                      scale      : 36978595.474472
                    },
                    {
                      level      : 5,
                      resolution : 4891.96981024998,
                      scale      : 18489297.737236
                    },
                    {
                      level      : 6,
                      resolution : 2445.98490512499,
                      scale      : 9244648.868618
                    },
                    {
                      level      : 7,
                      resolution : 1222.9924525624949,
                      scale      : 4622324.434309
                    },
                    {
                      level      : 8,
                      resolution : 611.49622628137968,
                      scale      : 2311162.217155
                    },
                    {
                      level      : 9,
                      resolution : 305.74811314055756,
                      scale      : 1155581.108577
                    },
                    {
                      level      : 10,
                      resolution : 152.87405657041106,
                      scale      : 577790.554289
                    },
                    {
                      level      : 11,
                      resolution : 76.437028285073239,
                      scale      : 288895.277144
                    },
                    {
                      level      : 12,
                      resolution : 38.21851414253662,
                      scale      : 144447.638572
                    },
                    {
                      level      : 13,
                      resolution : 19.10925707126831,
                      scale      : 72223.819286
                    },
                    {
                      level      : 14,
                      resolution : 9.5546285356341549,
                      scale      : 36111.909643
                    },
                    {
                      level      : 15,
                      resolution : 4.77731426794937,
                      scale      : 18055.954822
                    },
                    {
                      level      : 16,
                      resolution : 2.3886571339746849,
                      scale      : 9027.977411
                    },
                    {
                      level      : 17,
                      resolution : 1.1943285668550503,
                      scale      : 4513.988705
                    },
                    {
                      level      : 18,
                      resolution : 0.59716428355981721,
                      scale      : 2256.994353
                    },
                    {
                      level      : 19,
                      resolution : 0.29858214164761665,
                      scale      : 1128.497176
                    }
                  ]
                })
              });

            if ($scope.zoom && $scope.center && $scope.center.x && $scope.center.y) {
              map.centerAndZoom(new Point($scope.center.x, $scope.center.y, SPATIAL_REFERENCE), parseInt($scope.zoom, 10) || 0);
            } else if ($scope.zoom) {
              map.setZoom(parseInt($scope.zoom, 10));
            } else if ($scope.center && $scope.center.x && $scope.center.y) {
              map.centerAt(new Point($scope.center.x, $scope.center.y, SPATIAL_REFERENCE));
            }

            map.addLayer(baseLayer);

            map.on('click', () => popup.hide());
            map.on('zoom-start', () => popup.hide());

            dojo.disconnect(map.infoWindow._eventConnections[4]);

            $scope.$on('$destroy', function () {
              map.destroy();
              $(window).off('resize');
            });
          });
      }
    };
  }

  angular.module('asuno').directive('simpleMap', SimpleMap);
})();
