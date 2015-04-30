/**
 * Created by vasa on 11.06.14.
 */

(function () {
  'use strict';

  angular.module('asuno')
    .directive('cameraBlock', function cameraBlock() {
      return {
        templateUrl : '/assets/templates/camera-block.html',
        replace     : true,
        scope       : {
          camera : '=cameraBlock'
        },
        controller: 'CameraBlockController as cameraBlock'
      };
    })
    .controller('CameraBlockController', function CameraBlockController($scope, $rootScope, $modal, Cameras, confirmation, inform) {
      $scope.archiveTooltip = function () {
        return $scope.camera.uuid ? 'Архив' : 'Архив не доступен для камер без идентификатора';
      };
      $scope.galleryTooltip = function () {
        return $scope.camera.uuid ? 'Снимки' : 'Снимки не доступны для камер без идентификатора';
      };

      $scope.deleteCamera = function (camera) {
        confirmation('Вы уверены что хотите удалить камеру?').then(() => {
          Cameras.delete({id : camera.id}, () => $rootScope.$broadcast('asuno-refresh-all'));
        });
      };

      $scope.showVideo = function (showArchive) {
        $modal.open({
          templateUrl : '/assets/templates/modals/video-modal.html',
          size        : 'lg',
          scope       : $scope.$new(),
          controller  : function (Modernizr) {
            $scope.supportsStreaming = Modernizr.supportsVideoFormat('application/x-mpegURL');

            $scope.showArchive = showArchive;

            $scope.source = `http://GOST_GR_Pronyayev:17596777@195.208.65.189:8087/embed?id=${$scope.camera.uuid}&toolbar=1&allowControl=1`;
            if ($scope.showArchive) {
              $scope.source = `${$scope.source}&archive=1`;
            }

            $scope.getSnapshot = function () {
              Cameras.snapshot({id : $scope.camera.id}, {}, () => inform('Снимок будет сделан в ближайшее время'));
            };
          }
        });
      };

      $scope.showGallery = function () {
        $modal.open({
          templateUrl : '/assets/templates/modals/camera-gallery-modal.html',
          size        : 'lg',
          scope       : $scope.$new(),
          controller  : function ($rootScope, $scope, $log, Cameras) {
            function loadCameras() {
              Cameras.get({id : $scope.camera.id}, (camera) => $scope.photos = camera.snapshots);
            }

            loadCameras();

            $scope.saveComment = function (photo) {
              Cameras.comment({id : photo.id}, {comment : photo.comment}, () => $rootScope.$broadcast('asuno-refresh-all'));
            };

            $scope.getSnapshot = function () {
              Cameras.snapshot({id : $scope.camera.id}, {}, () => inform('Снимок будет сделан в скором времени'));
            };
          }
        });
      };

      $scope.showEditModal = function () {
        $modal.open({
          templateUrl : '/assets/templates/modals/camera-edit-modal.html',
          size        : 'lg',
          scope       : $scope.$new(),
          controller  : function ($scope, $rootScope, $modalInstance, Cameras) {
            $scope.newCamera = angular.copy($scope.camera);

            $scope.saveCamera = function (newCamera) {
              delete $scope.success;
              delete $scope.error;

              Cameras.update({id : $scope.camera.id}, {
                address     : newCamera.address,
                stream_uri  : newCamera.stream_uri,
                m3u8        : newCamera.m3u8,
                description : newCamera.description ? newCamera.description : void 0,
                uuid        : newCamera.uuid ? newCamera.uuid : void 0
              }, function () {
                $scope.success = 'Данные успешно сохранены.';
                $rootScope.$broadcast('asuno-refresh-all');
              }, function () {
                $scope.error = 'Произошла ошибка. Повторите запрос позднее.';
              });
            };
          }
        });
      };
    });

})();
