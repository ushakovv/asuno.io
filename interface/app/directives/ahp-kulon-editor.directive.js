(function() {
  'use strict';

  const _directions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  const _popoverTemplate = `
    <div ng-controller="AhpKulonEditorDirectionController">
      <button class="btn btn-default btn-block" ng-click="toggleDirection(directionNum, !!direction)" ng-disabled="loading">
        {{ direction ? 'Отключить' : 'Подключить' }}
      </button>
    </div>
  `;

  angular.module('asuno')
    .directive('ahpKulonEditor', function ahpKulonEditor($rootScope, $timeout, $compile) {
      return {
        template: '<div></div>',
        scope: {
          controller: '='
        },
        controller: 'AhpKulonEditorController as dep',
        link: function (scope, element) {

          scope.$on('$stateChangeStart', function () {
            $('body').find('.popover').remove();
          });

          window._controller = scope.controller;

          function drawDirection(directionNum) {
            const directionElement = element.find( `.direction.direction-${directionNum}`);
            const direction = scope.controller.direction(directionNum);

            if (!direction) {
              directionElement.css('opacity', 0.5);
            } else {
              directionElement.css('opacity', 1);
            }

            directionElement.click(function () {
              directionElement.find(`.direction-info.direction-info-${directionNum}`).popover('destroy');
              $('body').find('.popover').remove();

              const $child = $rootScope.$new();
              $child.directionNum = directionNum;
              $child.direction = direction;
              $child.controller = scope.controller;
              $child.directionElement = directionElement;

              const content = $compile(_popoverTemplate)($child);

              scope.$apply();

              directionElement.find(`.direction-info.direction-info-${directionNum}`)
                .popover({
                  title: `Направление ${directionNum}`,
                  html: true,
                  content: content,
                  container: 'body',
                  placement: 'top'
                });

              $timeout(() => {
                directionElement.find(`.direction-info.direction-info-${directionNum}`).popover('show');
              }, 100);
            });
          }

          scope.$watch('controller', function (next) {
            if (angular.isObject(next)) {
              _directions.forEach(drawDirection);
            }
          });
        }
      };
    })
    .controller('AhpKulonEditorController', function AhpKulonEditorController() {

    })
    .controller('AhpKulonEditorDirectionController', function AhpKulonEditorDirectionController($rootScope, $scope, Scheme) {
      $scope.toggleDirection = function(directionNum, status) {
        $scope.loading = true;
        let action;
        if (status) {
          action = Scheme.delete_direction({id: $scope.controller.id, number: directionNum}).$promise;
        } else {
          action = Scheme.add_direction({id: $scope.controller.id}, {number: directionNum}).$promise;
        }

        action
          .then(() => $rootScope.$broadcast('asuno-refresh-all'))
          .then(() => $scope.directionElement.find(`.direction-info.direction-info-${directionNum}`).popover('destroy'))
          .finally(() => $scope.loading = false);
      };

      $scope.connectToContactor = function (direction, contactorNum) {
        let action = Scheme.set_direction_contactor({id: $scope.controller.id, direction_id: direction.id}, {number : contactorNum + 1}).$promise;

        action
          .then(() => $rootScope.$broadcast('asuno-refresh-all'))
          .then(() => {
            $scope.directionElement.find('circle.direction-contactor-1:first').popover('destroy');
            $('body').find('.popover').remove();
          })
          .finally(() => $scope.loading = false);
      };
    });
})();
