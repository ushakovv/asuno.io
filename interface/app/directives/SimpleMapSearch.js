/**
 * Created by vasa on 02.09.14.
 */

(function () {
  'use strict';

  angular.module('asuno')
    .directive('simpleMapSearch', function simpleMapSearch($q) {
      return {
        replace     : true,
        templateUrl : '/assets/templates/gis-search.html',
        require     : '^simpleMap',
        link        : function (scope, element, attributes, simpleMapCtrl) {
          $q.when(simpleMapCtrl.map)
            .then(function (map) {
              scope.mapDeferred.resolve(map);
              scope.simpleMapCtrl = simpleMapCtrl;
            });
        },
        controller: 'SimpleMapSearchController as simpleMapSearch'
      };
    })
    .controller('SimpleMapSearchController', function SimpleMapSearchController($scope, $q, EverGisLocator, SPATIAL_REFERENCE) {
      $scope.mapDeferred = $q.defer();

      $scope.search = function (query) {
        return EverGisLocator.addressSearch(query);
      };

      var controller = this;

      require(['esri/geometry/Point', 'esri/graphic', 'esri/symbols/PictureMarkerSymbol'],
        function (Point, Graphic, PictureMarkerSymbol) {
          $q.when($scope.mapDeferred.promise)
            .then(function (map) {

              controller.graphic = null;

              var marker = new PictureMarkerSymbol('/assets/img/marker.png', 25, 41);
              marker.setOffset(25 / 4, 41 / 4);

              $scope.locationDone = function (item) {
                var point = new Point(item.location.x, item.location.y, SPATIAL_REFERENCE);
                map.centerAndZoom(point, 17);

                if (controller.graphic) {
                  map.graphics.remove(controller.graphic);
                }
                controller.graphic = new Graphic(point, marker);
                map.graphics.add(controller.graphic);
              };

              $scope.cleanSearch = function () {
                $scope.queryText = '';
                map.graphics.remove(controller.graphic);
              };
            });
        });
    });
})();
