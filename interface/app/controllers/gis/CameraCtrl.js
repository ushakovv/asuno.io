/**
 * Created by vasa on 18.08.14.
 */

(function () {
  'use strict';

  function CameraCtrl($scope, $modal) {
    var cc = this;

    cc.showVideo = function () {
      const $child = $scope.$new();
      $child.source = `http://GOST_GR_Pronyayev:17596777@195.208.65.189:8087/embed?id=${$scope.attributes.Id}&toolbar=1&allowControl=1`;

      $modal.open({
        templateUrl : '/assets/templates/modals/camera-modal.html',
        scope       : $child
      });
    };

    cc.connectCamera = function (attributes) {
      var camera = {
        address    : attributes.address,
        stream_uri : attributes.purl,
        uuid       : attributes.Id && attributes.Id.length === 36 ? attributes.Id : void 0,
        m3u8       : attributes.iurl
      };

      $scope.loading = true;

      $scope.child.addCamera(camera)
        .then(() => $scope._layer.refresh())
        .finally(() => $scope.loading = false);
    };

    cc.removeCamera = function (attributes) {
      $scope.loading = true;

      $scope.child.removeCamera(attributes)
        .then(() => $scope._layer.refresh())
        .finally(() => $scope.loading = false);
    };

    cc.isConnected = function (attributes) {
      return $scope.child.cameraExtractor({attributes : attributes}) === 1;
    };
  }

  angular.module('asuno').controller('CameraCtrl', CameraCtrl);
})();
