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

          scope.$on('$stateChangeStart', function() {
            $('body').find('.popover').remove();
          });

          window._controller = scope.controller;

          const directionElementsList = {};

          function redrawDirection(directionNum) {
            const direction = scope.controller.direction(directionNum);
            let opacity = !direction ? 0.5 : 1;
            directionElementsList[directionNum].css('opacity', opacity);
          }

          function drawDirection(directionNum) {
            const directionElement = element.find( `.direction.direction-${directionNum}`),
              directionElementInfo = directionElement.find(`.direction-info.direction-info-${directionNum}`),
              direction = scope.controller.direction(directionNum);

            directionElementsList[directionNum] = directionElement;

            let opacity = !direction ? 0.5 : 1;
            directionElement.css('opacity', opacity);

            directionElement.click(function () {
              directionElementInfo.popover('destroy');

              const $child = $rootScope.$new();
              $child.directionNum = directionNum;
              $child.direction = scope.controller.direction(directionNum);
              $child.controller = scope.controller;
              $child.directionElement = directionElement;

              const content = $compile(_popoverTemplate)($child);

              scope.$apply();

              function showPopover() {
                let popover = $('body').find('.popover');
                if (popover.length) {
                  popover.remove();
                  setTimeout(showPopover, 100);
                } else {
                  directionElementInfo.popover({
                    title: `Направление ${directionNum}`,
                    html: true,
                    content: content,
                    container: 'body',
                    placement: 'top'
                  });
                  directionElementInfo.popover('show');
                }
              }
              $('body').find('.popover').remove();
              setTimeout(showPopover, 150);
            });
          }

          _directions.forEach(drawDirection);
          scope.$watch('controller', function (next) {
            if (angular.isObject(next)) {
              _directions.forEach(redrawDirection);
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
    });
})();
