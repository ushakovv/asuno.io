(function() {
  'use strict';

  const _phases = ['A', 'B', 'C'];
  const _contactors = [1, 2, 3, 4, 5, 6];
  const _contactorsNames = [0, 'Ночь', 'Вечер', 'День', 4, 5, 6];
  const _directions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const _popoverTemplate = `
  <div ng-controller="DepEditorDirectionController">
      <button class="btn btn-default btn-block" ng-click="toggleDirection(directionNum, !!direction)" ng-disabled="loading">
      {{ direction ? 'Отключить' : 'Подключить' }}
</button>
<button class="btn btn-default btn-block" ng-click="connectToContactor(direction, 2)" ng-disabled="!isContactorOn(2) || contactorNum === 2 || !direction || loading">
    Контактор "ВЕЧЕР"
</button>
<button class="btn btn-default btn-block" ng-click="connectToContactor(direction, 1)" ng-disabled="!isContactorOn(1) || contactorNum === 1 || !direction || loading">
    Контактор "НОЧЬ"
</button>
<button class="btn btn-default btn-block" ng-click="connectToContactor(direction, 3)" ng-disabled="!isContactorOn(3) || contactorNum === 3 || !direction || loading">
    Контактор "ДЕНЬ"
</button>
</div>
`;

const _contactorPopoverTemplace = `
<div ng-controller="DepEditorContactorController">
    <button class="btn btn-default btn-block" ng-click="toggleContactor(contactorNum, !!contactor)" ng-disabled="loading">
    {{ contactor ? 'Отключить' : 'Подключить' }}
</button>
</div>
`;

angular.module('asuno')
    .directive('depEditor', function depEditor($rootScope, $timeout, $compile) {
      return {
        template: '<div></div>',
        scope: {
          controller: '='
        },
        controller: 'DepEditorController as dep',
        link: function (scope, element) {

          scope.$on('$stateChangeStart', function () {
            $('body').find('.popover').remove();
          });

          function drawContactor(contactorNum) {
            const contactorElement = element.find(`.contactor-group.contactor-group-${contactorNum}`);

            const contactor = scope.controller.contactor(contactorNum);

            if (contactor) {
              element.find(`.contactor-group.contactor-group-${contactorNum}`).css('opacity', 1);
            } else {
              element.find(`.contactor-group.contactor-group-${contactorNum}`).css('opacity', 0.5);
            }

            contactorElement.find('.contactor-group-mini').click(function () {
              element.find('g.contactor-group-mini text[font-size=24]').popover('destroy');
              $('body').find('.popover').remove();

              const $child = $rootScope.$new();
              $child.contactor = contactor;
              $child.contactorNum = contactorNum;
              $child.controller = scope.controller;
              $child.contactorElement = $(this);

              const content = $compile(_contactorPopoverTemplace)($child);

              scope.$apply();

              const contactorName = _contactorsNames[contactorNum];

              $(this).find('text[font-size=24]').popover({
                title: `Контактор ${contactorName}`,
              html: true,
                  content: content,
                  container: 'body',
                  placement: contactorNum === 1 ? 'left' : 'right'
            });

            $timeout(() => {
              $(this).find('text[font-size=24]').popover('show');
          }, 100);
        });
    }

function drawDirection(phase, phaseElement, directionNum) {
  const directionElement = phaseElement.find(`.direction-info.direction-info-${directionNum}`);

  const direction = phase.direction(directionNum);

  let contactorNum;

  directionElement.find('.direction-contactor').css('opacity', 0);

  if (!direction) {
    directionElement.css('opacity', 0.5);
  } else {
    directionElement.css('opacity', 1);
    const contactorIds = scope.controller.contactorIds();

    contactorNum = contactorIds.indexOf(direction.contactor_id) + 1;

    directionElement.find(`.direction-contactor-${contactorNum}`).css('opacity', 1);
  }

  directionElement.click(function () {
    element.find('circle.direction-contactor-3').popover('destroy');
    $('body').find('.popover').remove();

    const $child = $rootScope.$new();
    $child.directionNum = directionNum;
    $child.direction = direction;
    $child.contactorNum = contactorNum;
    $child.controller = scope.controller;
    $child.directionElement = directionElement;

    const content = $compile(_popoverTemplate)($child);

    scope.$apply();

    directionElement.find('circle.direction-contactor-3:first')
        .popover({
          title: `Направление ${directionNum}`,
    html: true,
        content: content,
        container: 'body',
        placement: 'top'
  });

  $timeout(() => {
    directionElement.find('circle.direction-contactor-3:first').popover('show');
}, 100);
});
}

function drawPhase(phaseName) {
  const phaseElement = element.find(`.phase.phase-${phaseName}`);

  var phase = scope.controller.phase(phaseName);

  if (!phase) {
    return phaseElement.hide();
  }

  _directions.forEach(function (directionNum) {
    drawDirection(phase, phaseElement, directionNum);
  });
}

scope.$watch('controller', function (next) {
  if (angular.isObject(next)) {
    _contactors.forEach((contactorNum) => drawContactor(contactorNum));

    _phases.forEach((phaseName) => drawPhase(phaseName));
  }
});
}
};
})
.controller('DepEditorController', function DepEditorController() {

})
    .controller('DepEditorContactorController', function DepEditorContactorController($rootScope, $scope, Scheme) {
      $scope.toggleContactor = function(contactorNum, status) {
        $scope.loading = true;
        let action;
        if (status) {
          action = Scheme.delete_contactor({id: $scope.controller.id, contactor_id : $scope.contactor.id}).$promise;
        } else {
          action = Scheme.add_contactor({id : $scope.controller.id}, {
            name : _contactorsNames[contactorNum], number : contactorNum
          }).$promise;
        }

        action
            .then(() => $rootScope.$broadcast('asuno-refresh-all'))
        .then(() => $scope.contactorElement.find('text[font-size=24]').popover('destroy'))
        .finally(() => $scope.loading = false);
      };
    })
    .controller('DepEditorDirectionController', function DepEditorDirectionController($rootScope, $scope, Scheme) {
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
        .then(() => $scope.directionElement.find('circle.direction-contactor-3:first').popover('destroy'))
        .finally(() => $scope.loading = false);
      };

      $scope.isContactorOn = function (contactorNum) {
        var res = !!$scope.controller.contactor(contactorNum);
        return res;
      };

      $scope.connectToContactor = function (direction, contactorNum) {
        let action = Scheme.set_direction_contactor({id: $scope.controller.id, direction_id: direction.id}, {number : contactorNum }).$promise;

        action
            .then(() => $rootScope.$broadcast('asuno-refresh-all'))
        .then(() => {
          $scope.directionElement.find('circle.direction-contactor-3:first').popover('destroy');
        $('body').find('.popover').remove();
      })
      .finally(() => $scope.loading = false);
    };
});
})();
