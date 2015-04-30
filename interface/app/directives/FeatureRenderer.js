/**
 * Created by vasa on 01.07.14.
 */

(function () {
  'use strict';

  angular.module('asuno')
    .directive('featureRenderer', function featureRenderer() {
      return {
        replace    : true,
        transclude : true,
        template   : '<div ng-transclude></div>',
        require    : '^simpleMapLayer',
        scope      : {
          extractor     : '=frExtractor',
          defaultSymbol : '@frDefaultSymbol'
        },
        link       : function (scope, element, attributes, simpleMapLayerCtrl) {
          simpleMapLayerCtrl.featureLayer.then(function (featureLayer) {
            scope.layerDeferred.resolve(featureLayer);
          });
        },
        controller: 'FeatureRendererController as feature'
      };
    })
    .controller('FeatureRendererController', function FeatureRendererController($scope, $q) {
      $scope.layerDeferred = $q.defer();

      $scope.rendererDeferred = $q.defer();

      this.renderer = $scope.rendererDeferred.promise;

      var controller = this;

      $scope.layerDeferred.promise.then(function (featureLayer) {
        require(['esri/renderers/UniqueValueRenderer', 'esri/symbols/PictureMarkerSymbol'],
          function (UniqueValueRenderer, PictureMarkerSymbol) {
            var renderer = new UniqueValueRenderer(new PictureMarkerSymbol($scope.defaultSymbol, 28, 28), $scope.extractor);
            featureLayer.setRenderer(renderer);

            $scope.rendererDeferred.resolve(renderer);

            controller.redraw = function () {
              featureLayer.redraw();
            };
          });
      });
    });

  angular.module('asuno')
    .directive('rendererSetting', function rendererSetting() {
      return {
        replace    : true,
        template   : '<div></div>',
        require    : '^featureRenderer',
        scope      : {
          value  : '@rsValue',
          symbol : '@rsSymbol'
        },
        link       : function (scope, element, attributes, featureRendererCtrl) {
          featureRendererCtrl.renderer.then(function (renderer) {
            scope.rendererDeferred.resolve(renderer);
            scope.featureRendererCtrl = featureRendererCtrl;
          });
        },
        controller: 'RendererSettingController as rendererSetting'
      };
    })
    .controller('RendererSettingController', function RendererSettingController($scope, $q) {
      $scope.rendererDeferred = $q.defer();

      $scope.rendererDeferred.promise.then(function (renderer) {
        require(['esri/symbols/PictureMarkerSymbol'],
          function (PictureMarkerSymbol) {
            renderer.addValue($scope.value, new PictureMarkerSymbol($scope.symbol, 28, 28));
            $scope.featureRendererCtrl.redraw();
          });
      });
    });
})();
