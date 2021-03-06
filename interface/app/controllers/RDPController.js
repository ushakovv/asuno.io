/**
 * Created by vasa on 26.03.14.
 */

(function () {
  'use strict';


  function RDPController($log, $rootScope, $scope, $state, $window, $stateParams, Controllers, ControllersStore, Monitors, FilterSvc, FILTER_CONFIGS, FILTER_CONFIGS_BATCH, ControllersActions, Mutex, tickEvent, initial) {
    var mutex = Mutex.create();
    var RDPGroup = false;

    $scope.alertsGridOptions.columnDefs[2].visible = false;

    $scope.rdp = initial.rdp;

    // TODO убрать нафиг когда Лёха поправит сервер
    $rootScope._rdpId = initial.rdp.id;

    $log.debug('RDPController');

    if(!initial.rdp.slug){
      angular.extend(initial.rdp, {
        name: "Группы РДП",
        slug: "rdpgroup"
      });

      RDPGroup = true;
    }

    function sEmergency(a, b) { // По возрастанию
      var one, two;

      for(var i= 0; i < a.alarms.common_alarm.length; ++i){
        if(a.alarms.common_alarm[i].payload == "emergency") one = true;
      }

      for(var k= 0; k < b.alarms.common_alarm.length; ++k){
        if(b.alarms.common_alarm[k].payload == "emergency") two = true;
      }


      if (one && !two)
        return -1;
      else if (!one && two)
        return 1;
      else
        return 0;
    }

    if (initial.rdp.slug.indexOf('akhp') >= 0) {
      $scope.crumbs = [{
        name: 'Объекты АХП'
      }];
    } else if (initial.rdp.slug === 'kulon') {
      $scope.crumbs = [{
        name: 'Групповые регуляторы'
      }];
    } else {
      $scope.crumbs = [
        {
          name: 'Объекты НО',
          href: $state.href('core.rdps')
        }
      ];
    }

    $scope.crumbs = $scope.crumbs.concat([{
      name: $scope.rdp.name
    }]);

    if(RDPGroup) {
      $scope.crumbs = [];
    }

    $rootScope.isLoadingPage = false;

    const _dateBegin = moment();
    const _defaultDateFrom = _dateBegin.add(-7, 'd').startOf('d').toDate();

    $scope.filters = {
      dateFrom: _defaultDateFrom
    };
    const _setContrillerLink = function _setContrillerLink(controller) {
      let hrefState;
      if (controller.is_cascade) {
        hrefState = $state.href('core.controllerSpecial', {
          rdp: $scope.rdp.slug,
          controller: controller.id
        });
      } else {
        hrefState = $state.href('core.controller', {
          rdp: $scope.rdp.slug,
          controller: controller.id
        });
      }
      controller.href = hrefState;
    };
    var setControllers = function (controllers) {
      FilterSvc.clear();
      controllers.forEach(FilterSvc.parseController, FilterSvc);
      controllers.forEach(_setContrillerLink);

      if(RDPGroup){
        controllers.sort(sEmergency);
      }

      ControllersActions.setControllers(controllers);

      $scope.controllers = controllers;
    };

    setControllers(initial.controllers);

    var reloadControllers = function () {
      if (!mutex.isLocked() && !$rootScope.isJournalTab()) {
        mutex.lock();
        var query = {
          sid: $scope.rdp.sid,
          head: 1
        };

        Controllers.query(query, function (controllers) {
          setControllers(controllers);
          mutex.release();
        });
      }
    };

    $scope.$on(tickEvent, reloadControllers);

    $scope.$on('asuno-refresh-all', reloadControllers);

    $scope.child = $scope.$new();
    $scope.center = {
      x: parseFloat($stateParams.x) || $scope.rdp.latitude,
      y: parseFloat($stateParams.y) || $scope.rdp.longitude
    };

    $scope.rid = parseInt($stateParams.rid, 10) || $scope.rdp.gis_id;
    $scope.ctrlExtract = function (graphic) {
      var ctrl = $scope.pointConnect(graphic.attributes);
      if (!ctrl) {
        return -1;
      } else if (_.any(ctrl.alarms, Monitors.isActive)) {
        return -2;
      } else if (ctrl.enabled) {
        return 1;
      } else {
        return 0;
      }
    };

    $scope.selectController = function (controller) {
      if (controller.is_cascade) {
        $state.go('core.controllerSpecial', {
          rdp: $scope.rdp.slug,
          controller: controller.id
        });
      } else {
        $state.go('core.controller', {
          rdp: $scope.rdp.slug,
          controller: controller.id
        });
      }
    };

    $scope.selectRdp = function (rdp, graphic) {
      $state.go('core.rdp', {
        rdp: rdp.slug,
        x: graphic.geometry.x,
        y: graphic.geometry.y,
        rid: graphic.attributes.DISPATCHER_ID
      });
    };

    $scope.filterController = function (ctrl) {
      var key = FILTER_CONFIGS[ControllersStore.getFilterKey()] || 'id';

      var filtered = !!(ctrl[key] || ctrl.alarms[key] && ctrl.alarms[key].length);

      if (filtered) {
        switch (key) {
          case 'connection':
          case 'fire':
          case 'common_alarm':
            filtered = _.any(ctrl.alarms[key], (obj) => obj.value === 1);
            break;
          case 'door':
            filtered = _.any(ctrl.alarms[key], (door) => door.value === 0);
            break;
          default:
            break;
        }
      }
      if (!ControllersStore.getShowAutonomous()) {
        filtered = filtered && !ctrl.is_autonomous;
      }
      return filtered;
    };

    $scope.pointFilter = function (attributes) {
      if (attributes.db_DISPATCHER_ID) {
        return attributes.db_DISPATCHER_ID === $scope.rid || _.any($scope.controllers, (c) => c.gis_id === attributes.PP_ID);
      } else {
        return _.any($scope.controllers, (c) => c.gis_id === attributes.PP_ID);
      }
    };

    let cabelsId = [];

    Controllers.all_cables({}, {}).$promise
        .then((data) => {
        cabelsId = [];
        data.cables.forEach(function(cable) { cabelsId.push(cable.cable_id); });
     });

    $scope.lepFilter = function (attributes) {
      return cabelsId.indexOf(attributes.CABEL_ID) > 0;
    };


    $scope.pointConnect = function (attributes) {
      return _.find($scope.controllers, function (controller) {
        return controller.gis_id === attributes.PP_ID;
      });
    };

    $scope.rdpConnect = function (attributes) {
      return _.find($scope.rdps, function (rdp) {
        return rdp.gis_id === attributes.DISPATCHER_ID;
      });
    };

    $scope.rdpExtract = function (graphic) {
      var point = $scope.rdpConnect(graphic.attributes);

      if (!point) {
        return void 0;
      }

      if (point.fire || point.door || point.connection || point.common_alarm || point.lock) {
        return -1;
      } else if (point.enabled > 0) {
        return 0;
      } else {
        return 1;
      }
    };

    $scope.filterToday = function () {
      if (!$scope.filters.filterToday) {
        $scope.filters.filterToday = true;
        var today = moment().startOf('day').toDate();
        var tomorrow = moment().add(1, 'd').startOf('day').toDate();

        angular.extend($scope.filters, {
          dateFrom: today,
          dateTo: tomorrow
        });
      } else {
        delete $scope.filters.filterToday;

        angular.extend($scope.filters, {
          dateFrom: _defaultDateFrom,
          dateTo: null
        });
      }
    };

    $scope.filterAlarms = function () {
      if ($scope.filters.alarms === 1) {
        delete $scope.filters.alarms;
      } else {
        $scope.filters.alarms = 1;
      }
    };

    $scope.filterUnacknowledged = function () {
      if ($scope.filters.unacknowledged === 1) {
        delete $scope.filters.unacknowledged;
        delete $scope.filters.alarms;
      } else {
        $scope.filters.unacknowledged = 1;
        $scope.filters.alarms = 1;
      }
    };

    $scope.selectJournalController = function (controller) {
      $scope.filters.controller = controller;
    };

    $scope.$watch('filters', function (next) {
      next = next || {};
      $scope.load_alarms({
        sid: next.controller ? next.controller.sid : $scope.rdp.sid,
        after: next.dateFrom,
        before: next.dateTo,
        alarms: next.alarms,
        unacknowledged: next.unacknowledged
      });
    }, true);

    $rootScope.journalInOtherTab = false;
    $scope.$on('$viewContentLoaded', function(){
      if ( $state.params.journalExpand ) {
        $rootScope.expandJournal();
      } else {
        $rootScope.constrictJournal();
      }
    });
    $scope.lastAction = Monitors.lastAction;
  }

  angular.module('asuno').controller('RDPController', RDPController);
})();
