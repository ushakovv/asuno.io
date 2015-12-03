/**
 * Created by vasa on 26.03.14.
 */

(function () {
  'use strict';

  function SimpleMap($q, $http, $compile, httpTemplateCache, SPATIAL_REFERENCE, GIS_LAYERS, $log) {
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

        require(['esri/map', 'esri/config', 'esri/layers/ArcGISTiledMapServiceLayer', 'esri/dijit/Popup', 'dojo/dom-construct', 'esri/geometry/Point', 'esri/dijit/Scalebar', 'esri/geometry/Extent', 'esri/layers/TileInfo'],
          function (Map, config, ArcGISTiledMapServiceLayer, Popup, domConstruct, Point, Scalebar, Extent, TileInfo) {

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

            var baseLayer = new ArcGISTiledMapServiceLayer("http://87.245.154.112/ArcGIS/rest/services/egko_go/MapServer");

            map.addLayer(baseLayer);

            setTimeout(function () {
              map.on('click', function () {
                return popup.hide()
              });

              map.on('zoom-start', function () {
                return popup.hide()
              });

              dojo.disconnect(map.infoWindow._eventConnections[4]);

              $scope.$on('$destroy', function () {
                map.destroy();
                $(window).off('resize');
              });

              map.resize();

              $(window).on('resize.simplemap', function () {
                return map.resize()
              });

              new Scalebar({
                map          : map,
                scalebarUnit : 'metric'
              });

              window.map = map;
              window.ArcGISTiledMapServiceLayer = ArcGISTiledMapServiceLayer;

              if ($scope.zoom && $scope.center && $scope.center.x && $scope.center.y) {
                map.centerAndZoom(new Point($scope.center.x, $scope.center.y, map.spatialReference), parseInt($scope.zoom, 10) || 0);
              } else if ($scope.zoom) {
                map.setZoom(parseInt($scope.zoom, 10));
              } else if ($scope.center && $scope.center.x && $scope.center.y) {
                map.centerAt(new Point($scope.center.x, $scope.center.y, map.spatialReference));
              }
            }, 200);
          });
      }
    };
  }

  angular.module('asuno').directive('simpleMap', SimpleMap);
})();
