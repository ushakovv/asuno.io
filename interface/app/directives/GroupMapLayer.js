/**
 * Created by vasa on 18.08.14.
 */

(function () {
  'use strict';

  angular.module('asuno')
    .directive('groupMapLayer', function groupMapLayer($q) {
      return {
        require    : '^simpleMap',
        replace    : true,
        transclude : true,
        template   : '<div ng-transclude></div>',
        scope      : {
          layer : '@groupMapLayer'
        },
        link       : function (scope, element, attributes, simpleMapCtrl) {
          $q.all([simpleMapCtrl.map, simpleMapCtrl.popup, simpleMapCtrl.element])
            .then(function (promises) {
              scope.mapDeferred.resolve(promises[0]);
              scope.popupDeferred.resolve(promises[1]);
              scope.elementDeferred.resolve(promises[2]);

              scope.simpleMapCtrl = simpleMapCtrl;
            });
        },
        controller: 'GroupMapLayerController as groupMapLayer'
      };
    })
    .controller('GroupMapLayerController', function GroupMapLayerController($scope, $q, GIS_LAYERS) {
      var layerConfig = GIS_LAYERS[$scope.layer];

      $scope.mapDeferred = $q.defer();
      $scope.popupDeferred = $q.defer();
      $scope.elementDeferred = $q.defer();

      var deferredFeatureLayer = $q.defer();

      this.featureLayer = deferredFeatureLayer.promise;

      $q.all([$scope.mapDeferred.promise, $scope.popupDeferred.promise, $scope.elementDeferred.promise])
        .then(function (promises) {
          var map = promises[0];
          var popup = promises[1];

          require(['esri/layers/ArcGISDynamicMapServiceLayer'],
            function (ArcGISDynamicMapServiceLayer) {

              var groupLayer = new ArcGISDynamicMapServiceLayer(layerConfig.url);
              groupLayer.setVisibility(!layerConfig.invisible);

              groupLayer.on('load', function () {
                groupLayer.setVisibleLayers(layerConfig.layers.map(function (l) {
                  return l.num;
                }));
                $scope.simpleMapCtrl.addGroupLayer($scope.layer, groupLayer);
              });

              deferredFeatureLayer.resolve(groupLayer);

              map.addLayer(groupLayer);

              dojo.connect(groupLayer, 'onMouseMove', function () {
                popup.hide();
                return true;
              });
            });
        });
    });
})();
