/**
 * Created by vasa on 02.07.14.
 */

(function () {
  'use strict';

  var _commands = {
    'lock:lock'               : 'Блокирование управления',
    'lock:unlock'             : 'Разблокирование управления',
    'lock:toggle_lock'        : 'Переключение блокировки управления',
    'mode:evening'            : 'Включение режима "Вечер"',
    'mode:night'              : 'Включение режима "Ночь"',
    'mode:day'                : 'Включение режима "День"',
    'mode:switch_off'         : 'Выключение',
    'control_mode:ta_mode'    : 'Установка телеадресного режима',
    'control_mode:tk_mode'    : 'Установка телекаскадного режима',
    'control_mode:autonomous' : 'Установка автономного режима',
    'dimmer:set_level'        : 'Установка диммера',
    'bypass:switch_on'        : 'Включить байпасс',
    'bypass:switch_off'       : 'Отключить байпасс',
    'time:sync'               : 'Синхронизация времени'
  };

  angular.module('asuno').constant('COMMANDS', _commands);

  angular.module('asuno')
    .directive('controlPane', function controlPane($timeout, $compile, $q, httpTemplateCache, $log) {
      return {
        replace    : true,
        template   : `<div class="control-pane__show" if-has-control ng-class="{'tooltipped tooltipped-n': !selectedControllers.length}" data-tooltip="{{ tooltip }}">
                        <button class="btn btn-default" ng-click="showControl($event)" ng-disabled="!selectedControllers.length">Управление</button>
                      </div>`,
        scope      : true,
        link       : function (scope) {
          var $body = $('body');
          var first = $timeout(function () {
            scope.controlPaneHtml = httpTemplateCache.get('/assets/templates/control-pane.html');
            scope.controlPaneHtml.then(function (html) {
              $compile(html)(scope.$new(), function (pane) {
                $body.append(pane);
                $('#control-pane').on('click', (e) => {
                  $log.debug('click element', e);
                  e.stopPropagation();
                });
              });
            });
          }, 1000);

          scope.showControl = function (e) {
            e.stopPropagation();
            $q.when(scope.controlPaneHtml)
              .then(function () {
                $('#control-pane').addClass('show');
              });
          };

          scope.hideControl = function () {
            $q.when(scope.controlPaneHtml)
              .then(function () {
                $('#control-pane').removeClass('show');
              });
          };

          $body.on('click', scope.hideControl);

          scope.$on('$destroy', function () {
            $timeout.cancel(first);
            $body.off('click', scope.hideControl);
          });
        },
        controller: 'ControlPaneController as controlPane'
      };
    })
    .controller('ControlPaneController', function ControlPaneController($rootScope, $scope, $timeout, $modal, Mute, Auth, ControllersStore, Controllers, MassOperations, EmitEvents, COMMANDS) {
      $scope.updateSelection = function () {
        $scope.selectedControllers = ControllersStore.getSelectedControllers();

        if (!$scope.selectedControllers.length) {
          $scope.tooltip = 'Не выбраны ПП';
        } else {
          delete $scope.tooltip;
        }
        $scope.$applyAsync();
      };

      $scope.updateSelection();

      ControllersStore.addListener(EmitEvents.CONTROLLER_SELECTION, $scope.updateSelection);

      $scope.$on('$destroy', function () {
        ControllersStore.removeListener(EmitEvents.CONTROLLER_SELECTION, $scope.updateSelection);
      });

      $scope.executeCommand = function (command) {
        $scope.blockControl = true;

        var operations = $scope.selectedControllers.map(function (controller) {
          return {
            name    : controller.name,
            promise : function () {
              return Controllers.change({controller : controller.id}, {command}).$promise;
            },
            toRdp   : {controller_id : controller.id, command}
          };
        });

        var operation = MassOperations.createOperation(COMMANDS[command], operations, Auth.isSupervisor());

        $rootScope.$broadcast('asuno-progress-start', operation);

        operation.finished.finally(function () {
          $rootScope.$broadcast('asuno-refresh-all');
          $scope.blockControl = false;
        });
      };

      $scope.hasCommand = function (command) {
        return _($scope.selectedControllers)
          .any((controller) => controller.available_commands.indexOf(command) >= 0);
      };

      $scope.maintenance = function () {
        $modal.open({
          templateUrl : '/assets/templates/modals/maintenance-modal.html',
          scope       : $scope.$new(),
          controller  : 'MaintenancePopupCtrl'
        });
      };

      $scope.kvit = function () {
        $scope.blockControl = true;

        var operations = $scope.selectedControllers.map(function (controller) {
          return {
            name    : controller.name,
            promise : () => Mute.mute_controller({id : controller.id}, {}).$promise
          };
        });

        var operation = MassOperations.createOperation('Квитирование', operations);

        operation.finished.finally(function () {
          $rootScope.$broadcast('asuno-refresh-all');
          $scope.blockControl = false;
        });

        $rootScope.$broadcast('asuno-progress-start', operation);

        $timeout(() => delete $scope.blockControl, 2000);
      };
    });
})();
