/**
 * Created by vasa on 01.07.14.
 */

(function () {
  'use strict';

  function simpleMapLayer($q, $compile, httpTemplateCache, GIS_LAYERS) {
    return {
      require    : '^simpleMap',
      replace    : true,
      transclude : true,
      template   : '<div ng-transclude></div>',
      scope      : {
        layer            : '@simpleMapLayer',
        show             : '@',
        points           : '=smlPoints',
        pointConnect     : '=smlPointConnect',
        where            : '@smlWhere',
        pointClick       : '=smlPointClick',
        pointFilter      : '=smlPointFilter',
        popupTemplate    : '@smlPopupTemplate',
        popupTemplateUrl : '@smlPopupTemplateUrl',
        titleTemplate    : '@smlTitleTemplate',
        parentScope      : '=smlParentScope',
        closeModal  : '=smlCloseModal'
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
      controller : function ($scope) {

        var layerConfig = GIS_LAYERS[$scope.layer];
        $scope.layerUrl = layerConfig.url;
        $scope.dataAttributes = layerConfig.dataAttributes;

        $scope.mapDeferred = $q.defer();
        $scope.popupDeferred = $q.defer();
        $scope.elementDeferred = $q.defer();

        var deferredFeatureLayer = $q.defer();

        var recalculateTemplate = true;

        this.featureLayer = deferredFeatureLayer.promise;

        $q.all([$scope.mapDeferred.promise, $scope.popupDeferred.promise, $scope.elementDeferred.promise])
          .then(function (promises) {
            var map = promises[0];
            var popup = promises[1];
            var element = promises[2];

            require(['esri/layers/FeatureLayer', 'esri/dijit/PopupTemplate', 'esri/tasks/query'],
              function (FeatureLayer, PopupTemplate, Query) {

                var options = {
                  dataAttributes : $scope.dataAttributes,
                  infoTemplate   : new PopupTemplate()
                };

                if (!layerConfig.tooMuchData) {
                  angular.extend(options, {
                    minScale : 0,
                    maxScale : 0
                  });
                }

                var featureLayer = new FeatureLayer($scope.layerUrl, options);

                if (layerConfig.filter) {
                  $scope.featureLayer = featureLayer;

                  $scope.$watch('featureLayer.filter', function (next, prev) {
                    if (!angular.equals(next, prev)) {
                      featureLayer.refresh();
                    }
                  }, true);
                }

                if (layerConfig.invisible && !$scope.show) {
                  featureLayer.setVisibility(false);
                }

                $scope.simpleMapCtrl.addLayer($scope.layer, featureLayer);

                deferredFeatureLayer.resolve(featureLayer);

                map.addLayer(featureLayer);

                var titleTemplate = ($scope.titleTemplate || layerConfig.titleTemplate || '')
                  .replace(/\[\[/g, '{{').replace(/]]/g, '}}');

                var popupTemplate = $scope.popupTemplate;
                if (!$scope.popupTemplate) {
                  popupTemplate = httpTemplateCache
                    .get($scope.popupTemplateUrl || layerConfig.popupTemplateUrl);
                }

                var genTemplate = function () {
                  if (recalculateTemplate) {
                    var current = popup.getSelectedFeature();
                    if (current && featureLayer.graphics.indexOf(current) >= 0) {

                      var child = $scope.parentScope.$new();

                      child.attributes = current.attributes;
                      child._layer = featureLayer;
                      if (angular.isFunction($scope.pointConnect)) {
                        child.point = $scope.pointConnect(current.attributes);
                      }

                      if ( angular.isFunction($scope.closeModal) ) {
                        child.closeModal = $scope.closeModal;
                      }

                      $q.when(popupTemplate).then(function (tmpl) {
                        $compile(tmpl)(child, function (content) {
                          $compile(titleTemplate)(child, function (title) {
                            popup.setTitle('');
                            $('div.esriPopup div.titlePane div.title').empty().append(title);
                            $('div.esriPopup div.contentPane').empty().append(content);

                            if (child.point) {
                              $('div.esriPopup .action.zoomTo').text('Выбрать');
                            } else {
                              $('div.esriPopup .action.zoomTo').text('');
                            }
                          });
                        });
                      });
                    }
                  }
                };

                popup.on('show', genTemplate);
                popup.on('selection-change', genTemplate);

                if ($scope.where) {
                  var q = new Query();
                  q.where = $scope.where;
                  q.returnGeometry = true;
                  q.outFields = ['*'];

                  featureLayer.queryFeatures(q, function (result) {
                    if (result && result.features && result.features.length > 0) {
                      setTimeout(function () {
                        map.centerAt(result.features[0].geometry);
                      }, 300);
                    }
                  });
                }

                if (angular.isFunction($scope.pointFilter)) {
                  featureLayer.on('graphic-add', function (element) {
                    if (!$scope.pointFilter(element.graphic.attributes)) {
                      element.graphic.hide();
                    } else if (layerConfig.filter && $scope.featureLayer.filter) {
                      Object.keys(element.graphic.attributes).forEach(function (key) {
                        if ($scope.featureLayer.filter.hasOwnProperty(key) && element.graphic.attributes[key] !== $scope.featureLayer.filter[key]) {
                          element.graphic.hide();
                        }
                      });

                      if ($scope.featureLayer.filter.has_point) {
                        if (!$scope.pointConnect(element.graphic.attributes)) {
                          element.graphic.hide();
                        }
                      }
                    }
                  });
                }

                dojo.connect(featureLayer, 'onMouseMove', function (evt) {
                  var g = evt.graphic;
                  recalculateTemplate = !popup.features || popup.features.length === 0 || popup.features[0] !== g;

                  if (recalculateTemplate) {
                    popup.setFeatures([g]);
                    popup.select(0);
                  }

                  if (g.geometry.x && g.geometry.y) {
                    popup.show(g.geometry);
                  } else {
                    popup.show(evt.mapPoint);
                  }

                  return true;
                });

                var goto_current = function () {
                  $scope.$apply(function () {
                    var current = popup.getSelectedFeature();
                    if (featureLayer.graphics.indexOf(current) >= 0) {
                      $scope.pointClick($scope.pointConnect ? $scope.pointConnect(current.attributes) : null, current);
                      featureLayer.refresh();
                    }
                  });
                };
                element.on('click', '.action.zoomTo', goto_current);
                element.on('dblclick', '#map_graphics_layer', goto_current);
              });
          });
      }
    };
  }

  angular.module('asuno').directive('simpleMapLayer', simpleMapLayer);
})();
